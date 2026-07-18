import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');
const bridges = [
  {
    sourcePath: path.join(root, 'packages', 'game-data', 'data', 'foundation.json'),
    targetPath: path.join(root, 'apps', 'android', 'data', 'game_foundation.json'),
  },
  {
    sourcePath: path.join(root, 'packages', 'game-data', 'data', 'item-catalog.v1.json'),
    targetPath: path.join(root, 'apps', 'android', 'data', 'item_catalog.v1.json'),
  },
];

for (const { sourcePath, targetPath } of bridges) {
  const source = await readFile(sourcePath, 'utf8');

  if (checkOnly) {
    const target = await readFile(targetPath, 'utf8');
    if (source !== target) {
      console.error(
        `Android game-data bridge is out of sync: ${path.relative(root, targetPath)} does not match ${path.relative(root, sourcePath)}.`,
      );
      process.exitCode = 1;
    } else {
      console.log(`Android game-data bridge is in sync: ${path.relative(root, targetPath)}.`);
    }
  } else {
    await writeFile(targetPath, source, 'utf8');
    console.log(`Synced ${path.relative(root, targetPath)} from ${path.relative(root, sourcePath)}.`);
  }
}
