# Android App

Reserved for the future Android APK. Do not implement the full game until the Android technical prototype milestone is approved.

## Shared game data

The engine-neutral prototype contract is committed at:

```text
packages/game-data/generated/game-data.v1.json
```

It is generated from `@the-infected/game-data`, contains no React, Tailwind, or browser-only values, and remains explicitly non-canonical. A future Godot import step should copy this file into the project without making the engine copy the source of truth.

```bash
npm run game-data:export
npm run validate:game-data
```

Change `schemaVersion` only when the runtime contract becomes incompatible. Change `contentVersion` when the content snapshot changes without breaking the contract.
