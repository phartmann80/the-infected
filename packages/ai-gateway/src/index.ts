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
  readonly status: 'dry-run' | 'ready';
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

/**
 * Contract for a local Voicebox implementation. The concrete adapter belongs
 * in the server process and can use Voicebox REST, MCP, or a direct local
 * process without changing the Android-facing gateway contract.
 */
export interface VoiceboxLocalProvider extends VoiceProvider {
  readonly id: 'voicebox-local';
}

export function createMockGameAIGateway(): GameAIGateway {
  return new ServerGameAIGateway(new MockVoiceProvider());
}
