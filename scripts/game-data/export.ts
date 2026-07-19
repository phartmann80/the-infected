import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createGameDataExportV1 } from '../../packages/game-data/src/index';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const outputPath = resolve(repositoryRoot, 'packages/game-data/generated/game-data.v1.json');
const expected = `${JSON.stringify(createGameDataExportV1(), null, 2)}\n`;

async function checkExport() {
  let current: string;

  try {
    current = await readFile(outputPath, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error('Game-data export is missing. Run `npm run game-data:export`.');
    }
    throw error;
  }

  if (current !== expected) {
    throw new Error('Game-data export is stale. Run `npm run game-data:export` and commit the result.');
  }

  console.log('Game-data export validation passed: schema v1 is current.');
}

async function writeExport() {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, expected, 'utf8');
  console.log('Wrote packages/game-data/generated/game-data.v1.json.');
}

async function main() {
  const mode = process.argv[2] ?? '--check';

  if (mode === '--check') {
    await checkExport();
    return;
  }

  if (mode === '--write') {
    await writeExport();
    return;
  }

  throw new Error(`Unknown mode: ${mode}. Use --check or --write.`);
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
