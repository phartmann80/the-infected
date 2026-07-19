import { afterEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';

import MuAPIProvider from '../providers/muapi';
import { ImageGenerationRequest } from '../providers/types';

const environmentKeys = [
  'MUAPI_API_KEY',
  'MUAPI_API',
  'MUAPI_BASE_URL',
  'MUAPI_IMAGE_MODEL',
  'MUAPI_POLL_INTERVAL_MS',
  'MUAPI_TIMEOUT_MS',
  'MUAPI_ESTIMATED_COST_USD',
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

function request(outputDirectory: string): ImageGenerationRequest {
  return {
    provider: 'muapi',
    model: 'flux-dev-image',
    prompt: 'test image',
    aspect_ratio: '16:9',
    resolution: 1024,
    count: 1,
    output_directory: outputDirectory,
  };
}

describe('MuAPI provider', () => {
  it('accepts the project compatibility key name', async () => {
    delete process.env.MUAPI_API_KEY;
    process.env.MUAPI_API = 'test-key';
    await expect(new MuAPIProvider().validateConfiguration()).resolves.toBeUndefined();
  });

  it('submits, polls, downloads, and hashes a completed image', async () => {
    process.env.MUAPI_API_KEY = 'test-key';
    process.env.MUAPI_BASE_URL = 'https://api.example.test/api/v1';
    process.env.MUAPI_IMAGE_MODEL = 'flux-dev-image';
    process.env.MUAPI_POLL_INTERVAL_MS = '0';
    process.env.MUAPI_TIMEOUT_MS = '1000';

    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith('/flux-dev-image')) {
        const body = JSON.parse(String(init?.body));
        expect(body.prompt).toBe('test image');
        expect(init?.headers).toMatchObject({ 'x-api-key': 'test-key' });
        return new Response(JSON.stringify({ request_id: 'image-request-123' }), { status: 200 });
      }
      if (url.endsWith('/predictions/image-request-123/result')) {
        return new Response(JSON.stringify({ status: 'completed', outputs: ['https://cdn.example.test/image.png'] }), { status: 200 });
      }
      if (url === 'https://cdn.example.test/image.png') {
        return new Response(Uint8Array.from([1, 2, 3]), { status: 200, headers: { 'content-type': 'image/png' } });
      }
      return new Response(null, { status: 404 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const outputDirectory = fs.mkdtempSync('.tmp-muapi-image-');
    try {
      const result = await new MuAPIProvider().generate(request(outputDirectory));
      expect(result.provider_request_id).toBe('image-request-123');
      expect(result.returned_images).toHaveLength(1);
      expect(fs.readFileSync(result.returned_images[0].path)).toEqual(Buffer.from([1, 2, 3]));
      expect(fetchMock).toHaveBeenCalledTimes(3);
    } finally {
      fs.rmSync(outputDirectory, { recursive: true, force: true });
    }
  });
});
