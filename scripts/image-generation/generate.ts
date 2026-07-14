import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

import { ImageGenerationRequest, ImageProvider } from './providers/types';
import { config } from './config';

const LAYERS_DIR = path.join(__dirname, 'prompts');

function readLayer(name: string): string {
  try {
    return fs.readFileSync(path.join(LAYERS_DIR, name + '.txt'), 'utf8').trim();
  } catch (e) {
    return '';
  }
}

function hashFile(p: string): string | null {
  try {
    const data = fs.readFileSync(p);
    return crypto.createHash('sha256').update(data).digest('hex');
  } catch (e) {
    return null;
  }
}

export function assemblePrompt(brief: string, reference: string, extras: Record<string,string> = {}) {
  const global = readLayer('golden_prompt');
  const camera = readLayer('camera_default');
  const lighting = readLayer('lighting_default');
  const atmosphere = readLayer('atmosphere_default');
  const material = readLayer('material_default');
  const character = readLayer(brief) || '';
  const scene = extras.scene || '';
  return [global, camera, lighting, atmosphere, material, character, scene].filter(Boolean).join('\n\n');
}

function ensureDir(dir: string){
  if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeProvenance(outputDir: string, meta: any){
  ensureDir(outputDir);
  const id = meta.asset_id || ('asset_' + Date.now());
  const p = path.join(outputDir, id + '.provenance.json');
  fs.writeFileSync(p, JSON.stringify(meta, null, 2));
  return p;
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

export async function run(options: RunOptions) {
  const providerName = options.provider || config.defaultProvider || 'mock';
  const brief = options.brief || 'hero-key-art-001';
  const reference = options.reference || '';
  const output = options.output || 'assets/generated/internal-review';
  const dryRun = !!options.dryRun;
  const confirm = !!options.confirm;
  const maxCost = typeof options.maxCost === 'number' ? options.maxCost : null;

  const prompt = assemblePrompt(brief, reference, {});
  const negative = readLayer('negative_prompt');
  const inputHash = reference ? hashFile(reference) : null;

  const request: ImageGenerationRequest = {
    provider: providerName,
    model: process.env.IMAGE_MODEL || config.defaultModel || 'mock-model',
    prompt,
    negative_prompt: negative,
    reference_image_path: reference || undefined,
    resolution: process.env.IMAGE_OUTPUT_RESOLUTION ? Number(process.env.IMAGE_OUTPUT_RESOLUTION) : config.defaultResolution || 1024,
    aspect_ratio: '16:9',
    count: 1,
    intended_use: 'internal-review'
  };

  // Provider selection (dynamic import to work under tsx/vitest)
  let providerImpl: ImageProvider | null = null;
  if (providerName === 'xai') {
    const mod = await import('./providers/xai');
    const XAI = mod.default;
    providerImpl = new XAI();
  } else if (providerName === 'logicc') {
    const mod = await import('./providers/logicc');
    const Logicc = mod.default;
    providerImpl = new Logicc();
  } else if (providerName === 'mock') {
    const mod = await import('./providers/mock');
    const Mock = mod.default;
    providerImpl = new Mock();
  } else {
    throw new Error('Unknown provider: ' + providerName);
  }

  try{
    await providerImpl.validateConfiguration();
  }catch(err){
    if(!dryRun) throw err;
  }

  if(!dryRun){
    if(!confirm){
      throw new Error('Missing --confirm flag for live generation');
    }
    if(typeof (providerImpl as any).estimateCost === 'function'){
      const est = await (providerImpl as any).estimateCost(request);
      if(est!=null && maxCost!=null && est > maxCost){
        throw new Error('Estimated cost exceeds max-cost limit: ' + est);
      }
    }
    const result = await providerImpl.generate(request);
    const metaLive = {
      asset_id: result.asset_id || ('asset_' + Date.now()),
      provider: providerName,
      model: request.model,
      date: new Date().toISOString(),
      prompt: request.prompt,
      negative_prompt: request.negative_prompt,
      creative_brief: brief,
      visual_benchmark_reference: reference || null,
      requested_resolution: request.resolution,
      returned_resolution: request.resolution,
      aspect_ratio: request.aspect_ratio,
      input_file_hashes: reference ? { reference: inputHash } : {},
      output_file_hash: result.returned_images.map(r=>r.hash).join(','),
      provider_request_id: result.provider_request_id || null,
      seed: result.seed || null,
      estimated_cost: null,
      actual_cost: result.cost || null,
      intended_use: request.intended_use,
      approval_status: 'internal-review',
      status: 'internal-review',
      canonical: false,
      temporary: false,
      dry_run: false
    };
    const prov = writeProvenance(output, metaLive);
    return { provenance: prov, result };
  }

  const meta = {
    asset_id: 'asset_' + Date.now(),
    provider: providerName,
    model: request.model,
    date: new Date().toISOString(),
    prompt: request.prompt,
    negative_prompt: request.negative_prompt,
    creative_brief: brief,
    visual_benchmark_reference: reference || null,
    requested_resolution: request.resolution,
    returned_resolution: null,
    aspect_ratio: request.aspect_ratio,
    input_file_hashes: reference ? { reference: inputHash } : {},
    output_file_hash: null,
    provider_request_id: null,
    seed: null,
    estimated_cost: null,
    actual_cost: null,
    intended_use: request.intended_use,
    approval_status: 'internal-review',
    status: 'internal-review',
    canonical: false,
    temporary: false,
    dry_run: dryRun
  };

  const provPath = writeProvenance(output, meta);
  return { provenance: provPath };
}

// CLI wrapper
if(require.main === module){
  (async ()=>{
    try{
      const argv = process.argv.slice(2);
      const opts: any = {};
      for(let i=0;i<argv.length;i++){
        const a = argv[i];
        if(a === '--dry-run') { opts.dryRun = true; continue; }
        if(a === '--confirm') { opts.confirm = true; continue; }
        if(a === '--max-cost') { opts.maxCost = Number(argv[++i]); continue; }
        if(a.startsWith('--')){ const k = a.replace(/^--/,''); const v = argv[i+1] && !argv[i+1].startsWith('--') ? argv[++i] : true; opts[k]=v; }
      }
      const res = await run(opts);
      console.log('Provenance written to:', res.provenance);
      process.exit(0);
    }catch(err){
      console.error('Error:', err && err.message ? err.message : err);
      process.exit(1);
    }
  })();
}
