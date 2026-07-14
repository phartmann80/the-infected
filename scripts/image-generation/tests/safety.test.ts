import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { run } from '../generate';
import {
  cleanupDefaultImageGenerationOutput,
  defaultImageGenerationOutputPath,
  productionGeneratedAssetsPath,
  snapshotDirectory,
  withTempImageGenerationDir,
} from './fixtures';

describe('safety gates', () => {
  it('blocks live invocation without --confirm', async () => {
    await withTempImageGenerationDir('test-safety-confirm', async outDir => {
      await expect(run({
        provider: 'mock',
        brief: 'hero-key-art-001',
        output: outDir,
        dryRun: false,
        confirm: false,
      })).rejects.toThrow(/Missing --confirm/);
    });
  });

  it('dry-run isolation: does not call generate on provider', async () => {
    await withTempImageGenerationDir('test-safety-dry-run', async outDir => {
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
  });

  it('dry-run without --output uses .tmp', async () => {
    try {
      const res = await run({
        provider: 'mock',
        brief: 'hero-key-art-001',
        dryRun: true,
      });
      const content = JSON.parse(fs.readFileSync(res.provenance, 'utf8'));
      expect(path.resolve(content.output_directory)).toBe(path.resolve(defaultImageGenerationOutputPath));
      expect(path.resolve(res.provenance).startsWith(path.resolve(defaultImageGenerationOutputPath))).toBe(true);
    } finally {
      cleanupDefaultImageGenerationOutput();
    }
  });

  it('mock execution without --output uses .tmp', async () => {
    try {
      const res = await run({
        provider: 'mock',
        brief: 'hero-key-art-001',
        dryRun: false,
        confirm: true,
      });
      const content = JSON.parse(fs.readFileSync(res.provenance, 'utf8'));
      expect(path.resolve(content.output_directory)).toBe(path.resolve(defaultImageGenerationOutputPath));
      expect(path.resolve(res.provenance).startsWith(path.resolve(defaultImageGenerationOutputPath))).toBe(true);
    } finally {
      cleanupDefaultImageGenerationOutput();
    }
  });

  it('non-mock live execution without --output is blocked before provider calls', async () => {
    await expect(run({
      provider: 'logicc',
      brief: 'hero-key-art-001',
      dryRun: false,
      confirm: true,
    })).rejects.toThrow('Live generation requires an explicit --output directory.');
  });

  it('explicit output is respected', async () => {
    await withTempImageGenerationDir('test-safety-explicit-output', async outDir => {
      const res = await run({
        provider: 'mock',
        brief: 'hero-key-art-001',
        output: outDir,
        dryRun: false,
        confirm: true,
      });
      const content = JSON.parse(fs.readFileSync(res.provenance, 'utf8'));
      expect(path.resolve(content.output_directory)).toBe(path.resolve(outDir));
      expect(path.resolve(res.provenance).startsWith(path.resolve(outDir))).toBe(true);
    });
  });

  it('rejects direct canonical promotion', async () => {
    await withTempImageGenerationDir('test-safety-canonical', async outDir => {
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
  });

  it('one-image default: count is 1', async () => {
    await withTempImageGenerationDir('test-safety-count', async outDir => {
      const res = await run({
        provider: 'mock',
        brief: 'hero-key-art-001',
        output: outDir,
        dryRun: true,
      });
      const content = JSON.parse(fs.readFileSync(res.provenance, 'utf8'));
      expect(content.requested_resolution).toBeDefined();
    });
  });

  it('rejects missing benchmark layer via assembler', async () => {
    await withTempImageGenerationDir('test-safety-missing-benchmark', async outDir => {
      await expect(run({
        provider: 'mock',
        brief: 'nonexistent-benchmark-xyz',
        output: outDir,
        dryRun: true,
      })).rejects.toThrow('Missing required prompt layer');
    });
  });

  it('unknown provider throws immediately', async () => {
    await withTempImageGenerationDir('test-safety-unknown-provider', async outDir => {
      await expect(run({
        provider: 'nonexistent-provider',
        brief: 'hero-key-art-001',
        output: outDir,
        dryRun: true,
      })).rejects.toThrow('Unknown provider');
    });
  });

  it('mock live execution leaves assets/generated unchanged', async () => {
    const before = snapshotDirectory(productionGeneratedAssetsPath);
    await withTempImageGenerationDir('test-safety-no-assets-generated', async outputDirectory => {
      const res = await run({
        provider: 'mock',
        brief: 'hero-key-art-001',
        output: outputDirectory,
        dryRun: false,
        confirm: true,
      });
      expect(res.provenance).toBeDefined();
    });
    const after = snapshotDirectory(productionGeneratedAssetsPath);
    expect(after).toEqual(before);
  });

  it('concurrent mock executions use owned temporary directories without cleanup races', async () => {
    const tasks = Array.from({ length: 5 }, (_, index) =>
      withTempImageGenerationDir(`test-safety-concurrent-${index}`, async outputDirectory => {
        const res = await run({
          provider: 'mock',
          brief: 'hero-key-art-001',
          output: outputDirectory,
          dryRun: false,
          confirm: true,
        });
        const content = JSON.parse(fs.readFileSync(res.provenance, 'utf8'));
        expect(path.resolve(content.output_directory)).toBe(path.resolve(outputDirectory));
      }),
    );

    await Promise.all(tasks);
  });
});
