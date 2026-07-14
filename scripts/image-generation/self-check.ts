import { run } from './generate';
import fs from 'fs';
import path from 'path';

async function selfCheck(){
  const tmpRoot = path.join(process.cwd(), '.tmp', 'image-generation-self-check-' + Date.now());
  try{
    const res = await run({ provider: 'mock', brief: 'hero-key-art-001', reference: 'assets/visual_benchmarks/Visual_Benchmark_Candidate_001.png', output: tmpRoot, dryRun: true });
    if(!res || !res.provenance) throw new Error('No provenance produced');
    const prov = JSON.parse(fs.readFileSync(res.provenance,'utf8'));
    // required fields
    const required = ['asset_id','provider','model','prompt','negative_prompt','creative_brief','visual_benchmark_reference','requested_resolution','aspect_ratio','input_file_hashes','status','canonical','dry_run'];
    for(const k of required) if(typeof prov[k] === 'undefined') throw new Error('Provenance missing '+k);
    if(!prov.prompt || prov.prompt.trim().length===0) throw new Error('Prompt assembled empty');
    if(prov.status !== 'internal-review') throw new Error('Provenance status not internal-review');
    if(prov.canonical !== false) throw new Error('Provenance canonical flag must be false');
    if(prov.dry_run !== true) throw new Error('Provenance dry_run must be true');
    if(prov.provider !== 'mock') throw new Error('Self-check: non-mock provider selected');
    console.log('Self-check passed. Cleaning up...');
    // cleanup
    fs.rmSync(tmpRoot, { recursive: true, force: true });
    console.log('Cleaned', tmpRoot);
    process.exit(0);
  }catch(err){
    console.error('Self-check failed:', err && err.message ? err.message : err);
    // ensure cleanup
    try{ fs.rmSync(tmpRoot, { recursive: true, force: true }); }catch(e){}
    process.exit(2);
  }
}

if(require.main === module) selfCheck();
