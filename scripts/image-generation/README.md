# Image Generation CLI

Usage example:

npm run image:generate -- \
  --provider xai \
  --brief hero-key-art-001 \
  --reference assets/visual_benchmarks/Visual_Benchmark_Candidate_001.png \
  --output assets/generated/internal-review/ \
  --dry-run

Flags:
--provider <xai|logicc>
--brief <brief-file-name>
--reference <path to reference image>
--output <output dir>
--dry-run (assemble prompt only)
--confirm (explicit confirmation to allow paid calls)
--max-cost <USD>

Environment variables (.env.local):
IMAGE_PROVIDER=
IMAGE_MODEL=
IMAGE_API_KEY=
XAI_API_KEY=
XAI_IMAGE_MODEL=
XAI_BASE_URL=
LOGICC_API_KEY=
LOGICC_IMAGE_MODEL=
LOGICC_BASE_URL=
IMAGE_OUTPUT_RESOLUTION=

Safeguards implemented:
- Dry-run mode prints assembled prompt and writes provenance without calling provider.
- Requires --confirm to proceed with live API calls.
- --max-cost param is checked where providers implement estimateCost.
- One image default, no batch mode by default.
- No secrets are read from CLI args (use .env.local instead).

Provenance:
Provenance files saved as JSON to the output directory with asset metadata (no API keys or auth headers).
