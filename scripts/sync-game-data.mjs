import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'packages', 'game-data', 'data', 'foundation.json');
const targetPath = path.join(root, 'apps', 'android', 'data', 'game_foundation.json');
const source = await readFile(sourcePath, 'utf8');
const checkOnly = process.argv.includes('--check');

if (checkOnly) {
  const target = await readFile(targetPath, 'utf8');
  if (source !== target) {
    console.error('Android game-data bridge is out of sync with packages/game-data.');
    process.exit(1);
  }
  console.log('Android game-data bridge is in sync.');
} else {
  await writeFile(targetPath, source, 'utf8');
  console.log(`Synced ${path.relative(root, targetPath)} from ${path.relative(root, sourcePath)}.`);
}
