import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

import BlackboxVideoProvider from './providers/blackbox';
import { VideoGenerationRequest, VideoProvider } from './providers/types';

dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ path: '.env', quiet: true });

interface VideoProvenance {
  asset_id: string;
  provider: string;
  model: string;
  date: string;
  prompt: string;
  reference_image: string | null;
  output_directory: string;
  provider_request_id: string | null;
  output_file_hash: string | null;
  estimated_cost: number | null;
  actual_cost: number | null;
  status: string;
  dry_run: boolean;
}

function ensureDir(directory: string): void {
  if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });
}

function isPathInsideDirectory(candidate: string, directory: string): boolean {
  const relative = path.relative(path.resolve(directory), path.resolve(candidate));
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function writeProvenance(directory: string, record: VideoProvenance): string {
  ensureDir(directory);
  const filePath = path.join(directory, `${record.asset_id}.provenance.json`);
  fs.writeFileSync(filePath, JSON.stringify(record, null, 2));
  return filePath;
}

function providerFor(name: string): VideoProvider {
  if (name === 'blackbox') return new BlackboxVideoProvider();
  throw new Error(`Unknown video provider: ${name}`);
}

export interface RunOptions {
  provider?: string;
  model?: string;
  prompt?: string;
  reference?: string;
  output?: string;
  dryRun?: boolean;
  confirm?: boolean;
  maxCost?: number | null;
}

export async function run(options: RunOptions): Promise<{ provenance: string; result?: unknown }> {
  const providerName = options.provider || process.env.VIDEO_PROVIDER || 'blackbox';
  const prompt = options.prompt?.trim() || 'A cinematic infected city at dawn, smoke drifting between abandoned buildings, slow camera push-in, realistic game trailer composition.';
  const dryRun = !!options.dryRun;
  const confirm = !!options.confirm;
  const maxCost = typeof options.maxCost === 'number' ? options.maxCost : null;
  const hasExplicitOutput = typeof options.output === 'string' && options.output.trim().length > 0;
  if (!dryRun && !hasExplicitOutput) throw new Error('Live video generation requires an explicit --output directory.');

  const output = hasExplicitOutput ? options.output as string : path.join('.tmp', 'video-generation', 'internal-review');
  ensureDir(output);
  const provider = providerFor(providerName);
  const request: VideoGenerationRequest = {
    provider: providerName,
    model: options.model || process.env.BLACKBOX_VIDEO_MODEL || 'blackboxai/google/veo-3-fast',
    prompt,
    reference_image_path: options.reference,
    duration_seconds: process.env.VIDEO_DURATION_SECONDS ? Number(process.env.VIDEO_DURATION_SECONDS) : undefined,
    aspect_ratio: process.env.VIDEO_ASPECT_RATIO || '16:9',
    output_directory: output,
  };

  try { await provider.validateConfiguration(); } catch (error) { if (!dryRun) throw error; }
  if (!dryRun) {
    if (!confirm) throw new Error('Missing --confirm flag for live video generation');
    const estimatedCost = await provider.estimateCost(request);
    if (estimatedCost == null && maxCost == null) {
      throw new Error('Blackbox live video generation requires --max-cost or BLACKBOX_ESTIMATED_COST_USD.');
    }
    if (estimatedCost != null && maxCost != null && estimatedCost > maxCost) {
      throw new Error(`Estimated cost exceeds max-cost limit: ${estimatedCost}`);
    }
    const result = await provider.generate(request);
    for (const video of result.returned_videos) {
      if (!isPathInsideDirectory(video.path, output)) throw new Error('Provider returned a video path outside the output directory');
    }
    const record: VideoProvenance = {
      asset_id: result.asset_id,
      provider: providerName,
      model: request.model,
      date: new Date().toISOString(),
      prompt,
      reference_image: request.reference_image_path || null,
      output_directory: output,
      provider_request_id: result.provider_request_id || null,
      output_file_hash: result.returned_videos.map(video => video.hash).join(','),
      estimated_cost: estimatedCost,
      actual_cost: result.cost ?? null,
      status: 'internal-review',
      dry_run: false,
    };
    return { provenance: writeProvenance(output, record), result };
  }

  const record: VideoProvenance = {
    asset_id: `asset_${Date.now()}`,
    provider: providerName,
    model: request.model,
    date: new Date().toISOString(),
    prompt,
    reference_image: request.reference_image_path || null,
    output_directory: output,
    provider_request_id: null,
    output_file_hash: null,
    estimated_cost: null,
    actual_cost: null,
    status: 'internal-review',
    dry_run: true,
  };
  return { provenance: writeProvenance(output, record) };
}

const isCLI = typeof require !== 'undefined' && require.main === module;
if (isCLI) {
  (async () => {
    try {
      const argv = process.argv.slice(2);
      const options: RunOptions = {};
      for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--dry-run') options.dryRun = true;
        else if (arg === '--confirm') options.confirm = true;
        else if (arg === '--max-cost') options.maxCost = Number(argv[++index]);
        else if (arg === '--provider') options.provider = argv[++index];
        else if (arg === '--model') options.model = argv[++index];
        else if (arg === '--prompt') options.prompt = argv[++index];
        else if (arg === '--reference') options.reference = argv[++index];
        else if (arg === '--output') options.output = argv[++index];
      }
      const result = await run(options);
      console.log('Provenance written to:', result.provenance);
    } catch (error: unknown) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  })();
}
