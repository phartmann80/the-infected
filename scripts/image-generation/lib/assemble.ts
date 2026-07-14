import fs from 'fs';
import path from 'path';

const LAYERS_DIR = path.join(__dirname, '..', 'prompts');

export function readLayer(name: string): string {
  try {
    return fs.readFileSync(path.join(LAYERS_DIR, name + '.txt'), 'utf8').trim();
  } catch (e:any) {
    return '';
  }
}

export function assemblePrompt(brief: string, reference: string, extras: Record<string,string> = {}): string {
  const global = readLayer('golden_prompt');
  const camera = readLayer('camera_default');
  const lighting = readLayer('lighting_default');
  const atmosphere = readLayer('atmosphere_default');
  const material = readLayer('material_default');
  const character = readLayer(brief) || '';
  const scene = extras.scene || '';
  return [global, camera, lighting, atmosphere, material, character, scene].filter(Boolean).join('\n\n');
}
