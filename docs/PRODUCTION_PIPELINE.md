# Production Pipeline

## Source of truth

- Code: GitHub repository.
- Web deploy: Vercel from feature-reviewed commits.
- Game data: `packages/game-data`.
- Asset metadata: `assets/registry.json` and `assets/sound-registry.json`.

## Asset approval

All production assets require provenance, versioning, approval status, and canonical ownership before reuse in Android.

## Android prototype gate

Before heavy content production, deliver a small Android technical prototype proving asset loading, telemetry abstraction, save-file versioning, performance budget, and build/signing workflow.

## Large binary asset gate

Do not add generated GLBs, cinematic videos, source audio, or other large binary assets until `docs/BINARY_STORAGE_POLICY.md` is approved and an ADR selects Git LFS, external object storage/CDN, or a hybrid policy.
