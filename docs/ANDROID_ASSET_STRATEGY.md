# Android Asset Strategy

Status: foundation policy for the Godot evaluation prototype; production asset approval remains open.

Android assets must be reusable game inputs, not isolated marketing illustrations. The web landing page may consume delivery derivatives, but the Android runtime must receive a registered, reviewable asset package.

## Canonical asset record

Every candidate asset receives a stable ID and a record containing:

- canonical asset ID and asset type;
- source file paths and derivative paths;
- provenance, provider, model, version, seed, prompt, and reference history;
- approval state: `internal-review`, `approved`, `canonical`, or `rejected`;
- licensing terms and commercial-use status;
- topology, rigging, animation-readiness, material, texture, and compression notes;
- Android reuse flag and minimum supported renderer;
- web-preview derivative flag, dimensions, format, and hash;
- reviewer, review date, and rejection or revision reason.

The registry and provenance record are the source of truth. A Godot scene or imported mesh is a delivery representation, not a replacement for the record.

## First production asset gate

Do not generate a large roster. The first approved production set is:

1. Survivor 001.
2. Infected 001.

Each must be reviewed for game-ready topology, clean material separation, texture budgets, rigging and animation readiness, LOD strategy, collision/physics needs, and Android memory/performance impact before web derivatives are approved.

The current prototype may use primitives or explicitly marked review placeholders. Temporary web media must not be promoted to Android-canonical content because it appears in a working deployment.

## Derivative strategy

- Preserve the original source/master outside Git when it is too large for the approved binary policy.
- Create a game-ready Android derivative with documented scale, orientation, skeleton, materials, texture resolution, compression, LODs, and collision shapes.
- Create web-preview derivatives separately with documented crop, format, dimensions, and visual differences.
- Keep IDs stable across source, Android, and web derivatives.
- Record hashes for every approved derivative and block automatic canonical promotion.

## Controlled generation pipeline

The approved order is:

1. Approve one hero composition.
2. Produce one game-ready survivor.
3. Produce one game-ready infected.
4. Approve web-render derivatives.
5. Generate one short MuAPI image-to-video hero shot.
6. Verify Voicebox repository/version, license, commercial terms, hardware, consent safeguards, languages, formats, speed, and server feasibility.
7. Generate and review narration.
8. Synchronize video, narration, ambience, captions, and sound design.
9. Optimize desktop, mobile, and Android derivatives.
10. Register all approved outputs before expanding the roster.

MuAPI shots must be short, storyboarded, reference-controlled, and reviewed shot by shot. Voicebox output must preserve the original master, transcript, subtitles, pronunciation notes, pacing direction, and mobile-compressed derivative. Neither pipeline is enabled by this document.

## API and cost controls

Before any live generation is authorized:

- identify the exact API account and provider key owner;
- keep credentials outside Git, `.env` commits, deployment scripts, and logs;
- define a per-request cost cap and a total review budget;
- generate one asset or shot at a time;
- record provider, model, seed, prompt, references, cost, output hash, and approval state;
- require human approval before canonical promotion;
- prevent batch generation without an explicit approval record;
- preserve the accepted visual benchmark for comparison.

No live Voicebox, MuAPI, character-generation, narration, or paid media request is enabled by the Android prototype foundation.
