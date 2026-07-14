import { describe, it, expect } from 'vitest';
import MockProvider from '../providers/mock';
import { createRequest } from './fixtures';
import { run } from '../generate';
import fs from 'fs';
import path from 'path';

describe('mock provider cost estimation', () => {
  it('estimates cost deterministically', async () => {
    const mock = new MockProvider();
    const low = await mock.estimateCost(createRequest({ resolution: 512 }));
    const eq = await mock.estimateCost(createRequest({ resolution: 1024 }));
    const high = await mock.estimateCost(createRequest({ resolution: 2048 }));
    expect(low).not.toBeNull();
    expect(eq).not.toBeNull();
    expect(high).not.toBeNull();
    expect(low as number).toBeGreaterThanOrEqual(0.01);
    expect(eq as number).toBeGreaterThanOrEqual(low as number);
    expect(high as number).toBeGreaterThanOrEqual(eq as number);
  });
});

describe('cost gating and confirmation behavior', () => {
  const outDir = path.join(process.cwd(), '.tmp', 'test-cost-' + Date.now());

  it('estimateCost below --max-cost proceeds', async () => {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const mock = new MockProvider();
    const est = await mock.estimateCost(createRequest({ resolution: 1024 }));
    const res = await run({
      provider: 'mock',
      brief: 'hero-key-art-001',
      output: outDir,
      dryRun: false,
      confirm: true,
      maxCost: (est ?? 0) + 1,
    });
    expect(res.provenance).toBeDefined();
  });

  it('estimateCost equal to --max-cost proceeds', async () => {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const mock = new MockProvider();
    const est = await mock.estimateCost(createRequest({ resolution: 1024 }));
    const res = await run({
      provider: 'mock',
      brief: 'hero-key-art-001',
      output: outDir,
      dryRun: false,
      confirm: true,
      maxCost: est,
    });
    expect(res.provenance).toBeDefined();
  });

  it('estimateCost above --max-cost is blocked', async () => {
    const mock = new MockProvider();
    const est = await mock.estimateCost(createRequest({ resolution: 1024 }));
    await expect(run({
      provider: 'mock',
      brief: 'hero-key-art-001',
      output: outDir,
      dryRun: false,
      confirm: true,
      maxCost: Math.max(0, (est ?? 0) - 0.01),
    })).rejects.toThrow(/Estimated cost exceeds/);
  });

  it('missing --max-cost follows safe default (allows if no max)', async () => {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const res = await run({
      provider: 'mock',
      brief: 'hero-key-art-001',
      output: outDir,
      dryRun: false,
      confirm: true,
    });
    expect(res.provenance).toBeDefined();
  });

  it('bounded retries: unknown provider throws immediately', async () => {
    await expect(run({
      provider: 'nonexistent-provider',
      brief: 'hero-key-art-001',
      output: outDir,
      dryRun: true,
    })).rejects.toThrow('Unknown provider');
  });
});
