# Shared item-system data

Status: prototype contract data. Nothing in this directory is approved, canonical, purchasable, or evidence of implemented gameplay.

## Files

- `item-catalog.v1.json`: engine-independent item definitions for the first 10 weapon and 20 gear concepts.
- `shop-catalog.v1.json`: logical offers and entitlement IDs. Every offer is disabled and unpriced until commerce review.
- `audio-cues.v1.json`: logical music, UI, weapon, and gear cues. Every cue is a placeholder with no bound asset.

Static definitions, live shop data, and player state are separate:

- Item definitions describe what an item is.
- Shop offers describe whether a reviewed item may be sold and which entitlement it grants.
- Player inventory describes what a specific authenticated player owns, has unlocked, and has equipped.
- The backend is authoritative for active prices, payment verification, entitlements, inventory revisions, and refunds.

Android should consume these JSON documents through the existing game-data sync bridge. Godot adapters may map stable IDs into engine resources, but they must not rename IDs, embed provider price IDs, or treat placeholder references as existing assets.

Run `npm run validate:game-data` from the repository root before committing changes.
