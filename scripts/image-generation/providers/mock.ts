import { ImageGenerationRequest, ImageGenerationResult, ImageProvider } from './types';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export default class MockProvider implements ImageProvider {
  readonly id = 'mock';
  readonly model = 'mock-model';

  async validateConfiguration(): Promise<void> { return; }

  async estimateCost(request: ImageGenerationRequest): Promise<number | null> {
    const res = request.resolution || 1024;
    const megapixels = (res * res) / 1_000_000;
    const base = Math.max(0.01, Math.round(megapixels * 100) / 100);
    return Number(base.toFixed(2));
  }

  async generate(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
    const outDir = path.join(process.cwd(), 'assets', 'generated', 'mock');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const filename = 'mock_' + Date.now() + '.bin';
    const p = path.join(outDir, filename);
    const buffer = Buffer.from('MOCK_IMAGE');
    fs.writeFileSync(p, buffer);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    return {
      asset_id: 'mock_' + Date.now(),
      provider: 'mock',
      model: 'mock-model',
      returned_images: [{ path: p, hash, width: request.resolution || 1024, height: Math.round((request.resolution || 1024) / 16 * 9) }],
      provider_request_id: 'mock-req-' + Date.now(),
      seed: 'mock-seed-12345',
      cost: 0,
    };
  }
}
