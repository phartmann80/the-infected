export type VoiceAudioFormat = 'wav' | 'mp3' | 'ogg';

export interface GameNarrationRequest {
  readonly requestId: string;
  readonly sceneId: string;
  readonly speakerId: string;
  readonly text: string;
  readonly locale: string;
  readonly voiceProfileId: string;
  readonly format?: VoiceAudioFormat;
}

export interface VoiceAssetDescriptor {
  readonly assetId: string;
  readonly provider: 'mock' | 'voicebox-local';
  readonly status: 'dry-run' | 'queued' | 'ready';
  readonly audioUri: string;
  readonly mimeType: string;
  readonly sha256: string | null;
  readonly requestId: string;
  readonly sceneId: string;
  readonly speakerId: string;
  readonly text: string;
  readonly voiceProfileId: string;
  readonly canonical: false;
}

export interface VoiceProvider {
  readonly id: VoiceAssetDescriptor['provider'];
  generate(request: GameNarrationRequest): Promise<VoiceAssetDescriptor>;
}

/**
 * Mastra owns workflow orchestration on the server. The game-facing contract
 * stays independent of the Mastra SDK so Android never imports it or receives
 * provider credentials.
 */
export interface MastraNarrationWorkflow {
  prepareNarration(request: GameNarrationRequest): Promise<GameNarrationRequest>;
}

export interface GameAIGateway {
  generateNarration(request: GameNarrationRequest): Promise<VoiceAssetDescriptor>;
}

function validateRequest(request: GameNarrationRequest): void {
  const requiredFields: Array<Exclude<keyof GameNarrationRequest, 'format'>> = [
    'requestId',
    'sceneId',
    'speakerId',
    'text',
    'locale',
    'voiceProfileId',
  ];
  for (const field of requiredFields) {
    if (!request[field].trim()) throw new Error(`Narration request requires ${field}.`);
  }
}

export class ServerGameAIGateway implements GameAIGateway {
  constructor(
    private readonly voiceProvider: VoiceProvider,
    private readonly mastraWorkflow?: MastraNarrationWorkflow,
  ) {}

  async generateNarration(request: GameNarrationRequest): Promise<VoiceAssetDescriptor> {
    validateRequest(request);
    const preparedRequest = this.mastraWorkflow
      ? await this.mastraWorkflow.prepareNarration(request)
      : request;
    validateRequest(preparedRequest);
    return this.voiceProvider.generate(preparedRequest);
  }
}

/**
 * Safe local test provider. It produces a descriptor only and never contacts a
 * model, writes audio, or leaves the server boundary.
 */
export class MockVoiceProvider implements VoiceProvider {
  readonly id = 'mock' as const;

  async generate(request: GameNarrationRequest): Promise<VoiceAssetDescriptor> {
    return {
      assetId: `mock-voice-${request.requestId}`,
      provider: this.id,
      status: 'dry-run',
      audioUri: `mock://voice/${encodeURIComponent(request.requestId)}`,
      mimeType: 'audio/mpeg',
      sha256: null,
      requestId: request.requestId,
      sceneId: request.sceneId,
      speakerId: request.speakerId,
      text: request.text,
      voiceProfileId: request.voiceProfileId,
      canonical: false,
    };
  }
}

export interface VoiceboxLocalProviderOptions {
  readonly baseUrl?: string;
  readonly engine?: string;
  readonly pollIntervalMs?: number;
  readonly timeoutMs?: number;
  readonly fetchImpl?: typeof fetch;
}

type VoiceboxPayload = Record<string, unknown>;

function stringValue(payload: VoiceboxPayload, ...keys: string[]): string | null {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === 'string' && value.trim()) return value;
  }
  return null;
}

function endpointUrl(baseUrl: string, endpoint: string): string {
  return new URL(endpoint, `${baseUrl.replace(/\/+$/, '')}/`).toString();
}

