# Landing Page Completion Plan

Status: Planned work after the production-readiness foundation PR.

The landing page should grow from the approved cinematic direction, not become a generic feature grid. The next visual gate is one approved production hero composition. No large character or enemy roster should be generated before that gate.

## Production media controls

The current temporary media remains non-canonical. A functioning deployment is not an approval to promote it.

Before any live generation or paid request:

- approve one hero composition and its storyboard;
- confirm the exact Voicebox repository/version, license, commercial-use terms, installation and hardware requirements, consent safeguards, supported languages, export formats, inference speed, and server feasibility;
- confirm the MuAPI account, provider, model, per-request cap, total review budget, and image-to-video workflow;
- keep credentials outside Git, `.env` commits, deployment scripts, and logs;
- generate one character, voice, or shot at a time;
- record provider, model, seed, prompt, references, cost, output hash, provenance, and approval state;
- block automatic canonical promotion and batch generation without approval;
- preserve the accepted visual benchmark for comparison.

The controlled production order is one approved hero composition, one game-ready survivor, one game-ready infected, approved web derivatives, one short MuAPI hero shot, reviewed Voicebox narration, synchronized ambience/video/audio/captions, responsive optimization, registry registration, and only then roster expansion. See `docs/ANDROID_ASSET_STRATEGY.md` for the shared asset and derivative policy.

## Phase 1: Hero production candidate

1. Approve the creative brief and shot list for one hero composition.
2. Produce final-candidate key art, poster, and cinematic loop variants from approved or explicitly internal-review assets.
3. Preserve the existing reduced-motion, mobile fallback, audio opt-in, narration caption, WebGL boundary, and temporary-asset lifecycle.
4. Review browser captures at desktop and mobile widths, with sound muted, sound enabled, and reduced motion enabled.
5. Record provenance and review results before any asset becomes approved or canonical.

The first hero implementation must include the final-candidate video, poster, ambience, narration, and caption plan, but those assets remain gated until the composition and provider/cost controls are approved.

## Phase 2: Cinematic chapter structure

Build the page as a descent through the city, following `docs/CHAPTER_STRUCTURE.md`:

- Arrival: hero and the first unanswered question.
- The Outbreak: environmental traces, not a lore dump.
- Survivors: human stakes and the first approved survivor presentation.
- The Infected: threat language and the first approved infected presentation.
- Arsenal: scarce, practical equipment and weapons.
- The Mission: the survival objective and why the player keeps moving.
- Join the Survivors: early-access conversion after the world has earned attention.

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
- Produce desktop and mobile video derivatives, poster-frame extraction, captions, narration synchronization, and sound-design synchronization only from approved short shots.

## Phase 6: SEO and release review

- Replace temporary social imagery with approved Open Graph and Twitter crops.
- Validate title, description, canonical URL, robots, sitemap, structured metadata, and share previews.
- Run accessibility, performance, responsive, media, and link checks against the production build.
- Require a Vercel preview or private server preview and explicit creative review before merging the completed landing-page slice.
