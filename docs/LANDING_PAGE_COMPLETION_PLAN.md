# Landing Page Completion Plan

Status: Active Phase 2 product-development plan

Snapshot date: 2026-07-17

The landing page is being developed as a cinematic product surface, not a generic feature grid. The current work is distributed across focused Draft PRs and must not be described as merged, public, canonical, or final until the relevant review gates pass.

## Current implementation slice

The current Draft PR chain includes:

- cinematic hero behavior with reduced motion, audio opt-in, mobile and low-bandwidth fallbacks, and internal-review hero media;
- story and outbreak/world chapters with the Environment 001 internal-review candidate;
- separate Survivor and Infected chapters, with one Survivor candidate and one Infected placeholder governed by registry state;
- prototype-labelled arsenal, levels, mission, progression, loot, and currency surfaces;
- responsive chapter navigation, legal/contact routes, production-style footer links, and accessible page landmarks;
- Early Access form wiring with an explicit closed state and no submission or storage in the current preview.

This is visible progress, but it is not the final landing page. No final asset, economy value, support address, legal policy, or release date is implied.

## Phase 1: Creative hero gate

1. Review one exceptional hero composition against the creative direction and mobile crop requirements.
2. Review Environment 001 and Survivor 001 as shared web/Android visual references.
3. Approve provenance, usage, crop, poster, video, audio, and canonical status before promotion.
4. Do not generate a broad character, enemy, or environment roster before this gate.

## Phase 2: Cinematic chapter structure

The page should guide a visitor through:

- Arrival: hero and the first unanswered question.
- The Outbreak: environmental traces and the remaining signal.
- Survivor: one grounded human presentation, governed by registry state.
- The Infected: one readable threat presentation, with no implied roster.
- Arsenal: scarce, practical equipment.
- Mission: the first playable route and gameplay loop.
- Progression: carry, adapt, and salvage decisions.
- Loot: prototype salvage and currency shape without invented final values.
- Join the Survivors: Early Access after the world has earned attention.

## Phase 3: Game-information completion

Complete each surface with approved data or clearly labelled prototype copy:

- story and world premise;
- levels and environments;
- weapons and equipment;
- Survivor and Infected presentation;
- progression, loot, and currency;
- screenshots and gameplay media when stable, approved assets are available.

No final names, factions, enemy roster, economy values, or lore should be invented before the related approval gate.

## Phase 4: Early Access and legal release gate

- Review the signup contract, consent language, retention period, deletion process, and private data-request channel.
- Keep the UI and route closed until the reviewed backend and privacy handling are ready.
- Publish final Privacy, Terms, Cookies, and Contact content only after project ownership and support details are confirmed.
- Enable persistence only in the reviewed server environment, never in a feature branch or public preview by accident.

## Phase 5: Responsive, accessibility, and performance completion

- Test keyboard navigation, focus return, Escape handling, screen-reader names, contrast, and reduced motion.
- Verify poster-only mobile behavior, lazy media loading, pause-on-hidden behavior, and audio opt-in.
- Measure representative mobile performance before calling the page complete.
- Validate links, media fallbacks, legal routes, form states, and production-build behavior.

### Performance targets

These are review targets, not current results:

- LCP at or below 2.5 seconds on a representative mid-range mobile device.
- Initial JavaScript at or below 220 KB compressed before hero media.
- Hero poster at or below 350 KB; video and audio remain opt-in after first paint.
- Interaction readiness at or below 3.5 seconds on a throttled mobile connection.

## Phase 6: SEO and release review

- Replace temporary social imagery with an approved Open Graph and Twitter crop.
- Validate title, description, canonical URL, robots, sitemap, structured metadata, and share previews.
- Require a private production preview and explicit creative review before merging the completed landing slice.
- Record the final asset registry state and review evidence in the project notes.

## Current blockers

- Creative approval for the hero and candidate production assets.
- Physical Android-device validation remains the highest technical gate for the gameplay slice.
- Early Access privacy, retention, contact, and deployment review.

Until those gates move, continue with focused player-visible polish and prototype-labelled content. Do not expand the Android gameplay scope or create a broad asset roster.
