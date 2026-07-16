# Landing Page Completion Plan

Status: Planned work after the production-readiness foundation PR.

Current implementation slice: `feat/early-access-registration-v1` adds the feature-flagged Early Access contract, Node route, privacy-safe storage boundary, consent form wiring, and the cinematic chapter rhythm from `feat/landing-page-production-v1`. It does not add a production hero candidate, a broad roster, or enable public registration.

The landing page should grow from the approved cinematic direction, not become a generic feature grid. The next visual gate is one approved production hero composition. No large character or enemy roster should be generated before that gate.

## Phase 1: Hero production candidate

1. Approve the creative brief and shot list for one hero composition.
2. Produce final-candidate key art, poster, and cinematic loop variants from approved or explicitly internal-review assets.
3. Preserve the existing reduced-motion, mobile fallback, audio opt-in, narration caption, WebGL boundary, and temporary-asset lifecycle.
4. Review browser captures at desktop and mobile widths, with sound muted, sound enabled, and reduced motion enabled.
5. Record provenance and review results before any asset becomes approved or canonical.

## Phase 2: Cinematic chapter structure

Build the page as a descent through the city, following `docs/CHAPTER_STRUCTURE.md`:

- Arrival: hero and the first unanswered question.
- The Outbreak: environmental traces, not a lore dump.
- Survivors: human stakes and the first approved survivor presentation.
- The Infected: threat language and the first approved infected presentation.
- Arsenal: scarce, practical equipment and weapons.
- The Mission: the survival objective and why the player keeps moving.
- Join the Survivors: early-access conversion after the world has earned attention.

### Product slice v1 review

- Story and world sections now carry the visitor from the first silence to the remaining signal.
- Survivor and infected presentation slots remain registry-governed and visibly marked as placeholders until approved assets exist.
- Arsenal, levels, progression, and loot are present as prototype-labelled systems rather than invented final canon.
- Early Access persistence and consent handling are implemented behind `EARLY_ACCESS_ENABLED=false`; retention, private data requests, and deployment enablement remain review gates.
- Cookies and Contact routes are present as prototype legal surfaces; ownership and support details require final project review before public launch.

## Phase 3: Game-information surfaces

Add restrained, source-grounded sections for:

- Story and world premise.
- Levels and environmental progression.
- Weapons and equipment.
- Character presentation.
- Enemy presentation.
- Progression, loot, and currency.

Each surface must use approved game data or clearly marked prototype copy. No final names, factions, enemy roster, economy values, or lore should be invented in the landing page before the related approval gate.

## Phase 4: Early access and legal surface

- Define the signup contract, consent language, retention policy, and failure states.
- Connect the form to an approved backend only after the contract and privacy handling are reviewed.
- Add Terms, Privacy, Cookies, and Contact pages with real project ownership and support details.
- Add a footer that links to the legal pages and clearly separates prototype status from release availability.

## Phase 5: Responsive, accessibility, and performance completion

- Test keyboard navigation, focus return, Escape handling, screen-reader names, contrast, and reduced motion.
- Verify poster-only mobile behavior, lazy media loading, pause-on-hidden behavior, and audio opt-in.
- Define budgets before final media lands: initial HTML/JS, hero poster, video bytes, audio bytes, Largest Contentful Paint, and interaction readiness on a representative mobile device.
- Add image dimensions, responsive crops, WebM/MP4 strategy, cache headers, and a CDN decision when bandwidth evidence justifies it.

### v1 performance gate

- LCP: at or below 2.5 seconds on a representative mid-range mobile device.
- Initial JavaScript: at or below 220 KB compressed before hero media.
- Hero poster: at or below 350 KB; video and audio remain opt-in after first paint.
- Interaction readiness: at or below 3.5 seconds on a throttled mobile connection.
- These are review targets, not measured results. The production hero candidate must be measured against them before approval.

## Phase 6: SEO and release review

- Replace temporary social imagery with approved Open Graph and Twitter crops.
- Validate title, description, canonical URL, robots, sitemap, structured metadata, and share previews.
- Run accessibility, performance, responsive, media, and link checks against the production build.
- Require a Vercel preview or private server preview and explicit creative review before merging the completed landing-page slice.
