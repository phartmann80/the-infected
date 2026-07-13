# The Infected

Foundation v2 game-first monorepo for **The Infected**, a cinematic 3D zombie-survival Android game and AAA-quality landing page.

The landing page is the first production surface for the Android game. Assets, data contracts, narrative decisions, telemetry, and production rules must be reusable by the future Android APK.

## Commands

```bash
npm install
npm run validate:registry
npm run secrets:scan
npm run lint
npm run typecheck
npm run build
```

## Security

Never commit `.env.local`, signing keys, API keys, keystores, or production credentials. `.env.example` contains variable names only.
