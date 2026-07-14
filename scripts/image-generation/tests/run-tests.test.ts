import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { assemblePrompt } from '../generate';
import { run } from '../generate';

describe('prompt assembly', () => {
  it('includes golden prompt and layers', () => {
    const prompt = assemblePrompt('hero-key-art-001', 'assets/visual_benchmarks/Visual_Benchmark_Candidate_001.png', {});
    expect(prompt.length).toBeGreaterThan(0);
    expect(prompt).toContain('Photorealistic cinematic key art');
    expect(prompt).toContain('35mm');
    expect(prompt).toContain('teal-orange');
  });
});

describe('cli dry-run', () => {
  it('produces provenance JSON via exported run()', async () => {
    const outDir = path.join(process.cwd(), '..','..','assets','generated','internal-review');
    if(!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const res = await run({ provider: 'mock', brief: 'hero-key-art-001', reference: 'assets/visual_benchmarks/Visual_Benchmark_Candidate_001.png', output: outDir, dryRun: true });
    const files = fs.readdirSync(outDir).filter(f=>f.endsWith('.provenance.json'));
    expect(files.length).toBeGreaterThan(0);
    const latest = files.sort((a,b)=> fs.statSync(path.join(outDir,b)).mtimeMs - fs.statSync(path.join(outDir,a)).mtimeMs)[0];
    const content = JSON.parse(fs.readFileSync(path.join(outDir,latest),'utf8'));
    const required = ['asset_id','provider','model','prompt','negative_prompt','creative_brief','visual_benchmark_reference','requested_resolution','aspect_ratio','input_file_hashes','status','canonical','dry_run'];
    for(const k of required) expect(content[k]).toBeDefined();
    // Safety flags
    expect(content.status).toBe('internal-review');
    expect(content.canonical).toBe(false);
    expect(content.dry_run).toBe(true);
  }, 20000);
});
