# Android Technical Prototype Milestone

Before heavy content production, prove Android boot, shared-data consumption, asset loading, save-file schema versioning, telemetry abstraction, and build/signing workflow without committing signing secrets.

## Shared-data gate

The first engine-neutral export is `packages/game-data/generated/game-data.v1.json`. It is a deterministic, committed delivery artifact generated from `@the-infected/game-data`.

Before an engine project consumes it:

1. Run `npm run validate:game-data` to prove the committed JSON matches the TypeScript source.
2. Parse and reject unknown `schemaVersion` values in the Android runtime.
3. Treat `canonicalContentApproved: false` as an internal prototype signal.
4. Keep engine-specific import files derivative; changes flow from `packages/game-data`, never back from Godot resources.
5. Add a clean-machine import test when the Godot project is approved.
