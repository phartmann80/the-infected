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

The scene uses review-only primitives and proves the first small gameplay loop: reach the signal beacon, survive one infected encounter, neutralize the threat, and replay the route. It includes a checkpoint and signal landmark, an abandoned vehicle, movement, smoothed camera follow, one survivor, one infected, readable prototype combat feedback with melee recoil and a sidearm/ammo loop, live objective-distance guidance, pickup/use inventory, explicit SAVE/LOAD controls, a versioned local save, and a responsive touch HUD with health bars. It does not contain production characters, final weapons, economy, progression, paid content, multiplayer, or release signing.

## Prototype controls

- Desktop: `WASD` or arrow keys to move, mouse-left or `Space` to attack, `E` or mouse-right to fire the sidearm, `H` to use a medkit, `F5` to save, `F9` to load, `R` to reset the run, `P` or `Escape` to pause, and camera buttons for rotation.
- Android: use the on-screen movement, camera, `MEDKIT`, `ATTACK`, `FIRE`, `SAVE`, `LOAD`, `RESET RUN`, and `PAUSE` controls. `FIRE` spends ammunition and uses the review-only sidearm; the pause panel freezes the encounter and offers `RESUME`; a depleted health bar opens a `RUN LOST` panel with `RETRY ROUTE` and `LOAD CHECKPOINT`.
- Walk into the marked review-only pickups to add scrap or ammunition to the inventory.
- Reach the signal beacon, defeat the infected, and use `R` or `RESET RUN` to replay the route after completion.
- The save file records health, position, camera yaw, inventory, infected health and position, collected pickups, beacon progress, and completion state. A defeat state is intentionally not persisted, so `LOAD CHECKPOINT` returns to the last valid save. Save schema 3 accepts schema 1 and 2 saves; older files default fields introduced by later schemas.

## Renderer compatibility gate

Mobile/Vulkan is the primary path, but Android 9/API 28 is not assumed to have reliable Vulkan support. The first physical low-tier device test must record the active renderer and frame-time result. If the device fails to boot, render, or meet the prototype budget, create and test a Compatibility/OpenGL export before choosing the final renderer. The renderer decision is not final until that device test is accepted.
