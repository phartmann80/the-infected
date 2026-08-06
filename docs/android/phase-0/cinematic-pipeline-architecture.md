# Cinematic Pipeline Architecture - Level Introduction System

**Status:** Architecture approved. Not implemented. No runtime cinematic code, .ogv files, or Godot integration during Phase 0.

## 1. Approved Cinematic Direction

Every level begins with a short narrated cinematic introducing: level environment, current story situation, survivor entering the level, infected types present, mission objective, recommended weapons/gear, major hazards, extraction/completion goal.

Videos are pre-generated offline during the build/asset pipeline on our server using CPU resources only. They are not generated dynamically during gameplay. This keeps the APK responsive, allows offline playback, and avoids any server GPU requirement at runtime.

## 2. CPU-Only Creation Tools

- **FFmpeg:** video composition, image movement, zooms, pans, transitions, overlays, subtitles, audio mixing, final encoding
- **Python with Pillow/Cairo:** maps, mission graphics, objective cards, HUD elements, generated frames
- **ImageMagick:** image preparation where it simplifies workflow
- **Voicebox:** pre-generated narration audio
- **Approved landing-page artwork and character renders**
- **Externally generated Meshy assets** (after validation)
- **Optional Blender CPU rendering** for advanced 3D sequences later

**CRITICAL:** FFmpeg is a build-time/server tool ONLY. Do not embed FFmpeg, libmpv, or libavcodec inside the APK.

## 3. Godot Playback Decision

- Use Godot's built-in VideoStreamPlayer
- Game cinematic format: Ogg Theora video with Vorbis audio (.ogv)
- MP4 review copies may be generated for: landing page, social media, internal review, archival storage
- The initial Godot APK uses .ogv to avoid introducing an additional Android-native video-decoding plugin or ABI dependency

## 4. Cinematic Pipeline Flow

```
Approved images / environment art / Meshy renders
        ↓
Voicebox narration WAV
        ↓
Background music and sound effects
        ↓
Python/Pillow/Cairo frame generation (1280x720, 24fps)
        ↓
FFmpeg composition, motion, and audio mixing
        ↓
Game output: .ogv (libtheora + libvorbis)
        ↓
Optional web/review output: .mp4 (libx264 + aac)
        ↓
ffprobe validation
        ↓
SHA-256 manifest
        ↓
Godot VideoStreamPlayer
        ↓
Transition into level gameplay
```

## 5. Proposed Cinematic Directory Structure

```
apps/android/scenes/cinematics/cinematic_player.tscn
apps/android/scripts/cinematics/cinematic_controller.gd
apps/android/data/level_cinematics.v1.json
apps/android/assets/cinematics/
apps/android/assets/narration/
apps/android/assets/music/
apps/android/assets/subtitles/
scripts/cinematics/
```

## 6. level_cinematics.v1.json Schema

```json
{
  "schema_version": 1,
  "cinematics": {
    "level_01": {
      "level_id": "level_01",
      "level_name": "Arrival Route",
      "duration_seconds": 18,
      "resolution": { "width": 1280, "height": 720 },
      "frame_rate": 24,
      "video_codec": "theora",
      "audio_codec": "vorbis",
      "cinematic_file": "res://assets/cinematics/level_01_arrival_route.ogv",
      "poster_fallback": "res://assets/cinematics/level_01_arrival_route_poster.webp",
      "subtitle_file": "res://assets/subtitles/level_01_arrival_route.json",
      "skip_enabled": true,
      "replay_enabled": true,
      "sha256": null,
      "file_size_bytes": null
    }
  }
}
```

All runtime asset paths use Godot-compatible `res://` paths. This JSON has been validated with a JSON parser.

## 7. FFmpeg/Python Build Pipeline

1. **Frame Generation (Python/Pillow/Cairo):** Generate individual frames at 1280x720, 24fps. Each frame composites approved artwork, character renders, environment art, HUD elements, objective cards, and text overlays. Parallax layers, fog, smoke, embers, emergency-light effects applied per-frame. Target: 360-480 frames for 15-20 seconds.

