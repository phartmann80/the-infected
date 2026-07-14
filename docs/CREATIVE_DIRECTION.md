# The Infected — Creative Direction

Status: North-star creative document, internal review.

This document is the creative source of truth for The Infected. Every future cinematic, key art piece, character, infected design, environment, soundscape, UI surface, store asset, and gameplay system should support this direction.

**Every new asset, cinematic, sound, environment, or gameplay mechanic must reinforce the identity of The Infected rather than simply add more content.**

## Creative Approval Process

Major creative work must be approved before generation begins. This prevents the project from producing dozens of disconnected variations before the team agrees on the vision.

Required sequence for major assets such as Survivor 001, Infected 001, Environment 001, Hero Key Art, Cinematic Intro, and production audio:

```text
Creative Brief
        ↓
Creative Review
        ↓
Approved Brief
        ↓
AI / Artist Generation
        ↓
Internal Review
        ↓
Approved
        ↓
Canonical
```

Rules:

- Do not generate production concepts until the Creative Brief has been reviewed.
- Do not mark generated work as approved until it passes Internal Review.
- Do not mark work as canonical until provenance, creative fit, Android feasibility, and registry metadata are complete.
- Record major decisions in `docs/adr/` so the team remembers why the direction was chosen.

## Gameplay Philosophy

**The Infected is a cinematic survival experience where every encounter feels dangerous and every decision matters.**

This sentence should be easy for the team to remember. If a design choice does not increase danger, consequence, atmosphere, or survival tension, it should be questioned.

## World Vision

The world of The Infected is not a generic zombie apocalypse. It is a city after the moment when systems failed but traces of humanity remain everywhere.

The world should feel:

- recently abandoned, not ancient
- urban, wounded, and unstable
- militarized but no longer controlled
- full of unanswered questions
- dangerous even when empty
- cinematic, grounded, and believable

The city is a character. It should communicate loss before the player reads a word.

Visitors should immediately wonder:

- What happened here?
- Why did everyone leave so quickly?
- Who built the barricades?
- Why is the checkpoint empty?
- What is still moving in the distance?
- Is rescue still possible?

## Emotional Goals

The first emotional reaction should be:

> I want to know what happened here.

The core emotions are:

- **Isolation** — the visitor feels alone in a hostile place.
- **Fear** — danger exists even when nothing attacks.
- **Curiosity** — every scene raises questions.
- **Mystery** — the outbreak is not fully explained upfront.
- **Survival** — every choice feels consequential.
- **Determination** — collapse exists, but surrender is not the fantasy.
- **Hope within ruin** — the game should not be hopeless; survival still means something.

## Art Direction

The visual language is cinematic survival horror with grounded Android-game practicality.

## Visual DNA

The Infected should become instantly recognizable through recurring visual motifs, not through one-off spectacle.

Recurring visual DNA:

- persistent ash in the air
- drifting smoke and ground fog
- emergency lighting in red, amber, and failing white
- orange fire against cold blue shadows
- worn military infrastructure
- abandoned civilian life
- weathered materials: rust, cracked glass, wet asphalt, dirty fabric, burnt paint
- grounded realism rather than exaggerated horror
- practical survival improvisation
- ruined checkpoints, barricades, and evacuation traces
- silhouettes partially revealed by smoke, headlights, or firelight

These are motifs, not specific assets. They should appear across hero art, environments, cinematics, UI tone, and eventually Android gameplay.

Avoid:

- cartoon zombies
- generic blood splatter aesthetics
- over-designed sci-fi armor
- clean futuristic UI
- bright arcade color palettes
- random horror imagery without story purpose
- excessive gore as a substitute for tension

Favor:

- grounded urban collapse
- practical clothing and equipment
- smoke, ash, dust, rust, wet asphalt, emergency light
- silhouettes that reveal just enough
- visual storytelling through objects
- believable survival improvisation
- atmosphere before spectacle

## Cinematic Language

Every cinematic shot must have a purpose:

- **Establish** — show scale, location, danger, or isolation.
- **Reveal** — introduce a threat, survivor, signal, or clue.
- **Build tension** — delay information; let the viewer search the frame.
- **Surprise** — use sparingly; tension is stronger than constant shock.
- **Transition** — move the viewer deeper into the world.

Avoid random camera movement. Motion should feel directed, not decorative.

## Color Palette

The color grade should feel like a wounded city at night or near dawn.

Primary palette:

- charcoal black
- near-black blue shadows
- deep dried red
- dirty orange firelight
- smoke gray
- ash beige
- muted emergency red
- small accents of cold blue/green from failing electronics

Avoid flat gradients. Color should feel motivated by physical light sources: fire, emergency lamps, overcast sky, headlights, flares, broken screens, and distant city glow.

## Lighting Style

Lighting should be practical and cinematic.

Use:

