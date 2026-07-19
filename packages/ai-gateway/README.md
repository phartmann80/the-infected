# Game AI Gateway

This package defines the server-side contract between The Infected and future
Mastra/Voicebox services. It intentionally has no runtime AI dependency yet.

## Boundary

- Mastra prepares and orchestrates game AI workflows on the server.
- Voicebox runs locally or on an explicitly managed private machine and is
  represented by the `VoiceboxLocalProvider` contract.
- Android receives a `VoiceAssetDescriptor` or a cached packaged asset. It never
  receives Mastra or Voicebox credentials.
- `MockVoiceProvider` is the only provider enabled by default for tests.

## Why no live adapter yet?

The exact Voicebox deployment mode, profile identifiers, output storage, and
approval workflow still need to be selected. The interface supports Voicebox's
local REST, MCP, or direct-process integration without committing the game to
one transport.

The local Voicebox project is documented at https://voicebox.sh/ and
https://docs.voicebox.sh/. Mastra's workflow and server boundaries are
documented at https://mastra.ai/docs/workflows/overview and
https://mastra.ai/docs/server/mastra-server.
