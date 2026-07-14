import { assemblePrompt } from '../generate';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function assert(cond: boolean, msg: string){ if(!cond){ console.error('Assertion failed:', msg); process.exit(2); } }

// Prompt assembly tests
const prompt = assemblePrompt('hero-key-art-001', 'assets/visual_benchmarks/Visual_Benchmark_Candidate_001.png', {});
assert(prompt.length>0, 'Assembled prompt is empty');
assert(prompt.includes('Photorealistic cinematic key art'), 'Golden prompt missing');
assert(prompt.includes('35mm'), 'Camera layer missing');
assert(prompt.includes('teal-orange'), 'Lighting layer missing');
assert(prompt.includes('dense smoke'), 'Atmosphere layer missing');
assert(prompt.includes('rooftop at dawn'), 'Brief-specific layer missing');

console.log('Prompt assembly tests passed');

// Negative prompt exists
const neg = fs.readFileSync(path.join(__dirname,'..','prompts','negative_prompt.txt'),'utf8');
assert(neg.includes('no painterly'), 'Negative prompt missing expected content');
console.log('Negative prompt test passed');

// Run the TypeScript CLI dry-run (via tsx) to produce provenance
const outDir = path.join(process.cwd(),'..','..','assets','generated','internal-review');
try{
  execSync(`npx tsx ${path.join(process.cwd(),'..','generate.ts')} --provider mock --brief hero-key-art-001 --reference assets/visual_benchmarks/Visual_Benchmark_Candidate_001.png --output ${outDir} --dry-run`, { stdio: 'inherit' });
}catch(e){ console.error('CLI dry-run failed:', e.message); process.exit(3); }

// find latest provenance
const files = fs.readdirSync(outDir).filter(f=>f.endsWith('.provenance.json'));
if(files.length===0){ console.error('No provenance files found in', outDir); process.exit(4); }
files.sort((a,b)=> fs.statSync(path.join(outDir,b)).mtimeMs - fs.statSync(path.join(outDir,a)).mtimeMs);
const latest = files[0];
const content = JSON.parse(fs.readFileSync(path.join(outDir,latest),'utf8'));

// provenance checks
assert(typeof content.asset_id === 'string' && content.asset_id.length>0, 'asset_id missing');
assert(content.provider === 'mock', 'provider mismatch');
assert(typeof content.model === 'string', 'model missing');
assert(typeof content.prompt === 'string' && content.prompt.length>0, 'prompt missing in provenance');
assert(typeof content.negative_prompt === 'string' && content.negative_prompt.length>0, 'negative_prompt missing');
assert(content.creative_brief === 'hero-key-art-001', 'brief mismatch');
assert(content.visual_benchmark_reference && content.visual_benchmark_reference.includes('Visual_Benchmark_Candidate_001'), 'benchmark ref missing');
assert(typeof content.requested_resolution === 'number', 'requested_resolution missing');
assert(typeof content.aspect_ratio === 'string', 'aspect_ratio missing');
assert(content.input_file_hashes && content.input_file_hashes.reference, 'input hash missing');
assert(content.status === 'internal-review', 'status not internal-review');
assert(content.canonical === false, 'canonical should be false');
assert(content.dry_run === true, 'dry_run should be true');

console.log('Provenance checks passed');
console.log('All tests passed');
process.exit(0);
