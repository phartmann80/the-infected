import { afterEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

import BlackboxVideoProvider from '../providers/blackbox';
import { VideoGenerationRequest } from '../providers/types';

const environmentKeys = [
  'BLACKBOX_API_KEY',
  'BLACKBOX_AI_API',
  'BLACKBOX_ENDPOINT_URL',
  'BLACKBOX_VIDEO_ENDPOINT',
  'BLACKBOX_VIDEO_MODEL',
  'BLACKBOX_VIDEO_PARAMETERS_JSON',
  'BLACKBOX_ESTIMATED_COST_USD',
];

const originalEnvironment = Object.fromEntries(environmentKeys.map(key => [key, process.env[key]]));

afterEach(() => {
  vi.unstubAllGlobals();
  for (const key of environmentKeys) {
    const value = originalEnvironment[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

function request(outputDirectory: string): VideoGenerationRequest {
  return {
    provider: 'blackbox',
    model: 'blackboxai/google/veo-3-fast',
    prompt: 'test cinematic shot',
    aspect_ratio: '16:9',
    output_directory: outputDirectory,
  };
}

describe('Blackbox video provider', () => {
  it('accepts the project compatibility key name', async () => {
    delete process.env.BLACKBOX_API_KEY;
    process.env.BLACKBOX_AI_API = 'test-key';
    await expect(new BlackboxVideoProvider().validateConfiguration()).resolves.toBeUndefined();
  });

  it('submits an OpenAI-compatible request and downloads the returned video', async () => {
    process.env.BLACKBOX_AI_API = 'test-key';
    process.env.BLACKBOX_ENDPOINT_URL = 'https://api.example.test';
    process.env.BLACKBOX_VIDEO_MODEL = 'blackboxai/google/veo-3-fast';

    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith('/chat/completions')) {
        const body = JSON.parse(String(init?.body));
        expect(body.model).toBe('blackboxai/google/veo-3-fast');
        expect(body.messages[0].content).toBe('test cinematic shot');
        expect(init?.headers).toMatchObject({ Authorization: 'Bearer test-key' });
        return new Response(JSON.stringify({
          id: 'video-request-123',
          choices: [{ message: { content: 'https://cdn.example.test/video.mp4' } }],
        }), { status: 200 });
      }
      if (url === 'https://cdn.example.test/video.mp4') {
        return new Response(Uint8Array.from([4, 5, 6]), {
          status: 200,
          headers: { 'content-type': 'video/mp4' },
        });
      }
      return new Response(null, { status: 404 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const outputDirectory = fs.mkdtempSync(path.join(process.cwd(), '.tmp-blackbox-video-'));
    try {
      const result = await new BlackboxVideoProvider().generate(request(outputDirectory));
      expect(result.provider).toBe('blackbox');
      expect(result.provider_request_id).toBe('video-request-123');
      expect(result.returned_videos).toHaveLength(1);
      expect(fs.readFileSync(result.returned_videos[0].path)).toEqual(Buffer.from([4, 5, 6]));
      expect(fetchMock).toHaveBeenCalledTimes(2);
    } finally {
      fs.rmSync(outputDirectory, { recursive: true, force: true });
    }
  });
});
