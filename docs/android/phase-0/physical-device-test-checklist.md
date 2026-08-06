# Physical Android Device Test Checklist

**Status:** Phase 0 remains UNAPPROVED until this checklist is completed on Paul's actual Android phone and results are recorded.

**APK Artifact Reference:**
- GitHub Actions run: 31101247866
- Artifact ID: 8967642530
- Artifact name: the-infected-android-debug
- Artifact ZIP contains: the-infected-debug.apk
- APK SHA-256: `458e36d57d641596fbc7061814cc744fe183fb8b7ac73d0f5c222181f7d7a34a`
- APK Size: 83,949,287 bytes (80.1 MB)
- Source SHA: `62fdff13283feefa53b514042dcd1bc66662f70e`

---

## Device Information

Record the following before starting the test:

- Phone manufacturer: ________
- Phone model: ________
- Android version: ________
- Screen resolution: ________
- Available storage before installation: ________
- RAM, when known: ________
- APK SHA-256 verified: Yes / No
- Test start time: ________
- Test end time: ________

---

## APK Installation

1. Download the artifact ZIP from GitHub Actions run 31101247866 (artifact name: the-infected-android-debug).
2. Extract the ZIP.
3. Locate `the-infected-debug.apk` inside the extracted ZIP.
4. Verify the APK SHA-256: `458e36d57d641596fbc7061814cc744fe183fb8b7ac73d0f5c222181f7d7a34a`
5. Transfer the APK to the phone.
6. Allow installation from the selected source.
7. Install the APK.

Do not install the ZIP. Install only the APK inside it.

**Expected:** The application installs and a launcher entry appears.
Record whether Android displays a default Godot icon, generic icon, missing icon or branded The Infected icon.

A placeholder icon alone is not an installation failure.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: __________

---

## First Launch

1. Tap the app icon to launch.
2. Observe the initial load behavior.

**Expected:** Game launches to the main scene. No crash on startup.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: __________

---

## Orientation Test

The viewport and HUD were designed for 1280×720 landscape, but the
current Godot setting uses orientation=1, which maps to SCREEN_PORTRAIT.

Record whether the application:
- locks to portrait
- rotates to landscape
- crops the HUD
- stretches the viewport
- shows black bars
- hides or blocks controls

Fail the test only when required controls or important gameplay content
are inaccessible or unusable.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: __________

---

## Touch Movement and Camera

1. Touch and drag on the screen to move the player character.
2. Observe camera follow behavior.
3. Test drag-to-move virtual joystick responsiveness.

**Expected:** Player moves in response to touch input. Camera follows the player.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: __________

---

## Firearm and Melee Controls

1. Test firearm shooting (tap or hold fire button).
2. Test melee attack.
3. Observe combat feedback (hit markers, damage numbers).

**Expected:** Both firearm and melee attacks register and produce visual feedback.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: __________

---

## Audio

1. Listen for background audio (ambient tones).
2. Listen for combat audio (firearm, melee sounds).
3. Test volume behavior when switching apps.

**Expected:** Procedural placeholder audio plays. No silence or distortion.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: __________

---

## Lifecycle and Persistence Tests

### Background and Resume

1. Press Home.
2. Wait 15 seconds.
3. Reopen the game.
4. Confirm it resumes without crashing or corrupting controls/audio.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: __________

### Remove from Recents

1. Swipe the game away from Recents.
2. Relaunch it.
3. Confirm it starts normally and the save remains available.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: __________

### Android Force-Stop

1. Open Settings → Apps → The Infected.
2. Select Force stop.
3. Relaunch.
4. Confirm the persisted save loads.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: __________

---

## Inventory

1. Open the inventory screen.
2. Verify the 30-item catalog loads.
3. Check that items display correctly.

**Expected:** Inventory opens and shows item slots. All 30 items defined.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: __________

---

## Equipment

1. Open the equipment/loadout screen.
2. Verify currently equipped items display (Warden-9 pistol, Fieldpack 45).
3. Try selecting a different weapon if available.

**Expected:** Equipment screen shows current loadout. Items can be selected.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: __________

---

## Save

1. Play for a few seconds to trigger auto-save (every 2.0s).
2. Check that no save errors appear.

**Expected:** Auto-save triggers without errors. Save file created at user://save_v1.json.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: __________

---

## Level-Completion Test

Play through the single-level loop and record each condition separately:

- [ ] Reached beacon
- [ ] Neutralized required infected
- [ ] Collected salvage
- [ ] Completion feedback appeared
- [ ] run_complete behavior occurred
- [ ] Save occurred after completion
- [ ] Replay/retry option worked

Do not say reaching the extraction zone alone completes the route.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: __________

---

## Retry / Checkpoint Behavior

1. After level completion (or death), test the retry button.
2. Verify the game restarts the level correctly.

**Expected:** Retry restarts the level. No crash or stuck state.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: __________

---

## Stability (15 Minutes)

1. Play continuously for at least 15 minutes.
2. Monitor for crashes, freezes, or memory issues.
3. Note any performance degradation over time.

**Expected:** Game remains stable for 15+ minutes of continuous play.

**Result:** [ ] Pass  [ ] Fail  [ ] Notes: __________

---

## Device Observations

Record the following after testing:

- Observed orientation: ________
- Frame-rate impression: Smooth / Minor stutter / Severe stutter
- Device temperature: Normal / Warm / Hot
- Audio synchronization: Pass / Fail
- Touch-control accessibility: Pass / Fail
- Controls clipped or hidden: Yes / No

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
| Orientation | | |
| Touch movement and camera | | |
| Firearm and melee controls | | |
| Audio | | |
| Background and resume | | |
| Remove from Recents | | |
| Android force-stop | | |
| Inventory | | |
| Equipment | | |
| Save | | |
| Level completion | | |
| Retry / checkpoint | | |
| Stability (15 min) | | |

**Overall Result:** [ ] All passed  [ ] Issues found (describe above)

**Tester:** _____________  **Date:** ____________

---

Phase 0 remains unapproved until this checklist is completed and results are recorded.