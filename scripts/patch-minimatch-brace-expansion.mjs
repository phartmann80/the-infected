import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const minimatchRoot = resolve(root, 'node_modules', 'minimatch');
const packagePath = resolve(minimatchRoot, 'package.json');
const sourcePath = resolve(minimatchRoot, 'minimatch.js');
const original = "var expand = require('brace-expansion')";
const replacement = [
  "var braceExpansion = require('brace-expansion')",
  "var expand = typeof braceExpansion === 'function'",
  '  ? braceExpansion',
  '  : braceExpansion.expand',
].join('\n');

const packageJson = JSON.parse(await readFile(packagePath, 'utf8'));
if (packageJson.version !== '3.1.5') {
  throw new Error(
    `Unsupported minimatch version ${packageJson.version}; review the brace-expansion compatibility patch.`,
  );
}

const source = await readFile(sourcePath, 'utf8');
if (!source.includes(replacement)) {
  if (!source.includes(original)) {
    throw new Error('Expected minimatch brace-expansion import was not found.');
  }
  await writeFile(sourcePath, source.replace(original, replacement), 'utf8');
}

const require = createRequire(import.meta.url);
delete require.cache[require.resolve(sourcePath)];
const minimatch = require(sourcePath);
const expanded = minimatch.braceExpand('route-{north,south}');
if (
  expanded.length !== 2
  || expanded[0] !== 'route-north'
  || expanded[1] !== 'route-south'
) {
  throw new Error('Patched minimatch brace expansion smoke test failed.');
}

console.log('Applied minimatch 3.1.5 compatibility for brace-expansion 5.0.9.');
