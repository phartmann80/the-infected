# Save-File Versioning

Save files will use explicit schema versions, migration functions, and backwards-compatible validation. The Android technical prototype must prove this before gameplay content scales.

The current prototype writes schema `3` to `user://save_v1.json`. It accepts schema `1` and `2` saves, persists the survivor and infected state, camera yaw, collected pickups, beacon progress, inventory, and completion state, and exposes explicit `SAVE`/`LOAD` controls for desktop and Android input. Missing fields in older saves use the prototype defaults; no save is accepted outside the supported schema range.
