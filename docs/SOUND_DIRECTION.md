# Sound Direction

Status: Draft production direction.

Primary reference: [CREATIVE_DIRECTION.md](./CREATIVE_DIRECTION.md)

## Core rule

Silence is a tool.

Do not fill every second with music. Sometimes distant wind, a broken siren, or a radio burst is more powerful than a full soundtrack.

## Emotional goal

The listener should subconsciously believe the city is still alive.

## Approved sound layers

Use subtle layers such as:

- distant helicopters
- emergency radio bursts
- electrical hum
- metal creaks
- collapsing metal
- dogs barking far away
- isolated screams
- wind through empty streets
- distant sirens
- broken public-address fragments
- low sub-bass tension used sparingly

## Hero audio progression

The hero should evolve over time:

| Time | Direction |
|---|---|
| 0–3s | distant wind and empty city air |
| 3–6s | metal creaks, failing structures |
| 6–10s | distant scream or threat clue, very subtle |
| 10s+ | low ambience and survival tension |

## Narration rule

Do not write isolated narration lines outside approved world-building.

Future dialogue and narration should come from:

- [CREATIVE_DIRECTION.md](./CREATIVE_DIRECTION.md)
- future Lore Bible
- character approvals
- cinematic shot purpose

## Browser rule

Public narration must be a controlled prerecorded file, never browser SpeechSynthesis.

## Item-system audio boundary

`packages/game-data/data/audio-cues.v1.json` defines logical cues for main-menu music, shop atmosphere, item selection, verified purchase confirmation, inventory navigation, weapon interactions, and gear equip/showcase feedback.

The cue catalog is data-driven and engine-independent. Every current cue is a placeholder with no bound audio asset. A cue becomes usable only after an approved binary is recorded in `assets/sound-registry.json`; missing cues must fail silently in clients. Purchase confirmation audio must play only after the backend reports a granted entitlement, never from a client redirect or unverified payment result.
