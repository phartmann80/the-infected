import { describe, expect, it } from 'vitest';

import {
  MockVoiceProvider,
  ServerGameAIGateway,
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
});
