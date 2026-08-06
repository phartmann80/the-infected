# Physical Android Device Test Checklist

**Status:** Phase 0 remains UNAPPROVED until this checklist is completed on Paul's actual Android phone and results are recorded.

**APK Artifact Reference:** GitHub Actions Run #31101247866, Artifact: `the-infected-android`
**APK SHA-256:** `458e36d57d641596fbc7061814cc744fe183fb8b7ac73d0f5c222181f7d7a34a`
**APK Size:** 83,949,287 bytes (80.1 MB)
**Source SHA:** `62fdff13283feefa53b514042dcd1bc66662f70e`

---

## Installation

1. Download the APK artifact from the CI run.
2. Enable "Install from unknown sources" on your Android device if not already enabled.
3. Install the APK.
4. Verify the app appears in the app drawer as "The Infected".

**Expected:** Installation completes without error. App icon appears in launcher.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: _________

---

## First Launch

5. Tap the app icon to launch.
6. Observe the initial load behavior.

**Expected:** Game launches to the main scene. No crash on startup.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: _________

---

## Portrait vs Landscape Behavior

7. Launch the game in portrait orientation.
8. Rotate the device to landscape.
9. Observe behavior in both orientations.

**Expected:** The game is designed for landscape (orientation=1, SCREEN_PORTRAIT in Godot). Portrait may show incorrect layout. Document what happens.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: _________

---

## Touch Movement and Camera

10. Touch and drag on the screen to move the player character.
11. Observe camera follow behavior.
12. Test drag-to-move virtual joystick responsiveness.

**Expected:** Player moves in response to touch input. Camera follows the player.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: _________

---

## Firearm and Melee Controls

13. Test firearm shooting (tap or hold fire button).
14. Test melee attack.
15. Observe combat feedback (hit markers, damage numbers).

**Expected:** Both firearm and melee attacks register and produce visual feedback.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: _________

---

## Audio

16. Listen for background audio (ambient tones).
17. Listen for combat audio (firearm, melee sounds).
18. Test volume behavior when switching apps.

**Expected:** Procedural placeholder audio plays. No silence or distortion.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: _________

---

## Pause and Resume

19. Tap the pause button during gameplay.
20. Verify the pause menu appears.
21. Tap resume and verify gameplay continues.

**Expected:** Pause works, resume returns to active gameplay without issues.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: _________

---

## Inventory

22. Open the inventory screen.
23. Verify the 30-item catalog loads.
24. Check that items display correctly.

**Expected:** Inventory opens and shows item slots. All 30 items defined.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: _________

---

## Equipment

25. Open the equipment/loadout screen.
26. Verify currently equipped items display (Warden-9 pistol, Fieldpack 45).
27. Try selecting a different weapon if available.

**Expected:** Equipment screen shows current loadout. Items can be selected.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: _________

---

## Save

28. Play for a few seconds to trigger auto-save (every 2.0s).
29. Check that no save errors appear.

**Expected:** Auto-save triggers without errors. Save file created at user://save_v1.json.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: _________

---

## Force-Close

30. Force-close the app from the Android app switcher.
31. Verify the app terminates cleanly.

**Expected:** App closes without error dialogs.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: _________

---

## Relaunch and Load

32. Relaunch the app after force-close.
33. Verify the game starts normally.
34. Check if save data persists (if save was completed before force-close).

**Expected:** Game relaunches successfully. Save data persists if a save was completed.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: _________

---

## Level Completion

35. Play through the single-level loop.
36. Reach the extraction point (beacon).
37. Verify level completion triggers (reach extraction zone, collect salvage, neutralize infected, mark complete).

**Expected:** Level completion sequence triggers when reaching the extraction zone.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: _________

---

## Retry / Checkpoint Behavior

38. After level completion (or death), test the retry button.
39. Verify the game restarts the level correctly.

**Expected:** Retry restarts the level. No crash or stuck state.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: _________

---

## Stability (15 Minutes)

40. Play continuously for at least 15 minutes.
41. Monitor for crashes, freezes, or memory issues.
42. Note any performance degradation over time.

**Expected:** Game remains stable for 15+ minutes of continuous play.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: _________

---

## Capturing Screenshots or Screen Recording

- **Screenshots:** Press Power + Volume Down simultaneously on most Android devices.
- **Screen Recording:** Use the built-in screen recorder in Android 11+ (swipe down from top, select Screen Recorder).
- Share screenshots or recordings with Alex for the test record.

---

## Collecting Logcat (Only If the App Crashes)

If the application crashes, collect crash logs:

1. Connect your phone to a computer with ADB installed.
2. Run: `adb logcat -s godot > crash_log.txt`
3. Reproduce the crash.
4. Share `crash_log.txt` with Alex.

Only collect logcat if a crash occurs. Normal operation does not require log collection.

---

## Test Summary

| Test Area | Result | Notes |
| --- | --- | --- |
| Installation | | |
| First launch | | |
| Portrait vs landscape | | |
| Touch movement and camera | | |
| Firearm and melee controls | | |
| Audio | | |
| Pause and resume | | |
| Inventory | | |
| Equipment | | |
| Save | | |
| Force-close | | |
| Relaunch and load | | |
| Level completion | | |
| Retry / checkpoint | | |
| Stability (15 min) | | |

**Overall Result:** [ ] All passed  [ ] Issues found (describe above)

**Tester:** _________________  **Date:** _________________

---

Phase 0 remains unapproved until this checklist is completed and results are recorded.