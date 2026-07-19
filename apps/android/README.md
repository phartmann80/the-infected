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
2. Run `npm run android:data:check` to verify the foundation, item, and scene-audio catalogs are synchronized from `packages/game-data`.
3. Open `apps/android/project.godot` in Godot 4.7.1.
4. Run the `AndroidPrototype` scene on desktop for the input and save-schema smoke test.

The scene uses review-only primitives and proves the first small gameplay loop: reach the signal beacon, survive one infected encounter, neutralize the threat, collect its salvage, and replay the route. It includes a checkpoint and signal landmark, an abandoned vehicle, movement, smoothed camera follow, one survivor, one infected with readable encounter states, weapon switching, magazine and reserve ammunition, timed reload, catalog-backed prototype damage/range/cadence, live objective-distance guidance, pickup/use inventory, explicit SAVE/LOAD controls, a versioned local save, and a responsive touch HUD with health bars.

The inventory screen reads the approved prototype catalog without mutating it. It exposes the existing 10 weapon and 20 gear concepts and stores one local weapon selection and one local gear selection. The equipped weapon updates a lightweight review-only primitive carried by the player, using catalog sub-category and rarity metadata; it is not a production model. The weapon interaction layer consumes bounded damage, range, cadence, magazine, ammunition, and reload values from the selected concept without writing back to the catalog. This remains an interaction and persistence test: every concept is non-canonical and local selection does not establish ownership or unlock state. No production models, animations, audio files, economy, paid content, multiplayer, or release signing are included.

Weapon feedback is intentionally mobile-light: a brief emissive muzzle flash, procedural placeholder fire/reload cues keyed by the catalog audio IDs, a small recoil/camera impulse, one short-lived shell primitive, infected hit flash/knockback, and a simple death fall. These effects prove readability without claiming final animation, audio, balance, aiming, or asset quality.

The combat-polish layer blends recoil, reload, equip, movement sway, and melee swing offsets every frame instead of stacking one-off tweens. Melee damage resolves at the visible impact point, near-ready fire input has a bounded 120 ms buffer, and generated weapon/impact cues use separate channels. HIT, BREAK, and DOWN markers, a brief player-damage overlay, a wind-up countdown, and a low-cost ground telegraph clarify each exchange without adding permanent effects or production media.

The infected behavior is a deterministic prototype state machine. The threat remains dormant outside proximity until the objective activates, pauses in a visible alert state, pursues with bounded lateral steering and distance-based speed, faces the survivor, telegraphs each attack, recovers after a strike, and allows weapon hits to interrupt wind-up. State color and simple pose changes keep the encounter readable without navigation meshes, additional enemies, expensive pathfinding, or final animation assets.

Player movement uses short acceleration/deceleration ramps, frame-rate-independent turning, camera look-ahead, and frame-rate-independent camera smoothing. These values are prototype tuning and still require physical-device touch and frame-time review.

The landscape touch layer uses a fixed analog movement pad with a remapped dead zone and a separate horizontal drag-to-turn surface. Two pointers can own movement and look independently; release, pause, inventory, restart, load, and application focus loss clear transient input so controls cannot remain stuck. Touch-to-mouse emulation is disabled so movement cannot also trigger a desktop melee action. The player HUD prioritizes objective, survivor health, threat state, loadout, and ammunition, while every button retains at least a 48-pixel prototype touch target. Physical-device ergonomics, safe-area behavior, haptics, and final accessibility sizing remain unvalidated.

Action-button feedback uses the equipped prototype item's existing `audio.select` reference and a short generated placeholder cue. It does not add or approve production audio.

The character-presentation layer now replaces single capsule visuals with seven-part articulated primitive rigs for the survivor and infected. A deterministic animation driver produces locomotion, opposite-leg gait, torso counter-motion, survivor melee/reload/fire poses, and infected dormant/alert/pursuit/wind-up/recovery/stagger poses. Gait phase emits synchronized footstep events into a dedicated generated foley channel so production skeletal clips and surface-aware sound assets can later replace the placeholders without changing combat timing. These rigs and tones are review-only runtime hooks, not final characters, motion capture, voice, or audio.

Scene audio now resolves concrete, checkpoint-plate, and roadside-gravel zones through shared data, varies each left/right gait event deterministically, and positions infected footsteps in 3D. A continuously fed ambience bed crossfades between route, engaged-threat, and secured states, ducks smoothly under active narration, and keeps synthesis work frame-bounded, while the signal beacon emits a directional locator pulse. Externalized narration events drive a priority queue, readable subtitles, and stable voice cue IDs; the generated radio chirp is only a timing placeholder so a future local Voicebox render can replace it without coupling gameplay to a provider or API. Dialogue, recordings, final mix, and canonical scene writing remain unapproved.

## Prototype controls

- Desktop: `WASD` or arrow keys to move, `I` to open the prototype inventory, `Q` to switch between melee and the equipped firearm, mouse-left or `Space` to attack, `E` or mouse-right to fire, `F` to reload, `H` to use a medkit, `F5` to save, `F9` to load, `R` to reset the run, and `P` or `Escape` to pause.
- Android: use the bottom-left analog movement pad, horizontal drag-to-turn surface, and `INVENTORY`, `MEDKIT`, `SWITCH`, `RELOAD`, `ATTACK`, `FIRE`, `SAVE`, `LOAD`, `RESET RUN`, and `PAUSE` controls. The inventory panel pauses gameplay logic while open and supports touch selection and local equip. The HUD shows the active objective, survivor health, threat state, loadout, weapon mode, magazine, reserve, ammunition type, and reload status; the pause panel freezes the encounter and offers `RESUME`; a depleted health bar opens a `RUN LOST` panel with `RETRY ROUTE` and `LOAD CHECKPOINT`.
- Walk into the marked review-only pickups to add scrap or ammunition to the inventory.
- Reach the signal beacon, defeat the infected, and use `R` or `RESET RUN` to replay the route after completion.
- The save file records health, position, camera yaw, pickup inventory, local prototype loadout IDs, local weapon mode/ammunition, infected health and position, collected pickups, beacon progress, and completion state. A defeat state is intentionally not persisted, so `LOAD CHECKPOINT` returns to the last valid save. Save schema 6 accepts schemas 1 through 6; older files default fields introduced by later schemas.

## Renderer compatibility gate

Mobile/Vulkan is the primary path, but Android 9/API 28 is not assumed to have reliable Vulkan support. The first physical low-tier device test must record the active renderer and frame-time result. If the device fails to boot, render, or meet the prototype budget, create and test a Compatibility/OpenGL export before choosing the final renderer. The renderer decision is not final until that device test is accepted.
