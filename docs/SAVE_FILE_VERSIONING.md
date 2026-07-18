# Save-File Versioning

Save files will use explicit schema versions, migration functions, and backwards-compatible validation. The Android technical prototype must prove this before gameplay content scales.

The current prototype writes schema `6` to `user://save_v1.json`. It accepts schemas `1` through `6`, persists the survivor and infected state, camera yaw, collected pickups, beacon progress, pickup inventory, local prototype loadout IDs, local weapon mode and ammunition, and completion state, and exposes explicit `SAVE`/`LOAD` controls for desktop and Android input. Missing fields in older saves use the prototype defaults; no save is accepted outside the supported schema range.

The `prototype_loadout` field records only the locally selected weapon and gear IDs. It does not record or infer ownership, purchase, entitlement, unlock, price, or payment-provider state. Invalid or removed item IDs fall back to the reviewed prototype defaults during load.

The `prototype_weapon_state` field is separate from both catalog definitions and loadout selection. It records only the selected weapon ID, active melee/firearm mode, magazine rounds, and reserve rounds. Reload progress and fire cooldown are intentionally transient and restart safely after load.