/**
 * Local Voicebox REST adapter. It requires no cloud key and must only be
 * constructed inside the server process. The Android client sees only the
 * gateway's asset descriptor.
 */
export class VoiceboxLocalProvider implements VoiceProvider {
  readonly id = 'voicebox-local' as const;
  private readonly baseUrl: string;
  private readonly engine: string | undefined;
  private readonly pollIntervalMs: number;
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;

  constructor(options: VoiceboxLocalProviderOptions = {}) {
    this.baseUrl = options.baseUrl || process.env.VOICEBOX_LOCAL_URL || 'http://127.0.0.1:17493';
    this.engine = options.engine || process.env.VOICEBOX_ENGINE || undefined;
    this.pollIntervalMs = options.pollIntervalMs ?? Number(process.env.VOICEBOX_POLL_INTERVAL_MS || 250);
    this.timeoutMs = options.timeoutMs ?? Number(process.env.VOICEBOX_TIMEOUT_MS || 120000);
    this.fetchImpl = options.fetchImpl || fetch;
  }

  async generate(request: GameNarrationRequest): Promise<VoiceAssetDescriptor> {
    const language = request.locale.split('-')[0] || request.locale;
    const body: VoiceboxPayload = {
      profile_id: request.voiceProfileId,
      text: request.text,
      language,
    };
    if (this.engine) body.engine = this.engine;

    const response = await this.fetchImpl(endpointUrl(this.baseUrl, '/generate'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const payload = await this.readPayload(response, 'Voicebox generation request');
    const generationId = stringValue(payload, 'generation_id', 'id');
    if (!generationId) throw new Error('Voicebox returned no generation id.');

    const completed = await this.waitForCompletion(generationId, payload);
    const audioUri = stringValue(completed, 'audio_url', 'audio_uri') || endpointUrl(this.baseUrl, `/audio/${encodeURIComponent(generationId)}`);
    return {
      assetId: `voicebox-${generationId}`,
      provider: this.id,
      status: 'ready',
      audioUri,
      mimeType: 'audio/wav',
      sha256: null,
      requestId: request.requestId,
      sceneId: request.sceneId,
      speakerId: request.speakerId,
      text: request.text,
      voiceProfileId: request.voiceProfileId,
      canonical: false,
    };
  }

  private async readPayload(response: Response, action: string): Promise<VoiceboxPayload> {
    const text = await response.text();
    let payload: unknown = null;
    try { payload = text ? JSON.parse(text) : null; } catch { payload = null; }
    if (!response.ok) throw new Error(`${action} failed with HTTP ${response.status}.`);
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error(`${action} returned invalid JSON.`);
    return payload as VoiceboxPayload;
  }

  private async waitForCompletion(generationId: string, initialPayload: VoiceboxPayload): Promise<VoiceboxPayload> {
    const startedAt = Date.now();
    let payload = initialPayload;
    let status = stringValue(payload, 'status');
    while (status && !['completed', 'complete', 'ready', 'failed', 'error'].includes(status.toLowerCase())) {
      if (Date.now() - startedAt >= this.timeoutMs) throw new Error(`Voicebox generation timed out: ${generationId}`);
      await new Promise(resolve => setTimeout(resolve, this.pollIntervalMs));
      const pollPath = stringValue(payload, 'poll_url') || `/generate/${encodeURIComponent(generationId)}/status`;
      const response = await this.fetchImpl(endpointUrl(this.baseUrl, pollPath), { method: 'GET' });
      payload = await this.readPayload(response, 'Voicebox generation status request');
      status = stringValue(payload, 'status');
    }
    if (status && ['failed', 'error'].includes(status.toLowerCase())) {
      throw new Error(`Voicebox generation failed: ${generationId}`);
    }
    return payload;
  }
}

export function createMockGameAIGateway(): GameAIGateway {
  return new ServerGameAIGateway(new MockVoiceProvider());
}
