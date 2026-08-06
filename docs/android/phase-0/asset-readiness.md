# Asset Readiness

## 3D Character Models

No game-ready 3D character models are committed to the repository. All in-game characters are procedural placeholder geometry (boxes, capsules). Meshy-generated GLB files exist outside the repository.

### Meshy Asset Provenance

| Character | GLB File | File Size | SHA-256 | Triangle Count | Rigged | Animated | Android-Ready |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Survivor 001 | `survivor-001.glb` | 11,984,060 bytes (11.4 MB) | `65c8b2c3bfdbf939f8f17156328e186f2ed7107a5b461337bf43840971204758` | ~665,800 | No | No | **No** |
| Infected 001 | `infected-001.glb` | 8,272,176 bytes (7.9 MB) | `1cea8c99fb48981c167d1bd7a327c77b5107c0f12dee20ce74d35787949637e3` | ~459,532 | No | No | **No** |
| Infected 002 | No GLB located | N/A | N/A | N/A | N/A | N/A | **No** |

### Storage Locations (External to Repository)

- Survivor 001: External to repository
- Infected 001: External to repository
- Infected 002: No GLB found. Only PNG renders exist in `apps/web/public/assets/characters/infected-002.png` and `apps/web/public/assets/cinematic/infected-002-v3-meshy.png`

### Android-Readiness Classification

**Survivor 001:** GLB exists, but currently not Android-ready due to approximately 665,800 triangles.

**Infected 001:** GLB exists, but currently not Android-ready due to approximately 459,532 triangles.

**Infected 002:** No GLB located; PNG renders only; classified as [Missing] for gameplay integration.

### Android-Readiness Requirements (All Pending)

Before any Meshy model can be called ready for Godot, it must pass:

1. Mobile retopology
2. LOD levels
3. Material review
4. Texture compression
5. Rigging
6. Animation validation
7. Collision setup
8. Android frame-rate test

**None of these have been performed.** Do not import Meshy GLBs during Phase 0.

### Meshy Generation Model

- **Model:** meshy-6 (text-to-3D pipeline)
- **Verification status:** [Pending external evidence] - Meshy job/asset metadata not yet documented. The generation model claim is unverified until Meshy API response metadata is captured.

### Commercial-Use Status

Each Meshy asset must be verified individually for commercial use under Meshy's terms of service. Not yet verified. The project uses a paid Meshy API key (stored in credentials vault).

## 3D Weapon Models

No 3D weapon models exist. All 10 weapons are catalog data only (`item_catalog.v1.json`). No GLB files for any weapon.

## 3D Gear Models

No 3D gear models exist. All 20 gear items are catalog data only. No GLB files for any gear.

## 3D Environment / Level Geometry

No environment assets. Level is a flat plane with procedural props.

## Production Audio Files

No .ogg/.wav/.mp3 files in the Godot project. Procedural placeholder audio is generated at runtime via AudioStreamGenerator.

## Cinematic Video Files

No .ogv/.mp4 files in the Godot project. Representative quality test encodes exist on the server and in Drive storage (see `cinematic-pipeline-architecture.md`).

## Landing-Page Renders

The landing-page PNG renders (in the web app and Delos drive) are 2D images, not 3D game assets. They cannot be imported into Godot as character models. The Meshy-generated GLB files stored outside the repository are the actual 3D assets.