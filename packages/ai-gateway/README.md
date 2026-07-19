# Game AI Gateway

This package defines the server-side contract between The Infected and the
Mastra/Voicebox services. It has no cloud AI dependency.

## Boundary

- Mastra prepares and orchestrates game AI workflows on the server.
- Voicebox runs locally or on an explicitly managed private machine and is
  represented by the `VoiceboxLocalProvider` contract.
- Android receives a `VoiceAssetDescriptor` or a cached packaged asset. It never
  receives Mastra or Voicebox credentials.
- `MockVoiceProvider` is the only provider enabled by default for tests.

## Local Voicebox transport

`VoiceboxLocalProvider` is an opt-in server adapter. It sends `profile_id`,
`text`, `language`, and the optional engine to Voicebox at
`VOICEBOX_LOCAL_URL` (default `http://127.0.0.1:17493`), polls the returned
generation status, and exposes the completed local `/audio/{generation_id}`
resource as a gateway descriptor. It does not send a cloud API key.

## Why no live adapter yet?

The exact Voicebox deployment mode, profile identifiers, output storage, and
approval workflow still need to be selected. The gateway keeps the local REST
adapter replaceable with Voicebox MCP or a direct local process later.

The local Voicebox project is documented at https://voicebox.sh/ and
https://docs.voicebox.sh/. Mastra's workflow and server boundaries are
documented at https://mastra.ai/docs/workflows/overview and
https://mastra.ai/docs/server/mastra-server.
