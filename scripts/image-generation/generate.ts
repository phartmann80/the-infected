import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

import { ImageGenerationRequest, ImageProvider } from './providers/types';
import { config } from './config';
import { assemblePrompt, readLayerOptional } from './lib/assemble';

interface ProvenanceRecord {
  asset_id: string;
  provider: string;
  model: string;
  date: string;
  prompt: string;
  negative_prompt: string;
  creative_brief: string;
  visual_benchmark_reference: string | null;
  requested_resolution: number | undefined;
  returned_resolution: number | undefined | null;
  aspect_ratio: string | undefined;
  input_file_hashes: Record<string, string | null>;
  output_file_hash: string | null;
  output_directory: string;
  provider_request_id: string | null;
  seed: string | number | null;
  estimated_cost: number | null;
  actual_cost: number | null;
  intended_use: string | undefined;
  approval_status: string;
  status: string;
  canonical: boolean;
  temporary: boolean;
  dry_run: boolean;
}

function hashFile(p: string): string | null {
  try {
    const data = fs.readFileSync(p);
    return crypto.createHash('sha256').update(data).digest('hex');
  } catch {
    return null;
  }
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeProvenance(outputDir: string, meta: ProvenanceRecord): string {
  ensureDir(outputDir);
  const id = meta.asset_id || ('asset_' + Date.now());
  const p = path.join(outputDir, id + '.provenance.json');
  fs.writeFileSync(p, JSON.stringify(meta, null, 2));
  return p;
}

function isPathInsideDirectory(candidate: string, directory: string): boolean {
  const resolvedCandidate = path.resolve(candidate);
  const resolvedDirectory = path.resolve(directory);
  const relative = path.relative(resolvedDirectory, resolvedCandidate);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function assertReturnedImagesStayInsideOutputDirectory(imagePaths: string[], outputDirectory: string): void {
  // This lexical containment check is sufficient for the controlled mock provider because
  // mock filenames are generated internally. Before enabling any live provider, harden this
  // check with fs.realpathSync() after files exist so symlinks inside outputDirectory cannot
  // escape the requested directory.
  for (const imagePath of imagePaths) {
    if (!isPathInsideDirectory(imagePath, outputDirectory)) {
      throw new Error('Provider returned an image path outside the requested output directory');
    }
  }
}

async function resolveProvider(name: string): Promise<ImageProvider> {
  if (name === 'xai') {
    const mod = await import('./providers/xai');
    return new mod.default();
  }
  if (name === 'logicc') {
    const mod = await import('./providers/logicc');
    return new mod.default();
  }
  if (name === 'muapi') {
    const mod = await import('./providers/muapi');
    return new mod.default();
  }
  if (name === 'mock') {
    const mod = await import('./providers/mock');
    return new mod.default();
  }
  throw new Error('Unknown provider: ' + name);
}

export interface RunOptions {
  provider?: string;
  brief?: string;
  reference?: string;
  output?: string;
  dryRun?: boolean;
  confirm?: boolean;
  maxCost?: number | null;
}

export { assemblePrompt };

export async function run(options: RunOptions): Promise<{ provenance: string; result?: unknown }> {
  const providerName = options.provider || config.defaultProvider || 'mock';
  const brief = options.brief || 'hero-key-art-001';
  const reference = options.reference || '';
  const dryRun = !!options.dryRun;
  const confirm = !!options.confirm;
  const maxCost = typeof options.maxCost === 'number' ? options.maxCost : null;
  const hasExplicitOutput = typeof options.output === 'string' && options.output.trim().length > 0;

  if (!dryRun && providerName !== 'mock' && !hasExplicitOutput) {
    throw new Error('Live generation requires an explicit --output directory.');
  }

  const output = hasExplicitOutput ? options.output as string : path.join('.tmp', 'image-generation', 'internal-review');
  ensureDir(output);

  const prompt = assemblePrompt(brief, reference);
  const negative = readLayerOptional('negative_prompt');
  const inputHash = reference ? hashFile(reference) : null;

  const defaultModel = providerName === 'muapi'
    ? process.env.MUAPI_IMAGE_MODEL || process.env.IMAGE_MODEL || 'flux-dev-image'
    : process.env.IMAGE_MODEL || config.defaultModel || 'mock-model';

  const request: ImageGenerationRequest = {
    provider: providerName,
    model: defaultModel,
    prompt,
    negative_prompt: negative,
    reference_image_path: reference || undefined,
    resolution: process.env.IMAGE_OUTPUT_RESOLUTION ? Number(process.env.IMAGE_OUTPUT_RESOLUTION) : config.defaultResolution || 1024,
    aspect_ratio: '16:9',
    count: 1,
    intended_use: 'internal-review',
    output_directory: output,
  };

  const provider: ImageProvider = await resolveProvider(providerName);

  try {
    await provider.validateConfiguration();
  } catch (err) {
    if (!dryRun) throw err;
  }

  if (!dryRun) {
    if (!confirm) {
      throw new Error('Missing --confirm flag for live generation');
    }
    const est = await provider.estimateCost(request);
    if (providerName === 'muapi' && est == null && maxCost == null) {
      throw new Error('MuAPI live generation requires --max-cost or MUAPI_ESTIMATED_COST_USD.');
    }
    if (est != null && maxCost != null && est > maxCost) {
      throw new Error('Estimated cost exceeds max-cost limit: ' + est);
    }
    const result = await provider.generate(request);
    assertReturnedImagesStayInsideOutputDirectory(result.returned_images.map(r => r.path), output);
    const metaLive: ProvenanceRecord = {
      asset_id: result.asset_id || ('asset_' + Date.now()),
      provider: providerName,
      model: request.model,
      date: new Date().toISOString(),
      prompt: request.prompt,
      negative_prompt: request.negative_prompt || '',
      creative_brief: brief,
      visual_benchmark_reference: reference || null,
      requested_resolution: request.resolution,
      returned_resolution: request.resolution,
      aspect_ratio: request.aspect_ratio,
      input_file_hashes: reference ? { reference: inputHash } : {},
      output_file_hash: result.returned_images.map(r => r.hash).join(','),
      output_directory: output,
      provider_request_id: result.provider_request_id || null,
      seed: result.seed || null,
      estimated_cost: est,
      actual_cost: result.cost ?? null,
      intended_use: request.intended_use,
      approval_status: 'internal-review',
      status: 'internal-review',
      canonical: false,
      temporary: false,
      dry_run: false,
    };
    const prov = writeProvenance(output, metaLive);
    return { provenance: prov, result };
  }

  const meta: ProvenanceRecord = {
    asset_id: 'asset_' + Date.now(),
    provider: providerName,
    model: request.model,
    date: new Date().toISOString(),
    prompt: request.prompt,
    negative_prompt: request.negative_prompt || '',
    creative_brief: brief,
    visual_benchmark_reference: reference || null,
    requested_resolution: request.resolution,
    returned_resolution: null,
    aspect_ratio: request.aspect_ratio,
    input_file_hashes: reference ? { reference: inputHash } : {},
    output_file_hash: null,
    output_directory: output,
    provider_request_id: null,
    seed: null,
    estimated_cost: null,
    actual_cost: null,
    intended_use: request.intended_use,
    approval_status: 'internal-review',
    status: 'internal-review',
    canonical: false,
    temporary: false,
    dry_run: dryRun,
  };

  const provPath = writeProvenance(output, meta);
  return { provenance: provPath };
}

// CLI wrapper
const isCLI = typeof require !== 'undefined' && require.main === module;
if (isCLI) {
  (async () => {
    try {
      const argv = process.argv.slice(2);
      const opts: RunOptions = {};
      for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--dry-run') { opts.dryRun = true; continue; }
        if (a === '--confirm') { opts.confirm = true; continue; }
        if (a === '--max-cost') { opts.maxCost = Number(argv[++i]); continue; }
        if (a === '--provider') { opts.provider = argv[++i]; continue; }
        if (a === '--brief') { opts.brief = argv[++i]; continue; }
        if (a === '--reference') { opts.reference = argv[++i]; continue; }
        if (a === '--output') { opts.output = argv[++i]; continue; }
      }
      const res = await run(opts);
      console.log('Provenance written to:', res.provenance);
      process.exit(0);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Error:', message);
      process.exit(1);
    }
  })();
}
