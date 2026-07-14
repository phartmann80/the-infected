import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LAYERS_DIR = path.join(__dirname, '..', 'prompts');

function readLayerRequired(name: string): string {
  const p = path.join(LAYERS_DIR, name + '.txt');
  if (!fs.existsSync(p)) throw new Error(`Missing required prompt layer: ${name}`);
  return fs.readFileSync(p, 'utf8').trim();
}

function readLayerOptional(name: string): string {
  const p = path.join(LAYERS_DIR, name + '.txt');
  if (!fs.existsSync(p)) return '';
  return fs.readFileSync(p, 'utf8').trim();
}

export function assemblePrompt(brief: string, reference?: string, extras: Record<string,string> = {}): string {
  // Required layers
  const global = readLayerRequired('golden_prompt');
  const camera = readLayerRequired('camera_default');
  const lighting = readLayerRequired('lighting_default');
  const atmosphere = readLayerRequired('atmosphere_default');
  const material = readLayerRequired('material_default');

  // Brief-specific (treated as required for production prompts)
  const character = readLayerRequired(brief || '');

  // Optional scene layer
  const scene = readLayerOptional('scene') || extras.scene || '';

  const parts = [global, camera, lighting, atmosphere, material, character];
  if (scene) parts.push(scene);
  if (reference) parts.push(`Reference: ${reference}`);
  return parts.join('\n\n');
}
