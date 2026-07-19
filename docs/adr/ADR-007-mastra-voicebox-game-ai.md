# ADR-007 Mastra and local Voicebox game AI

## Status

Draft

## Approval Date

Pending

## Decision

The Android game will not call Mastra or Voicebox directly. A server-side game
AI gateway will own workflow execution, provider access, caching, moderation,
asset provenance, and delivery of signed or packaged audio assets.

Mastra will be the orchestration boundary for game AI workflows such as
narration preparation, character dialogue, and mission-aware responses. The
gateway will depend on a small `MastraNarrationWorkflow` port rather than
coupling the Android client to the Mastra SDK.

Voicebox will be treated as a local/self-hosted voice engine. The first
integration target is a private Voicebox process on the development or server
machine, using its supported local integration surface. No Voicebox cloud key
or remote provider is required.

## Consequences

- Android can work offline with packaged, approved voice assets.
- Live or generated lines can be cached and delivered without exposing model
  credentials in the APK.
- Voice generation remains replaceable: the current adapter uses Voicebox
  local REST, while MCP or a direct process can be added later.
- The exact Voicebox profile, model, output format, storage policy, and runtime
  hosting still need approval.
- Mastra is not installed in the current foundation package; the contract is
  dependency-light until the server runtime is selected.

## Current implementation

`@the-infected/ai-gateway` contains the server boundary, a Mastra workflow port,
an opt-in Voicebox local REST adapter, and a mock provider. The mock provider is
the default and produces dry-run descriptors without audio generation.

## Related references

- [Game AI Gateway](../../packages/ai-gateway/README.md)
- [Voicebox local documentation](https://docs.voicebox.sh/)
- [Mastra workflow documentation](https://mastra.ai/docs/workflows/overview)
- [Mastra server documentation](https://mastra.ai/docs/server/mastra-server)
