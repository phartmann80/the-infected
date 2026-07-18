# Game Design Document

Status: Draft design. The item-system foundation is implemented as prototype metadata; gameplay and commercial behavior remain unapproved.

This document will define gameplay pillars, target Android experience, camera, controls, combat, progression, economy, enemy taxonomy, level structure, and retention loops.

## Item and shop foundation

The first engine-independent item milestone is defined in `packages/game-data` and [SHOP_AND_ENTITLEMENT_ARCHITECTURE.md](./SHOP_AND_ENTITLEMENT_ARCHITECTURE.md):

- 10 prototype weapon concepts;
- 20 prototype gear concepts;
- logical audio and asset references;
- disabled, unpriced shop offers;
- player inventory, loadout, and entitlement contracts;
- a provider-neutral verified-purchase flow for future backend implementation.

These records establish stable IDs and data shape only. They do not add playable weapons or gear, enable a shop, set production prices, grant ownership, or approve content as canonical.

No permanent gameplay content is approved in this scaffold.
