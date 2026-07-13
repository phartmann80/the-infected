import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const registry = readJson('assets/registry.json');
const soundRegistry = readJson('assets/sound-registry.json');
const errors = [];
if (registry.schemaVersion !== '1.0.0') errors.push('assets/registry.json schemaVersion must be 1.0.0');
if (soundRegistry.schemaVersion !== '1.0.0') errors.push('assets/sound-registry.json schemaVersion must be 1.0.0');
if (!Array.isArray(registry.assets)) errors.push('registry.assets must be an array');
if (!Array.isArray(soundRegistry.sounds)) errors.push('soundRegistry.sounds must be an array');
const ids = new Set();
for (const asset of registry.assets ?? []) {
  for (const key of ['id', 'name', 'type', 'status', 'version', 'path', 'sha256', 'provenance']) if (!(key in asset)) errors.push(`asset ${asset.id ?? '<unknown>'} missing ${key}`);
  if (ids.has(asset.id)) errors.push(`duplicate asset id ${asset.id}`);
  ids.add(asset.id);
  if (!registry.statusModel.includes(asset.status)) errors.push(`asset ${asset.id} has invalid status ${asset.status}`);
  if (asset.canonical && !['approved', 'canonical'].includes(asset.status)) errors.push(`canonical asset ${asset.id} must be approved or canonical`);
  if (asset.path && !existsSync(asset.path)) errors.push(`asset path missing: ${asset.path}`);
  if (asset.path && asset.sha256 && existsSync(asset.path)) {
    const digest = createHash('sha256').update(readFileSync(asset.path)).digest('hex');
    if (digest !== asset.sha256) errors.push(`asset ${asset.id} sha256 mismatch`);
  }
  if (asset.publicWebPath && !existsSync(asset.publicWebPath)) errors.push(`public web path missing: ${asset.publicWebPath}`);
  for (const derivative of asset.deliveryDerivatives ?? []) {
    if (!derivative.path || !existsSync(derivative.path)) errors.push(`delivery derivative missing: ${derivative.path ?? '<unknown>'}`);
    if (derivative.path && derivative.mustMatchSha256 && existsSync(derivative.path)) {
      const derivativeDigest = createHash('sha256').update(readFileSync(derivative.path)).digest('hex');
      if (derivativeDigest !== derivative.mustMatchSha256) errors.push(`delivery derivative ${derivative.path} sha256 mismatch`);
      if (asset.sha256 && derivativeDigest !== asset.sha256) errors.push(`delivery derivative ${derivative.path} drifted from canonical ${asset.path}`);
    }
  }
}
for (const sound of soundRegistry.sounds ?? []) if (!sound.id || !sound.path || !sound.provenance) errors.push(`sound entry missing required fields: ${sound.id ?? '<unknown>'}`);
if (errors.length) { console.error('Registry validation failed:'); errors.forEach((e) => console.error(`- ${e}`)); process.exit(1); }
console.log(`Registry validation passed: ${registry.assets.length} asset(s), ${soundRegistry.sounds.length} sound(s).`);
