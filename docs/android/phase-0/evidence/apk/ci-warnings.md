# CI Build Warnings

1. **No Android project icon** — Godot export advice: "No project icon specified (Project Settings → Application → Config → Icon)"
2. **No ADB daemon running** — ADB-related steps were skipped during the CI build
3. **Godot ObjectDB leaks** — 3 ObjectDB instances leaked at exit (2 during editor import, 1 during headless export). Non-fatal.
4. **setup-java@v4 action deprecated** — GitHub Actions runner deprecation notice
5. **Node 20 runtime deprecated** — GitHub Actions runner deprecation notice for Node 20

All warnings are non-blocking. The build completed successfully with all 6 contract tests passing.