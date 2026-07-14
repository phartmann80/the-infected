import fs from 'fs';
import path from 'path';
import { ImageGenerationRequest } from '../providers/types';

export const imageGenerationTempRoot = path.join(process.cwd(), '.tmp', 'image-generation');
export const defaultImageGenerationOutputPath = path.join(imageGenerationTempRoot, 'internal-review');
export const productionGeneratedAssetsPath = path.join(process.cwd(), 'assets', 'generated');

function cleanupEmptyImageGenerationParents(): void {
  removeIfEmpty(imageGenerationTempRoot);
  removeIfEmpty(path.join(process.cwd(), '.tmp'));
}

process.once('beforeExit', cleanupEmptyImageGenerationParents);
process.once('exit', cleanupEmptyImageGenerationParents);

export function createRequest(overrides: Partial<ImageGenerationRequest> = {}): ImageGenerationRequest {
  return {
    provider: 'mock',
    model: 'mock-model',
    prompt: 'test prompt',
    negative_prompt: 'test negative',
    reference_image_path: 'assets/visual_benchmarks/Visual_Benchmark_Candidate_001.png',
    resolution: 1024,
    aspect_ratio: '16:9',
    count: 1,
    intended_use: 'internal-review',
    output_directory: path.join(imageGenerationTempRoot, 'fixture-output'),
    ...overrides,
  };
}

export async function withTempImageGenerationDir<T>(prefix: string, action: (dir: string) => Promise<T>): Promise<T> {
  const dir = path.join(imageGenerationTempRoot, `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  fs.mkdirSync(dir, { recursive: true });
  try {
    return await action(dir);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

export function snapshotDirectory(directory: string): string[] | null {
  if (!fs.existsSync(directory)) return null;
  return fs.readdirSync(directory, { recursive: true }).map(String).sort();
}

export function cleanupDefaultImageGenerationOutput(): void {
  fs.rmSync(defaultImageGenerationOutputPath, { recursive: true, force: true });
  removeIfEmpty(imageGenerationTempRoot);
  removeIfEmpty(path.join(process.cwd(), '.tmp'));
}

function removeIfEmpty(dir: string): void {
  if (!fs.existsSync(dir)) return;
  if (fs.readdirSync(dir).length === 0) fs.rmSync(dir, { recursive: true, force: true });
}
