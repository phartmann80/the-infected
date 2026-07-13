# Analytics and Telemetry Abstractions

Telemetry must be client-agnostic. Web and Android will emit typed events through `packages/telemetry`; provider-specific delivery belongs in `packages/analytics`.
