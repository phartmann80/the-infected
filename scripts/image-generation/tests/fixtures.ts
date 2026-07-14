import { ImageGenerationRequest } from '../providers/types';

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
    ...overrides,
  };
}
