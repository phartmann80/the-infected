# The Infected Android Prototype

This is the Godot 4.7.1 evaluation prototype. It is not a production game project and it is not a final engine commitment.

## Pinned foundation

- Godot `4.7.1-stable`, standard build
- GDScript
- Mobile renderer as the primary export path
- Package ID `app.theinfected.game`
- Minimum Android API 28; target and compile API 36
- OpenJDK 17, NDK `28.1.13356709`, CMake `3.10.2.4988404`

## Run locally

1. Run `npm ci` at the repository root.
2. Run `npm run android:data:check`.
3. Open `apps/android/project.godot` in Godot 4.7.1.
4. Run the `AndroidPrototype` scene on desktop for the input and save-schema smoke test.

The scene uses review-only primitives. It does not contain production characters, weapons, inventory, economy, progression, paid content, multiplayer, or release signing.

## Renderer compatibility gate

Mobile/Vulkan is the primary path, but Android 9/API 28 is not assumed to have reliable Vulkan support. The first physical low-tier device test must record the active renderer and frame-time result. If the device fails to boot, render, or meet the prototype budget, create and test a Compatibility/OpenGL export before choosing the final renderer. The renderer decision is not final until that device test is accepted.
