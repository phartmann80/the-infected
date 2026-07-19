import fs from 'node:fs';
import path from 'node:path';

const manifestPath = path.join(process.cwd(), 'assets', 'hero-production-candidate', 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(manifest.schemaVersion === '1.0.0', 'Hero candidate schemaVersion must be 1.0.0');
assert(manifest.id === 'hero-production-candidate.v1', 'Hero candidate id is incorrect');
assert(manifest.canonical === false, 'Hero candidate must remain non-canonical until review approval');
assert(manifest.generationMode === 'dry-run-only', 'Hero candidate must remain dry-run-only');
assert(manifest.binaryStoragePolicy === 'pending', 'Binary storage policy must be approved before adding generated binaries');
assert(Array.isArray(manifest.concepts) && manifest.concepts.length === 3, 'Exactly three required concepts must be planned');
assert(Array.isArray(manifest.sequence) && manifest.sequence.length === 7, 'Hero candidate must contain exactly seven ordered beats');

const conceptRoles = new Set(manifest.concepts.map(concept => concept.role));
for (const role of ['survivor', 'infected', 'environment']) {
  assert(conceptRoles.has(role), `Missing required concept role: ${role}`);
}

const expectedPurposes = ['establish', 'reveal', 'build-tension', 'reveal', 'surprise', 'transition', 'transition'];
const seenIds = new Set();
for (const [index, shot] of manifest.sequence.entries()) {
  assert(shot.order === index + 1, `Shot ${shot.id} has incorrect order`);
  assert(!seenIds.has(shot.id), `Duplicate shot id: ${shot.id}`);
  seenIds.add(shot.id);
  assert(shot.purpose === expectedPurposes[index], `Shot ${shot.id} has incorrect purpose`);
  assert(shot.status === 'planned', `Shot ${shot.id} must remain planned until review`);
  assert(shot.reviewStatus === 'pending', `Shot ${shot.id} must remain pending review`);
  assert(Number.isInteger(shot.durationSeconds) && shot.durationSeconds > 0, `Shot ${shot.id} needs a positive integer duration`);
  assert(typeof shot.promptBrief === 'string' && shot.promptBrief.length >= 40, `Shot ${shot.id} needs a meaningful prompt brief`);
  if (shot.medium === 'video') {
    assert(shot.provider === 'blackbox', `Video shot ${shot.id} must use the Blackbox provider`);
    assert(shot.model.startsWith('blackboxai/'), `Video shot ${shot.id} needs a Blackbox model`);
  }
  if (shot.medium === 'web-overlay') {
    assert(shot.provider === 'project', `Overlay shot ${shot.id} must remain project-owned`);
  }
}

const conceptIds = new Set(manifest.concepts.map(concept => concept.id));
for (const shot of manifest.sequence) {
  if (shot.conceptRef) assert(conceptIds.has(shot.conceptRef), `Shot ${shot.id} references an unknown concept`);
}

assert(manifest.sequence.some(shot => shot.inputAsset === 'assets/branding/the-infected-logo.png'), 'Official logo overlay asset is missing');
assert(Array.isArray(manifest.reviewRequirements) && manifest.reviewRequirements.length >= 8, 'Review requirements are incomplete');

console.log(`Hero production candidate validation passed: ${manifest.concepts.length} concepts, ${manifest.sequence.length} sequence beats, dry-run only.`);
