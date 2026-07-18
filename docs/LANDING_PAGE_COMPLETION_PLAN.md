# Landing Page Completion Plan

Status: Active Phase 2 product work.

The landing page is a cinematic product surface, not a generic feature grid. The current Draft PR chain has delivered the chapter structure, accessibility foundation, one Environment 001 candidate and one Survivor 001 candidate. Those assets remain internal review and must not be described as final or canonical.

## Current implementation state

- Hero: cinematic composition, temporary media fallback, audio opt-in, narration caption, reduced-motion behavior, WebGL boundary, and an internal-review hero key-art candidate.
- Story and outbreak: implemented as the first two cinematic chapters.
- Environment 001: revised internal-review candidate with subtle failed-evacuation and military-collapse evidence; registry version `0.1.1`.
- Survivor 001: one internal-review candidate shown in the registry-governed survivor card; no final name or backstory.
- Infected 001: placeholder only; no broad roster has been generated.
- Arsenal, levels, mission, progression, loot, and currency: present as clearly labelled prototype information.
- Early Access: consent form, validation, rate limiting, privacy-safe storage contract, and Node route exist behind `EARLY_ACCESS_ENABLED=false`; public registration is not enabled.
- Legal and contact: structural Privacy, Terms, Cookies, Contact, navigation, and footer routes exist; final ownership and data-request language remain open.

## Phase 1: Hero production candidate

1. Review the hero brief and shot list.
2. Review the current hero key-art candidate at desktop and mobile widths.
3. Produce final poster, video, and audio variants only after the composition is approved.
4. Test muted, sound-enabled, reduced-motion, mobile, and low-bandwidth states.
5. Record provider, model identifier when available, prompt provenance, hash, dimensions, and approval before any asset becomes canonical.

## Phase 2: Cinematic chapter structure

The current structure follows `docs/CHAPTER_STRUCTURE.md`:

- Arrival: hero and the first unanswered question.
- The Outbreak: environmental traces, not a lore dump.
- Survivors: one human presentation candidate, governed by registry status.
- The Infected: threat language and a placeholder until an approved candidate exists.
- Arsenal: scarce, practical equipment and prototype weapons.
- The Mission: objective, levels, and why the player keeps moving.
- Join the Survivors: Early Access conversion after the world has earned attention.

The remaining work is creative review and replacement of prototype media or copy with approved production assets and data. The chapter structure itself is implemented.

## Phase 3: Game-information surfaces

The structural surfaces are present. Before public release:

- replace prototype copy with approved story, level, weapon, progression, loot, and currency data;
- promote only approved Survivor, Infected, Environment, and hero assets;
- add screenshots or gameplay media only when they are real, reviewed, and provenance-recorded;
- keep final names, factions, economy values, and enemy roster out of the page until their approval gates pass.

## Phase 4: Early Access and legal surface

- Review the signup contract, consent language, retention period, deletion process, and private data-request channel.
- Confirm final Privacy, Terms, Cookies, and Contact language.
- Exercise success, invalid input, disabled, rate-limited, and storage-failure paths against the production build.
- Enable `EARLY_ACCESS_ENABLED=true` only in the reviewed server environment after approval.

## Phase 5: Responsive, accessibility, and performance completion

Implemented foundation:

- page-level and hero landmarks with labelled chapter regions;
- skip-link and focus behavior;
- reduced-motion and low-bandwidth media handling;
- mobile chapter navigation and responsive Survivor 001 framing;
- audio opt-in with narration captions.

Remaining evidence:

- keyboard and screen-reader review across the complete page;
- contrast and touch-target review at desktop, tablet, and mobile widths;
- measured LCP, initial JavaScript, interaction readiness, and media bytes on a representative mobile device;
- link, image, responsive, and production-build checks after final assets land.

## Phase 6: SEO and release review

- Replace temporary social imagery with an approved Open Graph and Twitter crop.
- Validate title, description, canonical URL, robots, sitemap, and structured metadata.
- Require a private preview, final creative review, successful CI, and explicit approval before merging the completed landing surface.

## Performance targets

- LCP: at or below 2.5 seconds on a representative mid-range mobile device.
- Initial JavaScript: at or below 220 KB compressed before hero media.
- Hero poster: at or below 350 KB; video and audio remain opt-in after first paint.
- Interaction readiness: at or below 3.5 seconds on a throttled mobile connection.

These are review targets, not measured results. No target is considered passed until captured against the production build.

## Current gates

1. Physical Android device validation is the highest priority for the vertical slice.
2. Creative approval is required before the hero, Environment 001, or Survivor 001 becomes canonical.
3. Public Early Access enablement requires backend, privacy, retention, deletion, and contact approval.
4. No broad character or enemy roster should be generated before these gates are reviewed.
