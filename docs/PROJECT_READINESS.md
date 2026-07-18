# Project Readiness

Snapshot date: 2026-07-17

This is a status record for the Phase 2 product-development draft chain. It is not a release claim. Every item is labelled so a feature on a Draft PR is not mistaken for a merged or approved product capability.

## Completed

- `phartmann80/the-infected` remains the authoritative repository.
- The accepted infrastructure foundation provides GitHub CI, protected-main workflow, immutable server releases, systemd service control, and private preview deployment. This Phase 2 slice does not change that foundation.
- The web foundation has reduced-motion handling, WebGL failure boundaries, visibility pausing, audio opt-in, temporary-media handling, SEO metadata, robots, sitemap, and a small no-store `/api/health` response.
- The current landing-page draft chain contains cinematic hero, story, outbreak/world, Survivor, Infected, arsenal, levels, mission, progression, loot/currency, legal, contact, footer, and Early Access surfaces.
- Draft PR #37 separates Survivor and Infected into distinct registry-governed chapters without creating a roster.
- Draft PR #38 gives Privacy, Terms, Cookies, and Contact a shared responsive and accessible page shell.
- Draft PR #39 makes the closed Early Access state explicit and non-submitting.
- Draft PR #40 exposes loot and currency as prototype-labelled information without final economy values.
- Draft PR #42 adds one Infected 001 internal-review candidate with registry provenance and no roster expansion.

## Prototype

- The landing page is a substantially expanded cinematic product prototype, not a final release landing page.
- The hero still uses temporary video, poster, ambience, and narration. The hero composition remains internal review and non-canonical.
- Environment 001 and Survivor 001 are internal-review candidates. They are shared visual references, not approved canonical assets.
- Infected 001 is one registry-governed internal-review candidate. No additional enemy roster is implied.
- Arsenal, levels, progression, loot, and currency copy are prototype data. Names, values, drop tables, vendors, and reward balance are not final.
- Early Access has a feature-flagged Node route and privacy-safe storage boundary, but the UI and route remain closed with `EARLY_ACCESS_ENABLED=false`.
- The Android branch history contains the Godot prototype and CI export work, but physical-device installation and gameplay evidence are still unverified. The working tree's `apps/android` directory remains a README placeholder until the reviewed Android changes are merged.

## Placeholder

- Final hero composition, poster, cinematic loop, production audio, Environment 001, Survivor 001, and Infected 001 are not approved or canonical.
- The public support channel, legal ownership details, retention period, deletion process, and private data-request channel are not finalized.
- Production economy values, item names, enemy names, factions, and final lore are intentionally not established by the landing page.

## Blocked

- Creative approval of one production hero composition and the internal-review Environment 001, Survivor 001, and Infected 001 candidates.
- Physical Android-device validation: installation, launch, touch, movement, combat, loot, save/load, FPS, memory, and screenshots remain missing.
- Early Access production enablement is blocked on final privacy, retention, deletion, contact, and deployment review.
- Public exposure, DNS, SSL, ports 80/443, Vercel migration, and firewall changes remain outside the current scope.

## Not started

- Canonical production media promotion.
- Public Early Access registration and its reviewed operational support process.
- Final accessibility and performance sign-off against measured representative-device budgets.
- The complete Android device-tested vertical-slice gate and final engine approval.
- Identity, player profiles, cloud saves, analytics, version checks, and other online backend implementation.

## Current gates

### Creative gate

Approve one production hero composition and decide whether Environment 001 and Survivor 001 become canonical. Do not generate a broad character or enemy roster first.

### Android device gate

Install the CI-generated debug APK on a physical Android device and record launch, touch, movement, combat, loot, save/load, startup, memory, FPS, worst frame time, and screenshots. Do not expand gameplay scope before this evidence exists.

### Early Access gate

Review privacy and contact handling, then exercise the disabled, validation, rate-limit, storage-failure, and success paths against the production build before enabling persistence.

## Evidence boundary

The current Phase 2 feature work is organized as focused Draft PRs. Green CI on a Draft PR validates that branch only; it does not mean the change is merged into protected `main`, deployed publicly, or creatively approved. Local smoke tests prove the local production build only.
