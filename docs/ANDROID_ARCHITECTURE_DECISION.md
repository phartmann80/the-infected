# Android Architecture Decision

Status: Proposed; review required before creating `apps/android`.

## Repository finding

There is no existing Android engine project to preserve. The repository currently contains a game-first monorepo, shared TypeScript packages, canonical asset registries, and an Android technical-prototype brief. The intended reusable boundary is therefore data and asset metadata, not an existing engine integration.

## Options

| Option | Android performance | 3D and cinematic support | APK/AAB and automation | Asset reuse | Developer availability | Licensing | Shared data and maintenance |
|---|---|---|---|---|---|---|---|
| Unity 6 | Strong mobile tooling, profiling, batching, and mature device support; still requires disciplined budgets. | Strongest overall toolchain for camera work, animation, lighting, particles, profiling, and cinematic iteration. | Mature Android/Gradle pipeline and command-line build options; CI requires licensed editor activation and careful version pinning. | Broadest marketplace and DCC import ecosystem; canonical registry IDs can map to Unity assets. | Largest hiring and community pool. | Unity Personal is free below its current revenue/funding eligibility threshold; paid plans and current terms must be reviewed as the project grows. | High long-term capability, but editor size, licensing, serialized scenes, and CI activation add operational weight. |
| Godot 4.x | Good for a controlled Android scope and open pipeline; performance must be proven with the target scene and device matrix. | Capable 3D renderer, animation, particles, and camera systems; less mature high-end cinematic tooling and asset ecosystem than Unity. | Can export APK and, with Gradle builds, AAB; headless/command-line workflows are straightforward once templates and SDKs are pinned. | Imports common 3D formats and can consume JSON/texture/audio assets; registry IDs should remain engine-neutral. | Smaller but active community; fewer specialized Android/AAA hiring options. | MIT-licensed engine with no engine royalty; third-party asset licenses remain separate. | Lowest lock-in and simplest cost model for this repository, but the prototype must prove visual and performance requirements before content scales. |
| Existing intended architecture | No game runtime or Android performance exists to measure. | The web React Three Fiber scene is a visual prototype, not a mobile game engine foundation. | No APK/AAB or Android build pipeline exists. | Shared packages and registries are reusable, but not directly a game runtime. | Existing TypeScript familiarity helps the data layer only. | Existing repository policies apply; no engine license decision exists. | Preserve this as the data/asset contract layer and avoid treating it as an engine choice. |

## Recommendation

Recommend a Godot 4.x technical prototype, subject to the prototype gate.

The recommendation is based on the current project constraints: no existing engine investment, no existing Android project, a need for a low-cost repeatable build, and a requirement to keep the canonical asset/data layer independent of the runtime. Godot is MIT-licensed, can export Android builds, and supports Gradle-based AAB workflows. Unity remains the fallback if the prototype fails the target visual quality, frame-time, tooling, or hiring requirements.

This is not approval to start content-heavy production. First pin an approved Godot 4.x version, Android SDK/JDK/NDK versions, renderer choice, device matrix, and build image.

Primary references:

- [Godot license](https://godotengine.org/license/)
- [Godot Android export](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_android.html)
- [Godot Gradle Android builds](https://docs.godotengine.org/en/stable/tutorials/export/android_gradle_build.html)
- [Unity Personal](https://unity.com/products/unity-personal)
- [Unity 6 system requirements](https://docs.unity3d.com/6000.0/Documentation/Manual/system-requirements.html)

## Data and asset boundary

- `packages/game-data` remains the canonical source for engine-neutral game data.
- Add a versioned JSON export consumed by the engine; do not make Godot scenes the source of truth for shared content.
- Preserve asset IDs, registry entries, provenance, approval state, hashes, and Android reuse flags.
- Keep web-only media and engine-specific imports as delivery derivatives.
- Keep signing keys, passwords, and release credentials outside Git and CI logs.

## First technical prototype milestone

The first approved prototype must demonstrate all of the following in one small, measurable scene:

1. Boot application with a stable package/application ID.
2. Load versioned shared game data from the repository export.
3. Load one approved or explicitly internal-review Environment 001 asset.
4. Load one player character placeholder or approved survivor asset.
5. Provide basic touch movement and camera control.
6. Spawn one infected placeholder or approved infected asset.
7. Demonstrate basic health and damage with a visible state change.
8. Write and read a versioned local save schema with one migration test.
9. Produce a debug APK from a clean machine or pinned CI image.
10. Repeat the debug build in CI and record the artifact hash.

Prototype exit criteria:

- No signing secrets are committed.
- The debug APK installs and boots on the agreed device matrix.
- Frame-time, memory, package size, and load-time budgets are recorded.
- Shared data and registry IDs are proven reusable by the web and engine paths.
- The team explicitly approves or rejects the engine before weapons, progression, economy, or roster production begins.
