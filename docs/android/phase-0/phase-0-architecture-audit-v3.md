# Phase 0 v3 - Android Architecture Audit: The Infected

**Project:** The Infected - Zombie Survival Shooter  
**Engine:** Godot 4.7.1 (Android-first)  
**Audit Date:** Phase 0 v3 - Repository-authoritative version  
**Branch:** `integration/android-apk-production-v1`  
**Head SHA:** `62fdff13283feefa53b514042dcd1bc66662f70e`  
**PR:** [#66](https://github.com/phartmann80/the-infected/pull/66) (Draft, unmerged)

> This document supersedes all previous Scribe-based audit versions. It is the final authoritative Phase 0 audit, committed to the repository for durable version control.

## Truthfulness Categories

The following categories are used consistently throughout this document:

1. **Implemented and CI-tested** - Code exists and passes headless CI tests
2. **Implemented but physical-device-unverified** - Code exists and passes CI but has not been tested on physical Android hardware
3. **Placeholder** - Procedural or temporary implementation standing in for a production system
4. **Architecture approved but not implemented** - Design is approved; no code exists yet
5. **Asset exists but not Android-ready** - A file exists but has not been validated for Android/Godot
6. **Pending external evidence** - Requires data from an external source not yet obtained
7. **Missing** - No implementation or asset exists

---

## 1. Branch and SHA

| Field | Value |
| --- | --- |
| Branch | `integration/android-apk-production-v1` |
| Created from | `integration/android-vertical-slice-v1` |
| Parent SHA | `aa04fa3e7714d46bf8d3d4eda9b671c1d34b9390` |
| Head SHA | `62fdff13283feefa53b514042dcd1bc66662f70e` |
| Working tree | Clean (audit-only, no game code changes) |
| Audit commit message | `phase0: audit-only marker - no refactoring, no new systems, no signing keys` |

This branch was created exclusively for the Phase 0 audit. No game code was modified, no new systems were introduced, and no signing keys were generated or committed.

## 2. Draft PR

| Field | Value |
| --- | --- |
| PR | #66 |
| URL | https://github.com/phartmann80/the-infected/pull/66 |
| Status | Draft, open |
| Base | `integration/android-vertical-slice-v1` |
| Head | `integration/android-apk-production-v1` |

**Constraint:** PR #66 remains Draft and unmerged. Do not merge, close, retarget, or mark ready for review.

## 3. Current Project Architecture

The Godot project lives at `apps/android/` within a monorepo (`phartmann80/the-infected`). The repository also contains a Next.js web application (`apps/web/`) serving the landing page at theinfected.app, shared TypeScript packages, and a `docs/` directory with 25+ design and architecture documents.

### Godot Project Structure

| Path | Size | Description |
| --- | --- | --- |
| `apps/android/project.godot` | 791 bytes | Godot 4.7.1, mobile renderer, package ID `app.theinfected.game`, min SDK 28, target SDK 36, ABI arm64-v8a, orientation=1 |
| `apps/android/export_presets.cfg` | 572 bytes | Single Android export preset, version/code=1, version/name="0.1.0-prototype", debug keystore only |
| `apps/android/scenes/main.tscn` | 181 bytes | Minimal Node3D root with main.gd attached |
| `apps/android/scripts/` | 13 files | GDScript source files |
| `apps/android/data/` | 3 files | JSON data files |
| `apps/android/tests/` | 6 files | GDScript test files |

### Prototype Status

The project is a prototype vertical slice. All gameplay logic lives in a single 106 KB `main.gd` monolith. There are no 3D model files committed to the repository. No texture files. No production audio files. No cinematic video files. The game uses procedural placeholder geometry (boxes, capsules) rendered through code.

## 4. Scene Map

Only one scene exists:

| Scene | Status | Notes |
| --- | --- | --- |
| `apps/android/scenes/main.tscn` | [Implemented but physical-device-unverified] | 181 bytes, Node3D root with main.gd attached. All game content spawned procedurally. |

### Missing Scenes [Missing]

Main menu, level selection, pause menu, inventory UI, shop, cinematic/video player, login/auth, game over, level complete. All UI flows are rendered procedurally within main.gd at runtime.

## 5. main.gd Responsibility Map (106 KB - Major Architecture Risk)

`main.gd` (106,469 bytes, 2,635 lines) is a single GDScript file handling everything. This is the single biggest architecture risk in the project.

| # | Responsibility | Status | Notes |
| --- | --- | --- | --- |
| 1 | Scene initialization | [Implemented but physical-device-unverified] | `_ready()`, initializes all subsystems procedurally |
| 2 | Player movement | [Implemented but physical-device-unverified] | Touch-based virtual joystick, drag-to-move |
| 3 | Touch input | [Implemented but physical-device-unverified] | Delegates to `prototype_touch_input.gd` |
| 4 | Camera | [Implemented but physical-device-unverified] | Camera follow, lock-ahead, impact shake |
| 5 | Infected spawning | [Implemented but physical-device-unverified] | `spawn_infected()`, wave management |
| 6 | Infected AI | [Implemented and CI-tested] | Delegates to `prototype_infected_brain.gd` |
| 7 | Combat (firearms) | [Implemented and CI-tested] | Delegates to `prototype_weapon_state.gd` |
| 8 | Combat (melee) | [Implemented and CI-tested] | Delegates to `prototype_combat_motion.gd` |
| 9 | Inventory | [Implemented and CI-tested] | Delegates to `prototype_field_inventory.gd`. Full 30-item catalog loaded |
| 10 | Equipment / loadout | [Implemented and CI-tested] | Delegates to `prototype_loadout.gd` |
| 11 | Loot drops | [Placeholder] | `loot_drop()` exists; no loot table system |
| 12 | Objectives | [Implemented and CI-tested] | `_update_objective()` (line 1420): reach beacon, neutralize infected, collect salvage, mark complete, save, replay |
| 13 | Health / damage | [Implemented but physical-device-unverified] | Player health, infected health, damage overlay |
| 14 | Save / load | [Implemented and CI-tested] | `SAVE_PATH = "user://save_v1.json"` (line 17), schema v7 (line 18). Real FileAccess I/O (lines 2525-2613). Auto-save every 2.0s |
| 15 | Audio | [Implemented and CI-tested] | Procedural placeholder audio via AudioStreamGenerator. No production audio files |
| 16 | Narration | [Implemented and CI-tested] | Narration cue queue, subtitle label, placeholder tones. No Voicebox files |
| 17 | UI / HUD | [Implemented and CI-tested] | All procedural: health bar, hit markers, ammo, objective, pause, inventory, defeat panels |
| 18 | Pause state | [Implemented and CI-tested] | Procedural pause flow |
| 19 | Defeat / recovery | [Implemented and CI-tested] | Defeat panel, retry/load buttons |
| 20 | Level completion | [Implemented and CI-tested] | Single-route completion loop. Multi-level [Missing] |
| 21 | Actor animation | [Implemented and CI-tested] | Delegates to `prototype_actor_animation.gd` |
| 22 | Weapon presentation | [Placeholder] | Delegates to `prototype_weapon_presentation.gd` |
| 23 | Item catalog | [Implemented and CI-tested] | 51 KB catalog, all 30 items defined |
| 24 | Combat feedback | [Implemented and CI-tested] | Delegates to `prototype_combat_feedback.gd` |

### Extraction Plan (Do NOT Implement During Phase 0)

main.gd should be split into: PlayerController, CameraController, InfectedManager, CombatSystem, InventoryManager, ObjectiveSystem, SaveSystem, AudioManager, NarrationManager, HUDController, PauseController, LevelManager, GameStateMachine. Each extraction must preserve existing behavior exactly. The extraction should happen incrementally in Phase 1/2.

## 6. Systems That Can Be Preserved

| System | File | Status |
| --- | --- | --- |
| Touch input | `prototype_touch_input.gd` | [Implemented but physical-device-unverified] |
| Weapon state | `prototype_weapon_state.gd` | [Implemented and CI-tested] |
| Combat motion | `prototype_combat_motion.gd` | [Implemented and CI-tested] |
| Combat feedback | `prototype_combat_feedback.gd` | [Implemented and CI-tested] |
| Actor animation | `prototype_actor_animation.gd` | [Implemented and CI-tested] |
| Infected brain | `prototype_infected_brain.gd` | [Implemented and CI-tested] |
| Scene audio | `prototype_scene_audio.gd` | [Implemented and CI-tested] |
| Item catalog | `item_catalog.gd` | [Implemented and CI-tested] |
| Field inventory | `prototype_field_inventory.gd` | [Implemented and CI-tested] |
| Loadout | `prototype_loadout.gd` | [Implemented and CI-tested] |
| Weapon presentation | `prototype_weapon_presentation.gd` | [Placeholder] |

## 7. Placeholder and Missing Systems

| System / Asset | Status | Notes |
| --- | --- | --- |
| 3D character models | [Missing] | No .glb/.gltf in repo. Meshy models exist externally (see Section 8) |
| 3D weapon models | [Missing] | Weapons are catalog data only |
| 3D environment | [Missing] | Flat plane with procedural props |
| Production audio files | [Missing] | Procedural placeholder audio only |
| Cinematic video files | [Missing] | No .ogv/.mp4 in Godot project |
| Voicebox narration | [Missing] | Placeholder tones only |
| Main menu scene | [Missing] | No .tscn file |
| Level selection scene | [Missing] | No .tscn file |
| Shop UI | [Missing] | No economy, no purchase system |
| Login / auth UI | [Missing] | No OAuth configuration |
| Backend server | [Missing] | Server runs landing page only |
| Cloud save | [Missing] | Local save implemented, no cloud sync |
| Multi-level structure | [Missing] | Single-route only |
| Dedicated .tscn UI scenes | [Missing] | All UI is procedural in main.gd |

## 8. Character Readiness

No game-ready 3D character models are committed to the repository. All in-game characters are procedural placeholder geometry. Meshy-generated GLB files exist outside the repository.

| Character | GLB Status | Triangle Count | Rigged | Animated | Android-Ready |
| --- | --- | --- | --- | --- | --- |
| Survivor 001 | GLB exists (external) | ~665,800 | No | No | No |
| Infected 001 | GLB exists (external) | ~459,532 | No | No | No |
| Infected 002 | No GLB located | N/A | N/A | N/A | No |

### Android-Readiness Requirements (All Pending)

Before any Meshy model can be considered Android-ready, it must pass:

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

See `evidence/meshy/meshy-asset-provenance.md` for per-asset SHA-256 hashes and paths.

## 9. Weapon and Gear Readiness

Weapons and gear exist as data definitions in `item_catalog.v1.json` (51 KB). No 3D models exist for any item.

### Weapons (10 total, data only)

| # | Weapon ID | Type | Status |
| --- | --- | --- | --- |
| 1 | weapon.raven12 | Shotgun | [Implemented and CI-tested] (data only) |
| 2 | weapon.warden9 | Pistol (equipped by default) | [Implemented and CI-tested] (data only) |
| 3 | weapon.cinder5 | Firearm | [Implemented and CI-tested] (data only) |
| 4 | weapon.holt7 | Rifle | [Implemented and CI-tested] (data only) |
| 5 | weapon.breaker40 | Rifle | [Implemented and CI-tested] (data only) |
| 6 | weapon.quarry10 | SMG | [Implemented and CI-tested] (data only) |
| 7 | weapon.longwatch308 | Firearm | [Implemented and CI-tested] (data only) |
| 8 | weapon.breach6 | Firearm | [Implemented and CI-tested] (data only) |
| 9 | weapon.atlas45 | Firearm | [Implemented and CI-tested] (data only) |
| 10 | weapon.emberline | Rifle | [Implemented and CI-tested] (data only) |

Melee/thrown: weapon.machete (melee, damage 45), frag grenade.

### Gear (20 total, data only)

All 20 gear IDs defined in catalog. Currently carried: `weapon.warden9` + `gear.fieldpack45`. Remaining 28 items are preview-only. No 3D models exist for any item.

## 10. Audio and Narration Readiness

| Component | Status | Notes |
| --- | --- | --- |
| Scene audio system | [Implemented and CI-tested] | `prototype_scene_audio.gd`, loads from `data/scene_audio.v1.json` |
| Procedural placeholder audio | [Implemented and CI-tested] | AudioStreamGenerator: ambience, narration tones, combat, firearm, melee, reload, footsteps, beacon |
| Production audio files | [Missing] | Zero .ogg/.wav/.mp3 files |
| Narration system | [Implemented and CI-tested] | Cue queue, subtitle routing, placeholder tones. No Voicebox files |
| Voicebox narration | [Missing] | See `evidence/voicebox/voicebox-evidence.md` |
| Background music | [Missing] | No music streams |

## 11. Cinematic Readiness

| Component | Status | Notes |
| --- | --- | --- |
| VideoStreamPlayer | [Missing] | No node in any scene |
| Cinematic scene/controller | [Missing] | No cinematic scene |
| Skip input | [Missing] | No skip button |
| Subtitle system | [Implemented and CI-tested] | Subtitle cue routing and label exist in main.gd/scene_audio.gd |
| .ogv import support | [Missing] | No .ogv files, no import config |
| Transition to gameplay | [Missing] | Not implemented |

The cinematic pipeline architecture is approved (see `cinematic-pipeline-architecture.md`). The representative quality test has been performed on the server (see Section 21). The pipeline is proven on the server; visual quality is awaiting Paul's approval; Godot playback and Android performance have not been validated.

## 12. Save / Load Readiness

| Component | Status | Notes |
| --- | --- | --- |
| Save schema | [Implemented and CI-tested] | Schema v7 (line 18). 14 persisted fields |
| File I/O | [Implemented and CI-tested] | `user://save_v1.json`. FileAccess open/read/write. Headless-tested |
| Save/load controls | [Implemented and CI-tested] | Manual buttons + auto-save every 2.0s |
| Cloud save | [Missing] | No backend, no sync |
| Save migration | [Missing] | No migration code despite schema versioning |
| Physical-device persistence | [Pending external evidence] | Requires physical Android device test |

## 13. Android Export Configuration

### From project.godot

| Field | Value |
| --- | --- |
| Engine | Godot 4.7.1 |
| Renderer | Mobile |
| Package ID | `app.theinfected.game` |
| Min SDK | 28 (Android 9.0) |
| Target SDK | 36 |
| ABI | arm64-v8a |
| Orientation | `window/handheld/orientation=1` -> SCREEN_PORTRAIT |
| Viewport | 1280x720 (landscape aspect ratio) |

### Orientation Discrepancy

The viewport is 1280x720 (landscape) but `orientation=1` maps to `SCREEN_PORTRAIT` in the Godot 4 DisplayServer.ScreenOrientation enum. The game and touch HUD are designed for landscape. This configuration is likely a bug: the exported AndroidManifest will lock the app to portrait while game content is designed for landscape. **Do not change until the baseline APK is reproduced and tested on a physical device.**

### From export_presets.cfg

| Field | Value |
| --- | --- |
| Version code | 1 |
| Version name | `0.1.0-prototype` |
| Package unique name | `app.theinfected.game` |
| Min SDK | 28 |
| Target SDK | 36 |
| ABI | arm64-v8a |
| Debug keystore | `~/.android/debug.keystore` (local preset only) |
| Release keystore | Not configured |

### Missing from Export Configuration [Missing]

Release keystore, custom package name validation, export filters for assets, permissions declaration, launch screen icon.

## 14. Signing and Fingerprint Status

See `signing-and-fingerprints.md` for complete details.

### Signing Context A - Local Export Preset [Placeholder]

No release keystore configured. Local preset references Godot default debug keystore. Suitable for local development only.

### Signing Context B - CI APK [Implemented but physical-device-unverified]

The Android Prototype workflow decodes a protected development JKS from GitHub Secrets and signs with apksigner. This is **not** the Godot default debug key.

| Field | Value |
| --- | --- |
| Signing source | Protected development JKS from GitHub Secrets |
| Certificate subject | `CN=The Infected Development, O=The Infected, C=US` |
| Certificate SHA-1 | `10a6508f9373d09280122688fac115d7449efa10` |
| Certificate SHA-256 | `fa71008890aff510f054507409788c9b0b81643d1f694877d7be3cf40bcf1a46` |
| Certificate serial | `18A8E0` |
| Certificate not before | `Jul 16 23:47:24 2026 GMT` |
| Certificate not after | `Jul 13 23:47:24 2036 GMT` |
| Key algorithm | RSA |
| Key size | 2048 bits |
| Signing schemes | v3 (APK Signature Scheme v3) = true; v1 = false; v2 = false; v3.1 = false; v4 = false |
| Status | **Development signing certificate** - not the future Google Play production signing identity |

### Release / Upload Certificate [Missing]

No release keystore exists. Must be created in Phase 1.

## 15. Fresh Baseline APK Evidence

See `apk-baseline-evidence.md` and `evidence/apk/` for complete details.

**Status: BUILD SUCCESS** - APK produced and verified via CI.

| Field | Value |
| --- | --- |
| Workflow Run ID | 31101247866 |
| Job ID | 92615083108 |
| Source SHA | `62fdff13283feefa53b514042dcd1bc66662f70e` |
| Run conclusion | success |
| Build duration | 193 seconds (3.2 minutes) |
| Run started | 2026-08-06T12:24:22Z |
| Run completed | 2026-08-06T12:27:35Z |

### Contract Test Results (all 6 passed)

| # | Test | Result |
| --- | --- | --- |
| 1 | item_inventory_test | PASSED |
| 2 | weapon_interaction_test | PASSED |
| 3 | infected_brain_test | PASSED |
| 4 | combat_polish_test | PASSED |
| 5 | touch_input_test | PASSED |
| 6 | gameplay_loop_test | PASSED |

### APK Metadata

| Field | Value |
| --- | --- |
| Package ID | `app.theinfected.game` |
| Version code | 1 |
| Version name | `0.1.0-prototype` |
| Min SDK | 28 |
| Target SDK | 36 |
| ABI | arm64-v8a |
| APK size | 83,949,287 bytes (80.1 MB) |
| APK SHA-256 | `458e36d57d641596fbc7061814cc744fe183fb8b7ac73d0f5c222181f7d7a34a` |
| Artifact ZIP size | 29,527,440 bytes (28.2 MB) |
| Artifact ZIP SHA-256 | `9e9483db86655306715a94b771fabf39e7cb900c403dfdf070a3301d61a7136a` |

### Build Warnings

1. No Android project icon (Godot export advice)
2. No ADB daemon running (ADB-related steps skipped)
3. Godot ObjectDB leaks (3 instances, non-fatal)
4. setup-java@v4 action deprecated
5. Node 20 runtime deprecated

### Device Validation

**This APK has NOT been validated on physical Android hardware.** CI build success is not physical-device validation. The APK must be installed and tested on a real Android device before Phase 0 can be fully approved.

## 16. Proposed Level 1 Vertical Slice

| Field | Value |
| --- | --- |
| Level name | Arrival Route |
| Environment | Abandoned urban checkpoint |
| Objective | Reach extraction point |
| Survivor | Survivor 001 (placeholder initially) |
| Infected | Infected 001 (shamblers), Infected 002 (crawlers) |
| Weapons | Warden-9 pistol, Raven-12 shotgun, machete |
| Gear | Field pack, armor vest, medic kit |
| Completion | Reach extraction zone |
| Failure | Player health reaches 0 |
| Save checkpoint | Auto-save on level completion |
| Play duration | 3-5 minutes |
| Intro cinematic | 15-20 seconds, .ogv, pre-generated via FFmpeg pipeline |

## 17. Phase 1 and Phase 2 Task Breakdown

### Phase 1 - Signing, Fingerprints, Google Login

1. Create release keystore (`the-infected-upload.jks`)
2. Record certificate fingerprints via keytool
3. Configure export_presets.cfg with release keystore
4. Build and verify signed debug APK
5. Set up Google OAuth client
6. Implement Android Credential Manager with Sign in with Google
7. Implement guest mode
8. Implement backend token verification
9. Document all fingerprints

### Phase 2 - Level 1 Vertical Slice

1. Extract main.gd into PlayerController, CameraController, InfectedManager
2. Create main menu scene
3. Create level loading system
4. Build Level 1 environment
5. Create dedicated level completion .tscn scene
6. Create dedicated game-over .tscn scene
7. Verify save file persistence on physical device
8. Add Level 1 weapons with placeholder models
9. Add Level 1 infected with placeholder geometry
10. Add Level 1 gear pickups
11. Add Level 1 ammo pickups
12. Add audio files
13. Add Level 1 intro cinematic (.ogv)
14. Build and test signed APK on physical device

## 18. Risks and Blockers

See `risks-and-blockers.md` for the complete risk register.

| # | Risk | Severity | Status |
| --- | --- | --- | --- |
| 1 | main.gd monolith (106 KB) | High | [Implemented but physical-device-unverified] |
| 2 | No 3D assets | High | [Asset exists but not Android-ready] |
| 3 | No audio assets | Medium | [Missing] |
| 4 | No backend server | High | [Missing] |
| 5 | Save file I/O device persistence | Medium | [Pending external evidence] |
| 6 | No release keystore | Medium | [Missing] |
| 7 | Fresh APK produced, device validation pending | High | [Pending external evidence] |
| 8 | Godot 4.7.1 availability | Medium | [Implemented and CI-tested] |
| 9 | No cinematic system | Medium | [Architecture approved but not implemented] |
| 10 | No level structure | Medium | [Missing] |
| 11 | No Google OAuth | Medium | [Missing] |
| 12 | No physical device for testing | High | [Pending external evidence] |
| 13 | Orientation mismatch | Medium | [Implemented but physical-device-unverified] |

## 19. Recommended First Implementation Commit

1. Extract PlayerController from main.gd into `scripts/player_controller.gd`
2. Extract CameraController from main.gd into `scripts/camera_controller.gd`
3. Verify all existing tests still pass after extraction
4. No new features, no new assets - pure refactor with behavior preservation
5. Commit message: `phase1: extract PlayerController and CameraController from main.gd (behavior-preserving refactor)`

## 20. Cinematic Architecture

See `cinematic-pipeline-architecture.md` for the complete cinematic pipeline architecture, including:

- CPU-only creation tools (FFmpeg, Python/Pillow/Cairo, Voicebox)
- Godot VideoStreamPlayer playback decision (.ogv format)
- Pipeline flow and directory structure
- Level 1 cinematic manifest schema
- FFmpeg/Python build pipeline
- Build validation requirements
- APK-size and performance gate
- Implementation commit plan (9 commits, post-Phase 0 approval)
- Phase boundary (architecture only, no implementation)

### Representative Quality Test

A representative quality test was performed on the server. See `evidence/cinematics/` for complete evidence.

**Canonical Encode (Encode A):**

| Metric | Value |
| --- | --- |
| Filename | `cinematic_representative.ogv` |
| Duration | 18.0 seconds |
| Resolution | 1280x720 |
| Frame rate | 24 fps |
| Pixel format | yuv420p |
| Video codec | theora |
| Audio codec | vorbis (44100 Hz, stereo, 128 kbps) |
| File size | 2,330,198 bytes (2.2 MB) |
| SHA-256 | `77499d95b04f7873c3e8b979fe6c7bfadc2d6c0c2a5aab7a1c6c46e1989ba73a` |
| Video quality | q:v 6 |
| Audio quality | q:a 4 |
| Encode time | ~45 seconds (CPU-only, AMD EPYC, 8 cores) |
| MP4 review copy | `cinematic_review.mp4`, 1,480,062 bytes (1.4 MB) |
| MP4 SHA-256 | `17059b7c756d536596fe8ffb9e921077710ee76166c3dccf7d9348dcc695002d` |
| Status | **Canonical representative test. Pipeline proven on server. Visual quality awaiting Paul's approval. Godot playback and Android performance not yet validated.** |

**Superseded Encode (Encode B):**

| Metric | Value |
| --- | --- |
| Filename | `level_01_representative_test.ogv` |
| Duration | 15.0 seconds |
| Resolution | 1280x720 |
| Frame rate | 24 fps |
| Pixel format | yuv444p (inflates file size) |
| Video codec | theora |
| Audio codec | vorbis (44100 Hz, stereo, 160 kbps) |
| File size | 4,095,673 bytes (3.9 MB) |
| SHA-256 | `6dd8b5b1977af87a465e2c9d0a124ace2700745218273dd60db12f2b205198ab` |
| Video quality | q:v 7 |
| Status | **Superseded experimental encode. yuv444p inflates size. 15s at minimum of target range. Retained in evidence record, not deleted.** |

### Source Assets

| Asset | Purpose | SHA-256 |
| --- | --- | --- |
| `asset1_logo.png` | Logo overlay | `725b06699152dbbe7efef7dc82f27ca4356e22a1e55a0ae771d0f6dabb313362` |
| `asset2_weapon.png` | Weapon reveal | `08314a721fbf9f062781ea116472f21b095efc07e9d2344cd66b4dffc223c234` |
| `asset3_gear.png` | Gear display | `a46c9552d2151b67e94f2924d6cc19e79fadc208f4c2469dde8e91664f971b3a` |

### Narration Source

Temporary narration generated via FFmpeg lavfi flite (modulated tone simulating speech rhythm). To be replaced by Voicebox for production.

### Music Source

Temporary ambient drone generated via FFmpeg lavfi (sine waves + aecho filter). No external license required (synthesized in-house). Production music must be licensed before release.

### Subtitle Text

"Equip. Survive. Escape." - displayed at bottom center of frame.

### Representative Frames

Five frames extracted at t=1s, t=5s, t=9s, t=13s, t=17s. See `evidence/cinematics/frames/` for frame files and hashes.

## 21. Audio Validation Design

### Source / Build Inputs (NOT in APK)

| File | Role |
| --- | --- |
| `narration/level_01_narration.wav` | Source narration (Voicebox output, pre-mix) |
| `music/level_01_ambient.ogg` | Source background music (pre-mix) |

### Runtime APK Assets (bundled in APK)

| File | Role |
| --- | --- |
| `cinematics/level_01_intro.ogv` | Final mixed video with audio |
| `cinematics/level_01_subtitles.json` | Subtitle data (text + timing) |

### Build Verification

- ffprobe verifies audio stream exists in .ogv
- Build script verifies each expected source file exists before mixing
- Build script logs: source narration file, source music file, mix command, output file, output hash
- Runtime manifest references only the final .ogv and subtitle data

## 22. Licensing

### FFmpeg

The server's installed FFmpeg binary is built with `--enable-gpl` and GPL components such as libx264; therefore this specific binary is subject to GPL v2+ terms. FFmpeg without GPL components is generally LGPL v2.1+.

- `--enable-nonfree` is **absent** from the build configuration (confirmed).
- FFmpeg remains server-side only and is **not** included in the APK.

See `evidence/ffmpeg/` for unedited command outputs.

### Voicebox

- Repository: `github.com/jamiepine/voicebox`
- Pinned commit: `51f49dea198384b4eb6087b72c17057c6eb1c1cd`
- License: MIT
- This commit is a documentation terminology update. It proves the commit exists but does not prove CPU narration performance.
- Voicebox is used to generate narration audio files at build time. It is **not** embedded in the APK.

#### Voicebox TTS Engine Details (Pending Benchmark)

| Field | Status |
| --- | --- |
| Selected TTS engine | [Pending external evidence] |
| Exact model | [Pending external evidence] |
| Model version/revision | [Pending external evidence] |
| Model license | [Pending external evidence] |
| Model download size | [Pending external evidence] |
| Estimated RAM requirement | [Pending external evidence] |
| CPU support | [Pending external evidence] |
| Language support | [Pending external evidence] |
| Expected generation speed | [Pending external evidence] |
| Commercial-use conclusion | [Pending external evidence] |

Do not install Voicebox, download models, or generate production narration during Phase 0.

### Meshy AI

- Commercial-use status: Each Meshy asset must be verified individually under Meshy's terms of service. Not yet verified.
- Generated assets are owned by the project (paid API key).
- Each asset must have its commercial-use status recorded before import.

### Music

- Current test uses procedurally generated ambient drone (no license required).
- Production music must be licensed for commercial use.

### Python/Pillow

- License: MIT
- Usage: Build-time tool only.

### Ogg Theora + Vorbis

- License: Patent-free and royalty-free.

## 23. Token Security Confirmation

The GitHub PAT used for workflow_dispatch has been cleaned from shell history, temp files, and environment variables. The token does not appear in workflow logs, the audit document, or the repository. Paul should revoke/rotate this token. The token was not stored as an app secret and will not be reused.

## 24. AI Media Generation Architecture

See `ai-media-generation-architecture.md` for the complete centralized AI media generation platform architecture decision, including:

- Open-Generative-AI as the standardized media generation interface
- No-local-GPU infrastructure decision
- Backend orchestration responsibilities
- Provider stack (Langdock, Anymize, Logicc, Meshy)
- Credential-security boundary
- Offline-gameplay boundary
- Relationship to the cinematic pipeline
- Future implementation plan

This is an architecture and documentation decision only. No deployment or implementation occurred during Phase 0.

## 25. Phase 0 Final Confirmations

- PR #66 remains Draft and unmerged [OK]
- No game code was added or modified [OK]
- No Meshy assets were imported [OK]
- No cinematic code was added [OK]
- No FFmpeg libraries added to Android [OK]
- No signing keys were added or committed [OK]
- No Google authentication added [OK]
- No commerce features added [OK]
- No Phase 1 implementation began [OK]
- The 128.8 KB test is labeled as a pipeline functionality test, not a production benchmark [OK]
- The representative quality test is documented with real encode data [OK]
- All JSON examples have been validated [OK]
- Token security cleanup confirmed [OK]
- Working tree is clean [OK]

---

End of Phase 0 v3 Android Architecture Audit - The Infected