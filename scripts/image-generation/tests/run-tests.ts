import { assemblePrompt } from '../generate';
import fs from 'fs';
import path from 'path';
import assert from 'assert';

// Use vitest-compatible test exports
export function testPromptAssembly(){
  const prompt = assemblePrompt('hero-key-art-001', 'assets/visual_benchmarks/Visual_Benchmark_Candidate_001.png', {});
  assert(prompt.length>0, 'Assembled prompt is empty');
  assert(prompt.includes('Photorealistic cinematic key art'), 'Golden prompt missing');
  assert(prompt.includes('35mm'), 'Camera layer missing');
  assert(prompt.includes('teal-orange'), 'Lighting layer missing');
  assert(prompt.includes('dense smoke'), 'Atmosphere layer missing');
  assert(prompt.includes('rooftop at dawn') || prompt.includes('survivor'), 'Brief-specific layer missing');
}

export function testNegativePrompt(){
  const neg = fs.readFileSync(path.join(__dirname,'..','prompts','negative_prompt.txt'),'utf8');
  assert(neg.includes('no painterly'), 'Negative prompt missing expected content');
}

export async function testCliDryRun(){
  // run the TS CLI dry-run
  const outDir = path.join(process.cwd(),'..','..','assets','generated','internal-review');
  if(!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const res = require('child_process').execSync(`npx tsx ${path.join(process.cwd(),'..','generate.ts')} --provider mock --brief hero-key-art-001 --reference assets/visual_benchmarks/Visual_Benchmark_Candidate_001.png --output ${outDir} --dry-run`, { stdio: 'inherit' });
  const files = fs.readdirSync(outDir).filter(f=>f.endsWith('.provenance.json'));
  if(files.length===0) throw new Error('No provenance produced');
  const latest = files.sort((a,b)=> fs.statSync(path.join(outDir,b)).mtimeMs - fs.statSync(path.join(outDir,a)).mtimeMs)[0];
  const content = JSON.parse(fs.readFileSync(path.join(outDir,latest),'utf8'));
  const required = ['asset_id','provider','model','prompt','negative_prompt','creative_brief','visual_benchmark_reference','requested_resolution','aspect_ratio','input_file_hashes','status','canonical','dry_run'];
  for(const k of required) if(typeof content[k] === 'undefined') throw new Error('Provenance missing ' + k);
}
