const fs = require('fs');
const path = require('path');

const LAYERS_DIR = path.join(__dirname, '..', 'prompts');
function readLayer(name){
  try{ return fs.readFileSync(path.join(LAYERS_DIR, name + '.txt'),'utf8').trim(); }catch(e){ return ''; }
}

function assemblePrompt(brief, reference, extras){
  const global = readLayer('golden_prompt');
  const camera = readLayer('camera_default');
  const lighting = readLayer('lighting_default');
  const atmosphere = readLayer('atmosphere_default');
  const material = readLayer('material_default');
  const character = readLayer(brief) || '';
  const scene = (extras && extras.scene) || '';
  return [global,camera,lighting,atmosphere,material,character,scene].filter(Boolean).join('\n\n');
}

module.exports = { assemblePrompt, readLayer };
