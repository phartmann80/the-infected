# Project Readiness

Snapshot date: 2026-07-17

This is a status record, not a feature promise. Each item is labelled so planned work is not mistaken for completed work. Internal-review media remains non-canonical.

## Completed

- Authoritative repository is `phartmann80/the-infected`.
- The image-generation pipeline is provider-gated, dry-run capable, provenance-producing, and mock-tested.
- Asset and sound registries are present and hash-checked by `validate:registry`.
- The web surface has reduced-motion handling, a WebGL boundary, visibility pausing, audio opt-in, a temporary-media lifecycle, SEO metadata, robots, sitemap, and a small no-store `/api/health` response.
- The landing surface has story, outbreak/world, survivor and infected presentation slots, arsenal, mission, levels, progression, loot/currency prototype copy, Early Access form wiring, legal routes, contact, navigation, and footer structure.
- Accessibility landmark and keyboard-navigation improvements are implemented in Draft PR #31.
- The private server preview, immutable release layout, systemd service, Android CI export, and debug signing foundation were previously accepted as infrastructure prerequisites.

## Prototype

- The landing page is a production-directed prototype, not a final public launch surface.
- The hero still uses temporary non-canonical video, poster, ambience, and narration. One hero key-art candidate remains internal review.
- Environment 001 has a revised internal-review candidate with failed-evacuation detail in Draft PR #34; it is not canonical.
- Survivor 001 has one internal-review candidate in Draft PR #33; it is not canonical. The Infected slot remains a placeholder.
- Early Access validation, consent handling, and a privacy-safe Node route exist behind `EARLY_ACCESS_ENABLED=false`; public registration is not enabled.
- The Godot Android project exports a debug APK through CI, but the gameplay loop has not been proven on a physical device.

## Placeholder

- Final hero composition, final cinematic video/poster/audio, canonical Environment 001, canonical Survivor 001, and canonical Infected 001 are not approved.
- The Infected presentation remains a registry-governed placeholder rather than a final character or enemy design.
- Weapons, levels, progression, loot, and currency copy are clearly labelled prototype data and are not final game canon.
- Legal pages and contact routes are structural prototype surfaces pending final ownership, support, retention, and data-request language.

## Blocked

- Physical Android validation is blocked until an authorized device is connected for installation, launch, touch, camera, combat, loot, save/load, FPS, memory, and screenshot evidence.
- Creative approval is blocked on review of the hero, Environment 001, and Survivor 001 candidates before any asset becomes canonical.
- Public Early Access registration is blocked on approved backend storage, retention, privacy, deletion, and contact handling.
- Public deployment remains outside the current scope; the approved work is private preview only.

## Not started

- Final creative approval and promotion of any generated production asset to canonical status.
- Physical-device approval of the Android vertical slice.
- Backend services for identity, player profiles, cloud saves, inventory, analytics, and APK version checks.
- Public registration enablement and its operational data-retention process.
- DNS, SSL, ports 80/443, Vercel, Docker, n8n, firewall, and public exposure changes.

## Current gates

### Physical Android device

Install the exact CI-generated debug APK and verify movement, camera, combat telegraph timing, loot collection, inventory, save/load, stability, FPS, memory, and screenshots on a real authorized device. Do not expand gameplay systems before this gate.

### Creative candidate review

Review the hero, Environment 001 revision, and Survivor 001 candidate against the creative direction, Android practicality, environmental storytelling, and registry approval rules. Do not generate a broad character or enemy roster first.

### Early Access review

Approve the backend contract, retention period, deletion process, private data-request channel, and final legal language before enabling `EARLY_ACCESS_ENABLED`.

### Private server preview

Only an exact approved main commit may be deployed to loopback. DNS, SSL, ports 80/443, Vercel, Docker, n8n, and public firewall changes remain out of scope.

## Evidence boundary

Each Draft PR must be validated by its own GitHub Actions run. Local validation is evidence for that branch only and must not be described as validation of `main`. Internal-review assets must retain their provider, model-identifier availability, hash, dimensions, and non-canonical status.
