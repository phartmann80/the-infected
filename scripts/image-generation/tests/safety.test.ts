import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { run } from '../generate';

describe('safety gates', () => {
  const outDir = path.join(process.cwd(), '.tmp', 'test-safety-' + Date.now());

  it('blocks live invocation without --confirm', async () => {
    await expect(run({
      provider: 'mock',
      brief: 'hero-key-art-001',
      output: outDir,
      dryRun: false,
      confirm: false,
    })).rejects.toThrow(/Missing --confirm/);
  });

  it('dry-run isolation: does not call generate on provider', async () => {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const res = await run({
      provider: 'mock',
      brief: 'hero-key-art-001',
      output: outDir,
      dryRun: true,
    });
    const content = JSON.parse(fs.readFileSync(res.provenance, 'utf8'));
    expect(content.dry_run).toBe(true);
    expect(content.output_file_hash).toBeNull();
  });

  it('rejects direct canonical promotion', async () => {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const res = await run({
      provider: 'mock',
      brief: 'hero-key-art-001',
      output: outDir,
      dryRun: true,
    });
    const content = JSON.parse(fs.readFileSync(res.provenance, 'utf8'));
    expect(content.canonical).toBe(false);
    expect(content.status).toBe('internal-review');
  });

  it('one-image default: count is 1', async () => {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const res = await run({
      provider: 'mock',
      brief: 'hero-key-art-001',
      output: outDir,
      dryRun: true,
    });
    const content = JSON.parse(fs.readFileSync(res.provenance, 'utf8'));
    expect(content.requested_resolution).toBeDefined();
  });

  it('rejects missing benchmark layer via assembler', async () => {
    await expect(run({
      provider: 'mock',
      brief: 'nonexistent-benchmark-xyz',
      output: outDir,
      dryRun: true,
    })).rejects.toThrow('Missing required prompt layer');
  });

  it('unknown provider throws immediately', async () => {
    await expect(run({
      provider: 'nonexistent-provider',
      brief: 'hero-key-art-001',
      output: outDir,
      dryRun: true,
    })).rejects.toThrow('Unknown provider');
  });
});
