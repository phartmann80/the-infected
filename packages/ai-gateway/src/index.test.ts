import { describe, expect, it } from 'vitest';

import {
  MockVoiceProvider,
  ServerGameAIGateway,
  VoiceboxLocalProvider,
  createMockGameAIGateway,
  type GameNarrationRequest,
} from './index';

const request: GameNarrationRequest = {
  requestId: 'intro-001',
  sceneId: 'arrival',
  speakerId: 'survivor-001',
  text: 'The city went quiet.',
  locale: 'en-US',
  voiceProfileId: 'survivor-001-v1',
};

describe('game AI gateway', () => {
  it('provides a safe dry-run descriptor without contacting a provider', async () => {
    const result = await createMockGameAIGateway().generateNarration(request);

    expect(result.provider).toBe('mock');
    expect(result.status).toBe('dry-run');
    expect(result.audioUri).toBe('mock://voice/intro-001');
    expect(result.canonical).toBe(false);
  });

  it('lets a Mastra workflow prepare narration before voice generation', async () => {
    const gateway = new ServerGameAIGateway(new MockVoiceProvider(), {
      async prepareNarration(input) {
        return { ...input, text: `${input.text} Stay together.` };
      },
    });

    const result = await gateway.generateNarration(request);

    expect(result.text).toBe('The city went quiet. Stay together.');
    expect(result.sceneId).toBe('arrival');
  });

  it('rejects empty narration fields before the provider runs', async () => {
    await expect(createMockGameAIGateway().generateNarration({ ...request, text: ' ' })).rejects.toThrow('text');
  });

  it('uses the local Voicebox REST contract without an API key', async () => {
    const fetchMock = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith('/generate')) {
        const body = JSON.parse(String(init?.body));
        expect(body).toMatchObject({ profile_id: 'survivor-001-v1', text: 'The city went quiet.', language: 'en' });
        return new Response(JSON.stringify({ generation_id: 'generation-123', status: 'generating' }), { status: 200 });
      }
      expect(url).toContain('/generate/generation-123/status');
      return new Response(JSON.stringify({ generation_id: 'generation-123', status: 'completed' }), { status: 200 });
    };

    const result = await new VoiceboxLocalProvider({
      baseUrl: 'http://127.0.0.1:17493',
      pollIntervalMs: 0,
      fetchImpl: fetchMock,
    }).generate(request);

    expect(result.provider).toBe('voicebox-local');
    expect(result.status).toBe('ready');
    expect(result.audioUri).toBe('http://127.0.0.1:17493/audio/generation-123');
  });
});
