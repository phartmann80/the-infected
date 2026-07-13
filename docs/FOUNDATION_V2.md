# Foundation v2 Architecture

Foundation v2 is the architectural source of truth for The Infected until superseded by an approved ADR.

## Rules

1. Game-first monorepo: landing page, Android app, packages, AI pipeline, marketing, and assets live together.
2. Canonical game data lives in `packages/game-data` and is consumed by web now and Android later.
3. Canonical asset metadata lives in `assets/registry.json`; sound metadata lives in `assets/sound-registry.json`.
4. No fictional permanent characters, enemies, weapons, story content, or permanent 3D assets are created before Lore Bible, Timeline, and Art Direction approval.
5. Technical placeholders must be labelled as placeholders and must not become canonical game IP.
6. Secrets stay out of git.
