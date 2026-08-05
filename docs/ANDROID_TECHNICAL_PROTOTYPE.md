# Android Technical Prototype Milestone

Status: evaluation milestone; final engine approval remains open.

The prototype proves the smallest complete runtime path before content-heavy production. It must not become a production roster, economy, or release project.

## Pinned prototype specification

- Engine: Godot `4.7.1-stable`, standard build, not .NET.
- Language: GDScript.
- Primary renderer: Mobile/Vulkan.
- Package ID: `app.theinfected.game`.
- Minimum Android: API 28 / Android 9.
- Compile and target Android API: 36.
- API 36 targeting note: this prototype targets API 36 in preparation for the Google Play target-SDK requirement expected in August 2026. It is not described here as already mandatory.
- Java: OpenJDK 17.
- Android SDK Platform: 36.
- Android Build Tools: `36.0.0`.
- Android Platform Tools: `36.0.2`.
- Android NDK: `28.1.13356709` / r28b.
- CMake: `3.10.2.4988404`.
- ABI policy: `arm64-v8a` only; older 32-bit devices are intentionally excluded until package-size and compatibility requirements are reviewed.
- Signing: development-signed debug export using a dedicated encrypted GitHub Actions keystore; the decoded keystore exists only in the temporary runner workspace and is deleted during cleanup. No signing keys or release credentials are stored in Git, and no production signing key is configured.

## Renderer compatibility gate

Mobile is the primary path. The prototype must not assume that every Android 9/API 28 device has reliable Vulkan support.

1. Export and install the Mobile renderer build on the agreed physical low-tier API 28 device.
2. Record whether the app boots, the active renderer, frame time, memory, and visual correctness.
3. If the device cannot boot/render reliably or misses the low-tier budget, export a separate Compatibility/OpenGL build and repeat the same test.
4. Accept the renderer only after the actual low-tier device result is reviewed. This decision is separate from the Godot engine decision.

The project configuration keeps Mobile as the primary path. A Compatibility export must be an explicit reviewed variant, not an automatic silent fallback.

## Test matrix and budgets

| Tier | Device target | Required result |
|---|---|---|
| Low | Physical Android 9/API 28 Vulkan device, 2–4 GB RAM, 720p | Sustained 30 FPS, frame budget 33.3 ms, PSS at or below 1 GB, cold start at or below 8 seconds |
| Baseline | Pixel 6a, Android 14/API 34 | Sustained 60 FPS, frame budget 16.7 ms, cold start at or below 5 seconds |
| Current | Pixel 8, Android 16/API 36 | Sustained 60 FPS, no sustained jank, cold start at or below 5 seconds |
| OEM check | Samsung Galaxy A54 5G, Android 15/API 35 | Boot, touch input, save/load, renderer and damage smoke tests |

Package budgets are 150 MB maximum for the debug APK and 100 MB maximum for the prototype release package. These are prototype budgets, not final game budgets.

## Complete milestone

The prototype must demonstrate all of the following:

1. Boot the application.
2. Load versioned shared game data.
3. Load one review-only canonical environment slot.
4. Load one review-only player slot.
5. Support touch movement and camera control.
6. Spawn one infected slot.
7. Demonstrate health and damage.
8. Demonstrate combat and health damage against the one infected slot.
9. Show basic inventory pickup state in the HUD and use a medkit during damage recovery.
10. Read and write a versioned local save schema containing health, position, inventory, and threat state.
11. Produce an installable debug APK.
12. Repeat the export in CI and publish a SHA-256 artifact hash.

Final weapons, economy, progression, large enemy rosters, multiplayer, purchases, production signing, and live services are explicitly out of scope. The vertical slice uses one review-only combat interaction and a minimal inventory state only to prove the loop.

## Repeatable CI export

The Android prototype workflow pins the Godot release, export template version, Java version, Android SDK Platform, Build Tools, Platform Tools, NDK, and CMake versions. It will:

1. Install Node and verify the shared-data bridge.
2. Install OpenJDK 17 and the pinned Android toolchain.
3. Download Godot `4.7.1-stable` and its matching export templates.
4. Run a headless project import check.
5. Export the `Android Debug` preset to an APK.
6. Inspect the generated APK manifest and fail unless the package ID, minSdk 28, and targetSdk 36 are present.
7. Calculate and upload the APK SHA-256 file.

The workflow never signs a release, stores a credential, enables a paid API, or promotes an asset to canonical status.
