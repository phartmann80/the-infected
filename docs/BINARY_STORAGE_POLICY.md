# Binary Storage Policy

Status: Decision required before heavy asset production.

The repository must not become permanent storage for hundreds of megabytes of generated game assets, cinematic videos, source audio, GLB/FBX files, texture atlases, or build artifacts.

## Current rule

Until a storage decision is approved:

- Do not commit generated GLBs, FBX files, cinematic videos, source audio, large texture sets, or Android build artifacts.
- Keep only approved lightweight seed assets required for foundation work in Git.
- Track canonical metadata in `assets/registry.json` and `assets/sound-registry.json`.
- Store large production binaries only after the team approves Git LFS vs external object storage/CDN delivery.

## Decision required

Choose one of:

1. **Git LFS** for approved binary source assets with repository-level LFS controls.
2. **External object storage + CDN** for generated assets, with registry metadata pointing to immutable object versions.
3. **Hybrid**: Git LFS for small canonical source assets; object storage/CDN for videos, audio stems, generated 3D outputs, and marketplace media.

## Required future ADR

Create an ADR before adding heavy content that defines:

- Size thresholds.
- Allowed file types in Git.
- LFS or object-storage provider.
- CDN/cache strategy.
- Provenance and checksum requirements.
- Backup/retention policy.
