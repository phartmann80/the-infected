# Video Generation CLI

Blackbox is the configured video provider for this project. The adapter uses
Blackbox's OpenAI-compatible `/chat/completions` endpoint and defaults to
`blackboxai/google/veo-3-fast`; the model can be changed with
`BLACKBOX_VIDEO_MODEL`.

Example dry-run:

```bash
npm run video:generate -- \
  --provider blackbox \
  --model blackboxai/google/veo-3-fast \
  --prompt "A cinematic infected city at dawn, slow camera push-in" \
  --output .tmp/video-generation/internal-review \
  --dry-run
```

Live generation requires all of the following:

- `BLACKBOX_AI_API` or `BLACKBOX_API_KEY`
- an explicit `--output` directory
- `--confirm`
- `--max-cost`, unless `BLACKBOX_ESTIMATED_COST_USD` is configured

Optional model-specific parameters can be passed as a JSON object through
`BLACKBOX_VIDEO_PARAMETERS_JSON`. This keeps model-specific fields out of the
common provider contract.

Reference images may be HTTPS URLs or local image paths. Local paths are sent
as data URLs; they are not uploaded to a separate service.

Every completed generation downloads the returned video into the requested
directory and writes a provenance JSON file. No API keys or authorization
headers are written to provenance.