2. **Audio Generation (Voicebox + synthesis):** Generate narration WAV via Voicebox. Generate or source background music and sound effects. Mix narration + music + SFX with voice/music ducking using FFmpeg's sidechain compression.

3. **Video Composition (FFmpeg):** Compose frames into video with motion (zooms, pans, transitions), overlay subtitles, mix audio, and encode to .ogv (libtheora + libvorbis). Optionally encode .mp4 review copy (libx264 + aac).

4. **Validation (ffprobe):** Verify codec, resolution, frame rate, duration, audio presence. Fail the build if any check fails.

5. **Manifest (SHA-256):** Calculate SHA-256 of the .ogv file and record in level_cinematics.v1.json.

6. **Godot Import:** Place .ogv in assets/cinematics/, import via VideoStreamPlayer, configure autoplay, skip button, subtitle overlay, and transition-to-gameplay signal.

## 8. Godot VideoStreamPlayer Architecture

| Feature | Implementation |
| --- | --- |
| Load cinematic by level ID | Read level_cinematics.v1.json, resolve .ogv path |
| Autoplay | VideoStreamPlayer.autoplay = true on scene enter |
| Skip button | Touch input or button press stops playback, emits skip signal |
| Subtitles | Overlay Label node synced to narration timeline |
| Narration | Embedded in .ogv Vorbis audio track |
| Background music | Embedded in .ogv Vorbis audio track (mixed with narration) |
| Voice/music ducking | Applied at build time in FFmpeg, not at runtime |
| Playback-completed signal | VideoStreamPlayer.finished signal connected to transition function |
| Playback-error fallback | Catch error, show poster fallback image, proceed to gameplay |
| Transition into gameplay | On finished/skip: free cinematic scene, load level scene |
| Replay from level selection | Level selection screen calls cinematic_controller with level ID |
| Pause/resume on backgrounded | Notification handler pauses/resumes VideoStreamPlayer |
| Fully offline playback | .ogv bundled in APK assets, no network required |

## 9. Build Validation

The cinematic build script must record and verify:

| Field | Required |
| --- | --- |
| level_id | Yes |
| duration | Yes (must be 15-20s for Level 1) |
| resolution | Yes (must be 1280x720) |
| frame_rate | Yes (must be 24 FPS) |
| video_codec | Yes (must be theora) |
| audio_codec | Yes (must be vorbis) |
| file_size | Yes |
| SHA-256 | Yes |
| narration_presence | Yes (must have audio stream) |
| music_presence | Yes (must have audio stream) |
| subtitle_data | Yes (JSON subtitle file must exist) |
| output_path | Yes |

The build must fail if the cinematic: is missing, is corrupt, has wrong resolution, has wrong duration, has no expected audio, cannot be decoded, or has no manifest entry.

## 10. APK-Size and Performance Gate

Do not produce all ten cinematics immediately. Create only the Level 1 cinematic first and measure:

| Metric | To Measure |
| --- | --- |
| Server CPU rendering time | Target: under 60 seconds |
| Final .ogv size | Target: under 2 MB |
| APK-size increase | Measure delta |
| Playback startup time | On physical device |
| Frame pacing | On physical device |
| Audio synchronization | On physical device |
| Memory use | During playback |
| Pause/resume behavior | When app is backgrounded |
| Physical Android-device performance | Overall |

Once Level 1 passes, establish the final per-video size budget before producing Levels 2-10.

## 11. Representative Quality Test Results

### Canonical Encode (Encode A) - Designated Canonical

