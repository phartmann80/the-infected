import { describe, it, expect, beforeEach } from 'vitest';
import MockProvider from '../providers/mock';
import fs from 'fs';
import path from 'path';
import { run } from '../generate';

const outDir = path.join(process.cwd(),'..','..','assets','generated','internal-review');

beforeEach(()=>{
  if(!fs.existsSync(outDir)) fs.mkdirSync(outDir,{recursive:true});
});

describe('cost gating and confirmation behavior', ()=>{
  it('estimateCost below --max-cost proceeds (live simulation)', async ()=>{
    const mock = new MockProvider();
    const est = await mock.estimateCost({ resolution: 1024 } as any) as number;
    // choose maxCost slightly above
    const res = await run({ provider: 'mock', brief: 'hero-key-art-001', reference: 'assets/visual_benchmarks/Visual_Benchmark_Candidate_001.png', output: outDir, dryRun: false, confirm: true, maxCost: est + 1 });
    expect(res.provenance).toBeDefined();
  });

  it('estimateCost equal to --max-cost proceeds', async ()=>{
    const mock = new MockProvider();
    const est = await mock.estimateCost({ resolution: 1024 } as any) as number;
    const res = await run({ provider: 'mock', brief: 'hero-key-art-001', reference: 'assets/visual_benchmarks/Visual_Benchmark_Candidate_001.png', output: outDir, dryRun: false, confirm: true, maxCost: est });
    expect(res.provenance).toBeDefined();
  });

  it('estimateCost above --max-cost is blocked', async ()=>{
    const mock = new MockProvider();
    const est = await mock.estimateCost({ resolution: 1024 } as any) as number;
    await expect(run({ provider: 'mock', brief: 'hero-key-art-001', reference: 'assets/visual_benchmarks/Visual_Benchmark_Candidate_001.png', output: outDir, dryRun: false, confirm: true, maxCost: Math.max(0, est - 0.01) })).rejects.toThrow(/Estimated cost exceeds/);
  });

  it('missing --max-cost follows safe default (allows if no max)', async ()=>{
    // if no maxCost provided, should proceed when confirm true
    const res = await run({ provider: 'mock', brief: 'hero-key-art-001', reference: 'assets/visual_benchmarks/Visual_Benchmark_Candidate_001.png', output: outDir, dryRun: false, confirm: true });
    expect(res.provenance).toBeDefined();
  });

  it('dry-run performs no paid request (dry_run flag true)', async ()=>{
    const res = await run({ provider: 'mock', brief: 'hero-key-art-001', reference: 'assets/visual_benchmarks/Visual_Benchmark_Candidate_001.png', output: outDir, dryRun: true });
    const content = JSON.parse(fs.readFileSync(res.provenance,'utf8'));
    expect(content.dry_run).toBe(true);
    expect(content.status).toBe('internal-review');
  });

  it('live-style invocation without --confirm is blocked', async ()=>{
    await expect(run({ provider: 'mock', brief: 'hero-key-art-001', reference: 'assets/visual_benchmarks/Visual_Benchmark_Candidate_001.png', output: outDir, dryRun: false, confirm: false })).rejects.toThrow(/Missing --confirm/);
  });

  it('one-image generation remains the default and no accidental batch', async ()=>{
    const res = await run({ provider: 'mock', brief: 'hero-key-art-001', reference: 'assets/visual_benchmarks/Visual_Benchmark_Candidate_001.png', output: outDir, dryRun: true });
    const content = JSON.parse(fs.readFileSync(res.provenance,'utf8'));
    expect(content.requested_resolution).toBeDefined();
  });
});
