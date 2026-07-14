import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { run } from '../generate';

describe('provenance record', () => {
  const outDir = path.join(process.cwd(), '.tmp', 'test-provenance-' + Date.now());

  it('produces provenance JSON with all required fields on dry-run', async () => {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const res = await run({
      provider: 'mock',
      brief: 'hero-key-art-001',
      reference: 'assets/visual_benchmarks/Visual_Benchmark_Candidate_001.png',
      output: outDir,
      dryRun: true,
    });
    expect(res.provenance).toBeDefined();

    const content = JSON.parse(fs.readFileSync(res.provenance, 'utf8'));
    const required = [
      'asset_id', 'provider', 'model', 'prompt', 'negative_prompt',
      'creative_brief', 'visual_benchmark_reference', 'requested_resolution',
      'aspect_ratio', 'input_file_hashes', 'status', 'canonical', 'dry_run',
    ];
    for (const k of required) {
      expect(content[k]).toBeDefined();
    }
  }, 20000);

  it('records UTC timestamp', async () => {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const before = new Date().toISOString().slice(0, 10);
    const res = await run({ provider: 'mock', brief: 'hero-key-art-001', output: outDir, dryRun: true });
    const content = JSON.parse(fs.readFileSync(res.provenance, 'utf8'));
    expect(content.date).toBeDefined();
    expect(content.date.slice(0, 10)).toBe(before);
  });

  it('records input file hash when reference is provided', async () => {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const res = await run({
      provider: 'mock',
      brief: 'hero-key-art-001',
      reference: 'assets/visual_benchmarks/Visual_Benchmark_Candidate_001.png',
      output: outDir,
      dryRun: true,
    });
    const content = JSON.parse(fs.readFileSync(res.provenance, 'utf8'));
    expect(content.input_file_hashes).toBeDefined();
  });

  it('defaults to internal-review status', async () => {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const res = await run({ provider: 'mock', brief: 'hero-key-art-001', output: outDir, dryRun: true });
    const content = JSON.parse(fs.readFileSync(res.provenance, 'utf8'));
    expect(content.status).toBe('internal-review');
  });

  it('defaults canonical to false', async () => {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const res = await run({ provider: 'mock', brief: 'hero-key-art-001', output: outDir, dryRun: true });
    const content = JSON.parse(fs.readFileSync(res.provenance, 'utf8'));
    expect(content.canonical).toBe(false);
  });

  it('marks dry_run true in dry-run mode', async () => {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const res = await run({ provider: 'mock', brief: 'hero-key-art-001', output: outDir, dryRun: true });
    const content = JSON.parse(fs.readFileSync(res.provenance, 'utf8'));
    expect(content.dry_run).toBe(true);
  });
});
