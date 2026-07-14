import { describe, it, expect } from 'vitest';
import MockProvider from '../providers/mock';

describe('mock provider cost estimation', () => {
  it('estimates cost deterministically', async () => {
    const mock = new MockProvider();
    const low = await mock.estimateCost({ resolution: 512 } as any);
    const eq = await mock.estimateCost({ resolution: 1024 } as any);
    const high = await mock.estimateCost({ resolution: 2048 } as any);
    expect(low).toBeGreaterThanOrEqual(0.01);
    expect(eq).toBeGreaterThanOrEqual(low);
    expect(high).toBeGreaterThanOrEqual(eq);
  });
});
