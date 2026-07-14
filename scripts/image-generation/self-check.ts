import fs from 'fs';
import path from 'path';
import { run } from './generate';

async function selfCheck(): Promise<void> {
  const tmpRoot = path.join(process.cwd(), '.tmp', 'image-generation-self-check-' + Date.now());
  try {
    const res = await run({
      provider: 'mock',
      brief: 'hero-key-art-001',
      reference: 'assets/visual_benchmarks/Visual_Benchmark_Candidate_001.png',
      output: tmpRoot,
      dryRun: true,
    });

    if (!res || !res.provenance) throw new Error('No provenance produced');

    // Read and parse provenance
    const prov = JSON.parse(fs.readFileSync(res.provenance, 'utf8'));

    // Assert exactly one provenance record was created
    const provenanceFiles = fs.readdirSync(tmpRoot).filter(f => f.endsWith('.provenance.json'));
    if (provenanceFiles.length !== 1) {
      throw new Error(`Expected exactly 1 provenance record, found ${provenanceFiles.length}`);
    }

    // Assert required fields exist
    const required = [
      'asset_id', 'provider', 'model', 'prompt', 'negative_prompt',
      'creative_brief', 'visual_benchmark_reference', 'requested_resolution',
      'aspect_ratio', 'input_file_hashes', 'status', 'canonical', 'dry_run',
    ];
    for (const k of required) {
      if (typeof prov[k] === 'undefined') throw new Error('Provenance missing field: ' + k);
    }

    // Assert prompt is non-empty
    if (!prov.prompt || prov.prompt.trim().length === 0) {
      throw new Error('Assembled prompt is empty');
    }

    // Assert negative prompt is non-empty
    if (!prov.negative_prompt || prov.negative_prompt.trim().length === 0) {
      throw new Error('Negative prompt is empty');
    }

    // Assert all required prompt layers are present in the prompt
    const layerMarkers = [
      ['golden_prompt', 'Photorealistic cinematic key art'],
      ['camera_default', '35mm'],
      ['lighting_default', 'teal-orange'],
      ['atmosphere_default', 'dense smoke'],
      ['material_default', 'wet asphalt'],
      ['hero-key-art-001', 'rooftop at dawn'],
    ];
    for (const [layer, marker] of layerMarkers) {
      if (!prov.prompt.includes(marker)) {
        throw new Error(`Required prompt layer "${layer}" content not found (expected marker: "${marker}")`);
      }
    }

    // Assert provider is mock
    if (prov.provider !== 'mock') {
      throw new Error('Self-check: non-mock provider selected: ' + prov.provider);
    }

    // Assert status is internal-review
    if (prov.status !== 'internal-review') {
      throw new Error('Provenance status must be internal-review, got: ' + prov.status);
    }

    // Assert canonical is false
    if (prov.canonical !== false) {
      throw new Error('Provenance canonical flag must be false');
    }

    // Assert dry_run is true
    if (prov.dry_run !== true) {
      throw new Error('Provenance dry_run must be true');
    }

    // Assert estimated and actual cost is zero or null (no billing)
    if (prov.estimated_cost != null && prov.estimated_cost !== 0) {
      throw new Error('Estimated cost should be zero or null in dry-run, got: ' + prov.estimated_cost);
    }
    if (prov.actual_cost != null && prov.actual_cost !== 0) {
      throw new Error('Actual cost should be zero or null in dry-run, got: ' + prov.actual_cost);
    }

    // Assert no generated production images are left behind
    const imageFiles = fs.readdirSync(tmpRoot).filter(f => !f.endsWith('.provenance.json'));
    if (imageFiles.length > 0) {
      throw new Error('Unexpected non-provenance files in output: ' + imageFiles.join(', '));
    }

    console.log('Self-check passed. All assertions verified.');
  } finally {
    // Always clean up temporary directory
    if (fs.existsSync(tmpRoot)) {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
      console.log('Cleaned up:', tmpRoot);
    }
  }
}

selfCheck().then(() => {
  process.exit(0);
}).catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error('Self-check failed:', message);
  process.exit(2);
});
