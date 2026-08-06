# Meshy Asset Provenance

## Generation Model

- **Model:** meshy-6 (text-to-3D pipeline)
- **Verification status:** [Pending external evidence] — Meshy job/asset metadata not yet documented. The generation model claim is unverified until Meshy API response metadata is captured.
- **API key:** Stored in credentials vault (paid plan)

## Asset Inventory

### Survivor 001

| Field | Value |
| --- | --- |
| GLB filename | `survivor-001.glb` |
| File size | 11,984,060 bytes (11.4 MB) |
| SHA-256 | `65c8b2c3bfdbf939f8f17156328e186f2ed7107a5b461337bf43840971204758` |
| Triangle count | ~665,800 |
| Rigged | No |
| Animated | No |
| Texture resolution | 2048x2048 (estimated) |
| Storage location | External to repository |
| Commercial use | [Pending external evidence] — Must verify under Meshy ToS |
| Android-ready | **No** — approximately 665,800 triangles, not rigged, not animated |
| Meshy asset ID | [Pending external evidence] |
| Creation date | Aug 5, 2026 (estimated) |
| Account plan | [Pending external evidence] |

### Infected 001

| Field | Value |
| --- | --- |
| GLB filename | `infected-001.glb` |
| File size | 8,272,176 bytes (7.9 MB) |
| SHA-256 | `1cea8c99fb48981c167d1bd7a327c77b5107c0f12dee20ce74d35787949637e3` |
| Triangle count | ~459,532 |
| Rigged | No |
| Animated | No |
| Texture resolution | 2048x2048 (estimated) |
| Storage location | External to repository |
| Commercial use | [Pending external evidence] — Must verify under Meshy ToS |
| Android-ready | **No** — approximately 459,532 triangles, not rigged, not animated |
| Meshy asset ID | [Pending external evidence] |
| Creation date | Aug 5, 2026 (estimated) |
| Account plan | [Pending external evidence] |

### Infected 002

| Field | Value |
| --- | --- |
| GLB filename | No GLB located |
| Status | **[Missing]** — Only PNG renders exist |
| PNG renders | `apps/web/public/assets/characters/infected-002.png`, `apps/web/public/assets/cinematic/infected-002-v3-meshy.png` |
| Classification | Missing for gameplay integration |
| Android-ready | **No** |

## Android-Readiness Requirements (All Pending)

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

## Meshy Usage Scope

Meshy may be used for:

- 3D character generation (infected models, survivors)
- Weapons
- Gear
- Environmental objects
- Promotional 3D assets

All Meshy requests must go through the backend AI media generation platform (see `ai-media-generation-architecture.md`).