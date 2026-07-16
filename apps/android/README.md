# The Infected Android Prototype

This is the Godot 4.7.1 evaluation prototype. It is not a production game project and it is not a final engine commitment.

## Pinned foundation

- Godot `4.7.1-stable`, standard build
- GDScript
- Mobile renderer as the primary export path
- Package ID `app.theinfected.game`
- Minimum Android API 28; target and compile API 36. API 36 is being targeted in preparation for the Google Play target-SDK requirement expected in August 2026; this requirement is not treated as already mandatory.
- Export configuration explicitly sets Gradle minSdk 28 and targetSdk 36.
- ABI policy: arm64-v8a only. Older 32-bit devices are intentionally excluded from this prototype until package-size and compatibility requirements are reviewed.
- OpenJDK 17, NDK `28.1.13356709`, CMake `3.10.2.4988404`
- CI development exports use a dedicated encrypted GitHub Actions keystore. The decoded keystore exists only in the temporary runner workspace and is deleted during cleanup. No production signing credential is configured.

## Run locally

1. Run `npm ci` at the repository root.
2. Run `npm run android:data:check`.
3. Open `apps/android/project.godot` in Godot 4.7.1.
4. Run the `AndroidPrototype` scene on desktop for the input and save-schema smoke test.

The scene uses review-only primitives and proves the first small gameplay loop: movement, camera follow, one survivor, one infected, basic combat and damage, pickup inventory, a versioned local save, and a HUD. It does not contain production characters, final weapons, economy, progression, paid content, multiplayer, or release signing.

## Prototype controls

- Desktop: `WASD` or arrow keys to move, mouse-left or `Space` to attack, camera buttons for rotation.
- Android: use the on-screen movement, camera, and `ATTACK` controls.
- Walk into the marked review-only pickups to add scrap or ammunition to the inventory.
- The save file records health, position, inventory, infected health, and defeated state.

## Renderer compatibility gate

Mobile/Vulkan is the primary path, but Android 9/API 28 is not assumed to have reliable Vulkan support. The first physical low-tier device test must record the active renderer and frame-time result. If the device fails to boot, render, or meet the prototype budget, create and test a Compatibility/OpenGL export before choosing the final renderer. The renderer decision is not final until that device test is accepted.
