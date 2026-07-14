import { createRequest } from './fixture';
import MockProvider from '../providers/mock';
import { describe, it, expect } from 'vitest';

describe('mock provider cost estimation', () => {
  it('estimates cost deterministically', async () => {
    const mock = new MockProvider();
    const low = await mock.estimateCost(createRequest({ resolution: 512 }));
    const eq = await mock.estimateCost(createRequest({ resolution: 1024 }));
    const high = await mock.estimateCost(createRequest({ resolution: 2048 }));
    expect((low as number)).toBeGreaterThanOrEqual(0.01);
    expect((eq as number)).toBeGreaterThanOrEqual(low as number);
    expect((high as number)).toBeGreaterThanOrEqual(eq as number);
  });
});
