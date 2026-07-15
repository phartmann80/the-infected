# Project Readiness

Snapshot date: 2026-07-15

This is a status record, not a feature promise. Each item is labelled so planned work is not mistaken for completed work. Temporary prototype media remains non-canonical.

## Completed

- Authoritative repository is `phartmann80/the-infected`.
- The audited baseline is commit `17b98fd4708111b63836d659817e7556d0c62cb1`.
- The image-generation pipeline is provider-gated, dry-run capable, provenance-producing, and mock-tested.
- Asset and sound registries are present and hash-checked by `validate:registry`.
- The web foundation has reduced-motion handling, a WebGL boundary, visibility pausing, audio opt-in, and temporary-media handling.
- The web foundation now has SEO/Open Graph metadata, robots, sitemap, and a small no-store `/api/health` response.

## Prototype

- The web application is a cinematic hero prototype, not a completed landing page.
- The hero uses temporary, non-canonical video, poster, ambience, and narration.
- The early-access form validates input locally but does not persist submissions.
- The lower page currently contains a directional story transition rather than the complete game-information chapter sequence.

## Placeholder

- `apps/android/README.md` reserves the Android area. It is not an Android project, engine integration, APK, or AAB.
- Survivor 001, Infected 001, Environment 001, final key art, final cinematic media, and production audio are not approved or canonical.

## Blocked

- Production visual and audio approval is blocked on the single hero production candidate review.
- Early-access persistence is blocked on an approved backend/data contract and privacy handling.
- Server deployment is blocked until an exact reviewed commit is approved for private loopback deployment and safe SSH access is available.

## Not started

- Android engine selection and technical prototype.
- Production landing-page chapters: story, levels, weapons, progression, loot/currency, characters, enemies, and final CTA flow.
- Legal pages, contact flow, and production footer.
- Backend services for identity, player data, progress, inventory, cloud saves, analytics, and APK version checks.
- Nginx, systemd, SSL, DNS migration, firewall, backups, and server monitoring.

## Current gates

### Hero production candidate

Approve one exceptional hero composition against the creative direction, Android practicality, environmental storytelling, and registry approval gate. Do not generate a broad character or enemy roster first.

### Android technical prototype

Review the engine decision in `docs/ANDROID_ARCHITECTURE_DECISION.md` before creating a game project. The prototype must prove boot, shared game-data loading, one environment, one player, one infected, health/damage, local save schema, debug APK export, and repeatable CI.

### Private server preview

Deploy only an exact approved main commit to loopback, then verify `/` and `/api/health`. DNS, SSL, ports 80/443, Vercel, Docker, and n8n are outside the first deployment change.

## Evidence boundary

The previous GitHub Actions run validated the audited baseline commit. The new production-readiness branch must be validated independently by its own CI run before merge. Local validation results for a branch must not be described as validation of `main`.