| Metric | Value |
| --- | --- |
| Filename | `cinematic_representative.ogv` |
| MP4 review filename | `cinematic_review.mp4` |
| Duration | 18.0 seconds |
| Dimensions | 1280x720 |
| Frame rate | 24 fps |
| Pixel format | yuv420p |
| Video codec | theora (libtheora) |
| Audio codec | vorbis (libvorbis, 44100 Hz, stereo) |
| File size (.ogv) | 2,330,198 bytes (2.2 MB) |
| SHA-256 (.ogv) | `77499d95b04f7873c3e8b979fe6c7bfadc2d6c0c2a5aab7a1c6c46e1989ba73a` |
| File size (.mp4) | 1,480,062 bytes (1.4 MB) |
| SHA-256 (.mp4) | `17059b7c756d536596fe8ffb9e921077710ee76166c3dccf7d9348dcc695002d` |
| Video bitrate | ~1,036 kbps |
| Audio bitrate | 128 kbps |
| Video quality | q:v 6 |
| Audio quality | q:a 4 |
| Encode time | ~45 seconds (CPU-only, AMD EPYC 8 cores, no GPU) |
| Source assets | 3 (logo, weapon render, gear render) |
| Visual features | Zoom-in pan, parallax weapon pan, fade transition, fog/smoke overlay, vignette, objective overlay, narration subtitles |
| Narration source | FFmpeg lavfi flite (temporary, to be replaced by Voicebox) |
| Music source | FFmpeg lavfi sine + aecho (temporary ambient drone) |
| Subtitle text | "Equip. Survive. Escape." |
| Status | **Pipeline proven on server. Visual quality awaiting Paul's approval. Godot playback and Android performance not yet validated.** |

### Superseded Encode (Encode B) - Retained as Superseded

| Metric | Value |
| --- | --- |
| Filename | `level_01_representative_test.ogv` |
| MP4 review filename | `level_01_representative_test.mp4` |
| Duration | 15.0 seconds |
| Dimensions | 1280x720 |
| Frame rate | 24 fps |
| Pixel format | yuv444p (inflates file size) |
| Video codec | theora (libtheora) |
| Audio codec | vorbis (libvorbis, 44100 Hz, stereo) |
| File size (.ogv) | 4,095,673 bytes (3.9 MB) |
| SHA-256 (.ogv) | `6dd8b5b1977af87a465e2c9d0a124ace2700745218273dd60db12f2b205198ab` |
| File size (.mp4) | 2,984,796 bytes (2.8 MB) |
| SHA-256 (.mp4) | `4907f90a31a65a187f758ac90621989ffd785a89dab5e3d5f9782a3389a1562a` |
| Video bitrate | ~2,184 kbps |
| Audio bitrate | 160 kbps |
| Video quality | q:v 7 |
| Source assets | 3 (combat scene, character medic, weapon crowbar) |
| Status | **Superseded experimental encode. yuv444p inflates size. 15s at minimum of target range. Retained in evidence record, not deleted.** |

### FFmpeg Command (Canonical Encode)

```bash
ffmpeg -y -framerate 24 -i frames/frame_%05d.png -i mixed_audio.ogg \
  -c:v libtheora -q:v 6 -c:a libvorbis -q:a 4 \
  -pix_fmt yuv420p -s 1280x720 -r 24 cinematic_representative.ogv
```

### Source-Asset Manifest

| Asset | Purpose | SHA-256 |
| --- | --- | --- |
| `asset1_logo.png` | Logo overlay | `725b06699152dbbe7efef7dc82f27ca4356e22a1e55a0ae771d0f6dabb313362` |
| `asset2_weapon.png` | Weapon reveal | `08314a721fbf9f062781ea116472f21b095efc07e9d2344cd66b4dffc223c234` |
| `asset3_gear.png` | Gear display | `a46c9552d2151b67e94f2924d6cc19e79fadc208f4c2469dde8e91664f971b3a` |

### Representative Frames (Canonical Encode)

| Timestamp | Filename | SHA-256 |
| --- | --- | --- |
| t=1s | `frame_t1s.png` | `3550b8e75649c2949f1cd8c57a0ef6fb6609bb664d91970bb06830e5e420d646` |
| t=5s | `frame_t5s.png` | `492650682f3684ecaa09d16e87b29cfe9b2be975c14b43dcb57cf36f0b96763c` |
| t=9s | `frame_t9s.png` | `893546d5e27cbed57d3cb886f696a6e15299e84beaca839cfb73ed509366df70` |
| t=13s | `frame_t13s.png` | `d00041e9a889ea561668be607b906f77f865416b9a59bf38b7e8f078fbe26620` |
| t=17s | `frame_t17s.png` | `ec68de05e2056919d74905a7d600bb44b99cdb6e32027e78d318bc828e70e17e` |

