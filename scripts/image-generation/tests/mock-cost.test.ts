import { describe, it, expect } from 'vitest';
import MockProvider from '../providers/mock';
import type { ImageGenerationRequest } from '../providers/types';

describe('mock provider cost estimation', () => {
  it('estimates cost deterministically', async () => {
    const mock = new MockProvider();
    const low = await mock.estimateCost({ resolution: 512 } as ImageGenerationRequest);
    const eq = await mock.estimateCost({ resolution: 1024 } as ImageGenerationRequest);
    const high = await mock.estimateCost({ resolution: 2048 } as ImageGenerationRequest);
    expect((low as number)).toBeGreaterThanOrEqual(0.01);
    expect((eq as number)).toBeGreaterThanOrEqual(low as number);
    expect((high as number)).toBeGreaterThanOrEqual(eq as number);
  });
});