- shafts of light through smoke
- firelight flicker
- emergency warning lights
- headlights cutting through fog
- cold moon/overcast sky fill
- silhouette lighting
- partial reveals
- volumetric haze

The viewer should never feel the scene is lit like a webpage. It should feel photographed.

## Camera Language

Camera behavior should feel like a film director is controlling the visitor's attention.

Approved camera modes:

- slow push-ins
- wide establishing shots
- low street-level frames
- shoulder-level tension
- delayed reveals through smoke
- subtle camera breathing
- held shots that let the viewer notice details

Avoid:

- fast meaningless flythroughs
- constant orbiting
- excessive shake
- game-trailer chaos too early
- motion that competes with the subject

## Storytelling Philosophy

Show before explaining.

## Narrative DNA

The story of The Infected should stay consistent even as new missions, characters, enemies, and environments are added.

Every writer, cinematic designer, and mission designer should ask:

- How does hope survive here?
- What makes someone become infected?
- What is humanity fighting to preserve?
- What moral choices define survival?
- What does this scene reveal without explaining?
- What does the player risk by moving forward?
- What trace of ordinary life remains?

Narrative DNA:

- survival is meaningful because something human is still worth preserving
- danger should create moral pressure, not only combat pressure
- the outbreak should remain mysterious enough to invite discovery
- human choices should matter as much as infected threats
- every location should imply a before, a collapse, and an unresolved after

Show before explaining.

The world should communicate through:

- abandoned vehicles
- barricades
- evacuation signs
- emergency tape
- bloodless but unsettling traces
- radios still transmitting
- burnt-out checkpoints
- personal belongings left behind
- distant movement
- broken public announcements

Do not dump lore in the hero. The hero should create questions, not answer all of them.

Future narrative lines must come from approved world-building documents, not isolated copywriting.

## Character Philosophy

Start with **Survivor 001** only.

Survivor 001 must establish the human visual language for the game.

The survivor should feel:

- capable but vulnerable
- practical, not superheroic
- emotionally worn, not glamorous
- equipped through necessity
- grounded in the world
- visually readable at mobile scale

Do not generate dozens of survivors. One exceptional survivor is more valuable than ten average designs.

## Enemy Philosophy

Start with **Infected 001** only.

Infected 001 must establish the threat language.

The infected should feel:

- human enough to be disturbing
- physically dangerous
- behaviorally unpredictable
- not a cartoon monster
- readable in silhouette
- designed for gameplay clarity

Do not invent final enemy classes until the Infected Bible is approved.

## Environment Philosophy

Start with **Environment 001** only.

Environment 001 must answer:

> What does The Infected look like?

The first approved environment should define the visual DNA for later locations.

It should include:

- ruined urban street
- abandoned vehicles
- emergency lighting
- checkpoint or barricade
- drifting smoke
- destroyed infrastructure
- visual clues about evacuation or containment
- distant infected movement or implied threat
- survivor presence without over-explaining the story

Every prop should have a reason to exist.

## Audio Philosophy

Silence is a tool.

## Audio DNA

The audio identity of The Infected should make the city feel alive after collapse.

Recurring audio DNA:

- distant wind moving through empty streets
- failing electrical systems
- emergency broadcasts and broken radio fragments
- sparse, low musical tension rather than constant score
- silence used deliberately
- metal creaks and structural stress
- far-away dogs, sirens, helicopters, or human sounds used sparingly
- environmental storytelling through sound before dialogue
- subtle threat cues before visual confirmation

Every environment should have a sonic identity, but no environment should be filled with noise just to feel busy.

Do not fill every second with music. Often, distant wind, a broken siren, or a radio burst is more powerful than a full score.

Audio should make the city feel alive after collapse.

Useful layers:

- distant helicopters
- emergency radio bursts
- electrical hum
- metal creaks
- collapsing structures
- dogs barking far away
- isolated screams
- wind through streets
- faint public-address fragments
- low sub-bass tension used sparingly

Audio should evolve with time and player/visitor attention.

## UI Philosophy

The UI should feel like survival equipment, not SaaS chrome.

Use:

- restrained typography
- practical controls
- minimal text
- diegetic hints where possible
- strong contrast
- mobile-first hit targets
- interfaces that do not break immersion

Avoid large blocks of explanatory copy in the hero. Let the world carry the emotion.

## Android Design Constraints

Every visual decision should be possible to approximate in the future Android game.

Constraints:

- must degrade gracefully on lower-end Android devices
- avoid effects that require expensive desktop-only rendering
- use layered atmosphere intelligently, not brute force
- preserve readability at small screen sizes
- keep silhouettes and focal points mobile-readable
- design cinematics and key art with Android store crops in mind
- favor reusable assets, not one-off website-only visuals

## Success Criteria

The Hero Production Candidate succeeds if a new visitor stops and thinks:

> I want to know what happened here.

If that reaction happens before they read the text, the creative direction is working.
