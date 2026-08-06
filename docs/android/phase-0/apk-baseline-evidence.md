# APK Baseline Evidence

## CI Build

| Field | Value |
| --- | --- |
| Workflow Run ID | 31101247866 |
| Workflow Attempt | 1 |
| Job ID | 92615083108 |
| Job Name | export-debug-apk |
| Job Conclusion | success |
| Source SHA | `62fdff13283feefa53b514042dcd1bc66662f70e` |
| Branch | `integration/android-apk-production-v1` |
| Workflow Event | workflow_dispatch (manually triggered) |
| Run started | 2026-08-06T12:24:22Z |
| Run completed | 2026-08-06T12:27:35Z |
| Build duration | 193 seconds (3.2 minutes) |
| Workflow URL | https://github.com/phartmann80/the-infected/actions/runs/31101247866 |

## Contract Test Results

| # | Test | Result | Scope |
| --- | --- | --- | --- |
| 1 | item_inventory_test | PASSED | Immutable catalog, starter field inventory, collected gear, local equip, save, restore, presentation mapping |
| 2 | weapon_interaction_test | PASSED | Switch, fire, cooldown, magazine, reserve, reload, equip, save, restore |
| 3 | infected_brain_test | PASSED | Dormant, alert, pursuit, steering, wind-up, stagger, recovery, objective activation |
| 4 | combat_polish_test | PASSED | Articulated motion, spatial foley, adaptive ambience, narration cues, blended weapon motion, fire buffering, hit markers, damage overlay, camera response |
| 5 | touch_input_test | PASSED | Analog dead zone, bounded multitouch, drag look, release recovery, landscape subtitle containment, spatial audio emitters, HUD hierarchy, touch target sizing |
| 6 | gameplay_loop_test | PASSED | Spawn, encounter, defeat, catalog loot, field inventory, gear equip, save, reload, continued input |

## Artifact

| Field | Value |
| --- | --- |
| Artifact ID | 8967642530 |
| Artifact name | the-infected-android-debug |
| Artifact size (compressed) | 29,527,440 bytes (28.2 MB) |
| Artifact ZIP SHA-256 | `9e9483db86655306715a94b771fabf39e7cb900c403dfdf070a3301d61a7136a` |
| Artifact download URL | https://github.com/phartmann80/the-infected/actions/runs/31101247866/artifacts/8967642530 |
| APK filename | the-infected-debug.apk |

## APK Metadata (from aapt2 dump badging)

| Field | Value |
| --- | --- |
| Package ID | `app.theinfected.game` |
| Version code | 1 |
| Version name | `0.1.0-prototype` |
| Min SDK | 28 |
| Target SDK | 36 |
| Compile SDK | 36 |
| ABI | arm64-v8a |
| APK size | 83,949,287 bytes (80.1 MB) |
| APK SHA-256 | `458e36d57d641596fbc7061814cc744fe183fb8b7ac73d0f5c222181f7d7a34a` |

## Signing Certificate (from apksigner verify --print-certs)

| Field | Value |
| --- | --- |
| Signing source | Protected development JKS from GitHub Secrets |
| Certificate subject DN | `CN=The Infected Development, O=The Infected, C=US` |
| Certificate issuer DN | `CN=The Infected Development, O=The Infected, C=US` |
| Certificate SHA-1 | `10a6508f9373d09280122688fac115d7449efa10` |
| Certificate SHA-256 | `fa71008890aff510f054507409788c9b0b81643d1f694877d7be3cf40bcf1a46` |
| Certificate serial | `18A8E0` |
| Certificate not before | Jul 16 23:47:24 2026 GMT |
| Certificate not after | Jul 13 23:47:24 2036 GMT |
| Key algorithm | RSA |
| Key size | 2048 bits |
| Signing schemes verified | v3=true; v1=false; v2=false; v3.1=false; v4=false |
| Number of signers | 1 |
| Status | **Development signing certificate** - not the future Google Play production signing identity |

## Build Warnings

1. No Android project icon (Godot export advice)
2. No ADB daemon running (ADB-related steps skipped)
3. Godot ObjectDB leaks (3 instances, non-fatal)
4. setup-java@v4 action deprecated
5. Node 20 runtime deprecated on GitHub Actions runners

## Device Validation Status

**NOT VALIDATED on physical Android hardware.** CI build success is not physical-device validation. The APK must be installed and tested on a real ARM64 Android device before Phase 0 can be fully approved.