# The Infected

Foundation v2 game-first monorepo for **The Infected**, a cinematic 3D zombie-survival Android game and AAA-quality landing page.

The landing page is the first production surface for the Android game. Assets, data contracts, narrative decisions, telemetry, and production rules must be reusable by the future Android API.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js (App Router) |
| UI | React, Tailwind CSS, Radix UI (shadcn/ui) |
| Language | TypeScript |
| 3D Assets | Meshy AI (weapon and gear renders) |
| Package manager | npm |
| Deployment | Vercel (theinfected.app) |

## Project Structure

```
the-infected/
├── apps/
│   └── web/                    # Next.js landing page application
├── public/                    # Static assets (logos, favicons, OG images, 3D renders)
├── next.config.ts             # Next.js config (theinfected.app domain)
├── vercel.json                # Build config, cache headers, www redirect
├── package.json
└── README.md
```

## Pages

| Page | Description |
|------|-------------|
| Home | Visual hub with featured cards, environment videos, screenshot strip |
| Weapons | Visual arsenal with category grouping, stat bars, melee and explosives |
| Gear | Game-style loadout interface with equipment slots |
| Combat | Visual action cards with type indicators and gameplay loop |
| Levels | Environment video loops with objective/threat/loot/hazard panels |
| Inventory | Grid inventory with health/stamina bars, item detail, save/load |
| Progression | Visual mission map with connector lines, achievements, unlocks |
| Media | Filterable gallery with category filters, trailer modal |
| Android | Phone mockup with HUD overlay, features grid, engine specs |
| Infected | Large portrait cards with stat bars, behavior tags, threat levels |
| Story | Visual timeline with environment video |

## 3D Assets

6 Meshy AI 3D assets generated:
- Warden-9 pistol
- Raven-12 shotgun
- Machete
- Frag grenade
- Field radio
- Tactical helmet

## Commands

```bash
npm install
npm run validate:registry    # Validate asset registry
npm run secrets:scan         # Scan for leaked secrets
npm run lint
npm run typecheck
npm run build
```

## Deployment

- Domain: `theinfected.app`
- Vercel config: `vercel.json` with build settings, cache headers, and www redirect
- API endpoint: `/api/version` for deployment verification
- Environment: `NEXT_PUBLIC_SITE_URL` set for theinfected.app

## Security

Never commit `.env.local`, signing keys, API keys, keystores, or production credentials. `.env.example` contains variable names only.