### Encode Time and Server CPU

| Field | Value |
| --- | --- |
| Server CPU | AMD EPYC, 8 cores |
| GPU | None required (CPU-only encode) |
| Frame generation time | ~5 seconds (Python/Pillow) |
| Audio mix time | ~3 seconds |
| Video encode time | ~37 seconds |
| Total encode time | ~45 seconds |

## 12. Pipeline Functionality Test (NOT a Production Benchmark)

A minimal pipeline functionality test was performed to verify FFmpeg can encode Theora on the CPU:

| Parameter | Value |
| --- | --- |
| Test file | `arrival_route_with_audio.ogv` |
| Duration | 15.0 seconds |
| Resolution | 1280x720 |
| Frame rate | 24 fps |
| Video codec | libtheora |
| Audio codec | libvorbis (silent track) |
| File size | 131,852 bytes (128.8 KB) |
| Bit rate | 70,321 bps |

This test proves only that FFmpeg can encode Theora on the CPU and Vorbis audio can be included. It does not represent expected size or visual quality of the real Arrival Route cinematic.

## 13. Implementation Commit Plan

Architecture and planning only. Do not implement until Phase 0 is formally approved.

| Commit | Title | Scope | Test Requirement |
| --- | --- | --- | --- |
| cinematic-1 | Create cinematic directory structure + schema | Directory structure, JSON schema, placeholder files | JSON schema validates |
| cinematic-2 | Implement VideoStreamPlayer + controller | VideoStreamPlayer node, autoplay, skip, subtitles, transitions | Unit test: controller loads manifest, emits correct signals |
| cinematic-3 | Python/Pillow frame generation script | Frame generation at 1280x720 24fps | Script produces 360-480 valid PNG frames |
| cinematic-4 | FFmpeg composition + audio mixing + .ogv encoding | FFmpeg composition, .ogv encoding, optional .mp4 | ffprobe validates codec, resolution, frame rate, duration, audio |
| cinematic-5 | Build validation + SHA-256 manifest | ffprobe validation, SHA-256 calculation, manifest update | Build fails on any validation error |
| cinematic-6 | Integrate Level 1 cinematic into level loading | Call cinematic_controller from level loading, transition to gameplay | All 6 existing contract tests still pass |
| cinematic-7 | Physical device testing | Install APK, test playback, frame pacing, audio sync, memory, pause/resume | All metrics within acceptable range |
| cinematic-8 | Establish per-video size budget | Document final per-video size budget for Levels 2-10 | Budget approved by Paul |
| cinematic-9 | Produce cinematics for Levels 2-10 | Generate all remaining cinematics | Each cinematic passes build validation |

## 14. Relationship to AI Media Generation Architecture

The cinematic pipeline integrates with the centralized AI media generation platform (see `ai-media-generation-architecture.md`). The approved level-cinematic pipeline is:

```
Open-Generative-AI / provider-generated source assets
        ↓
Approved artwork and renders
        ↓
Voicebox narration
        ↓
FFmpeg + Python/Pillow/Cairo
        ↓
Godot-compatible .ogv
        ↓
APK integration
```

Open-Generative-AI does not replace FFmpeg, Python/Pillow/Cairo, Voicebox, Godot VideoStreamPlayer, our cinematic manifests, our backend, our game engine, or our gameplay systems.

## 15. Phase Boundary

This section is architecture and planning only. Do not:

- Import unverified Meshy GLBs
- Add cinematic code
- Add FFmpeg libraries to Android
- Add libmpv
- Add Google authentication
- Add commerce
- Merge PR #66

Implementation begins only after Phase 0 is approved.