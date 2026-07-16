# Backend Contracts v1

Status: design only. These contracts are not implemented, enabled, or deployed.

This document defines the shared boundary for the landing page Early Access flow and the first Android services. It is intentionally contract-first so the web client, Godot client, and future server implementation can evolve independently without making the prototype save file or the landing page responsible for server behavior.

## Consumers and constraints

| Consumer | Initial use | Constraint |
| --- | --- | --- |
| Web landing page | Early Access registration | Public, abuse-resistant, privacy-reviewed before enablement |
| Godot Android client | Identity, profile, cloud save, inventory, version checks | Intermittent connectivity and explicit local fallback |
| Server | Authoritative persistence and validation | Never trust client-owned currency, inventory, progression, or timestamps |
| Web and Android telemetry | Product and build diagnostics | Allowlisted events, no secrets, no raw email, no sensitive payloads |

The API is REST/JSON over HTTPS with URL versioning under `/api/v1`. Requests and responses use UTF-8 JSON. A server response may include an `x-request-id` header for support correlation; it must not expose hostnames, filesystem paths, commit hashes, environment variables, or stack traces.

The prototype's local save schema remains separate from cloud-save storage. A cloud save may contain a validated game-state payload, but the server owns the envelope revision, timestamps, conflict checks, and allowed data limits.

## Common rules

### Authentication

- Production clients use an opaque short-lived access token in `Authorization: Bearer <token>`.
- Refresh tokens are rotated, revocable, and stored only in platform-secure storage. They are never logged or placed in game data.
- Account creation and sign-in provider details are implementation decisions behind this contract. The API must not require the Android client to store a password.
- A guest or development identity may be supported for local evaluation only. It must be clearly marked non-production and must not grant access to another player's data.
- Every authenticated resource is scoped to the token subject; clients cannot supply an arbitrary player ID.

### Headers and limits

```http
Accept: application/json
Content-Type: application/json
Authorization: Bearer <access-token>
Idempotency-Key: <client-generated-key>   # required on retryable writes
```

The implementation must define and enforce body, batch, field-length, and request-rate limits before launch. Limits are part of the acceptance tests, not an undocumented server default.

### Error envelope

All error responses use the same shape and contain no internal details:

```json
{
  "error": "conflict",
  "message": "The saved revision is newer than the submitted revision.",
  "requestId": "request-correlation-id"
}
```

The `requestId` field is optional for clients and must be opaque. Reserved error codes are:

| HTTP | Code | Meaning |
| ---: | --- | --- |
| 400 | `invalid_request` | Malformed JSON or invalid request shape |
| 401 | `unauthorized` | Missing, expired, or invalid access token |
| 403 | `forbidden` | Authenticated but not allowed for the resource |
| 404 | `not_found` | Resource does not exist for this client |
| 409 | `conflict` | State conflicts with a newer server revision |
| 412 | `precondition_failed` | Required ETag or revision precondition failed |
| 415 | `unsupported_media_type` | Request is not JSON |
| 422 | `validation_failed` | JSON is valid but fields fail validation |
| 429 | `rate_limited` | Caller exceeded the endpoint limit |
| 503 | `service_unavailable` | Service is temporarily unable to accept the request |

## Resource contracts

### Player profile

```http
GET   /api/v1/me
PATCH /api/v1/me
```

`GET` returns the authenticated profile:

```json
{
  "id": "player_opaque_id",
  "displayName": "Raven",
  "createdAt": "2026-07-16T00:00:00.000Z",
  "schemaVersion": 1
}
```

`PATCH` may update only explicitly approved fields such as `displayName`. The server validates length, Unicode handling, reserved names, and rate limits. Email and identity-provider data are not returned by this resource unless a later privacy-reviewed contract explicitly requires them.

### Inventory and currency

```http
GET /api/v1/me/inventory
```

```json
{
  "schemaVersion": 1,
  "revision": 12,
  "items": [
    { "itemId": "prototype.scrap", "quantity": 3 }
  ],
  "currency": { "scrap": 3 }
}
```

The server is authoritative for item IDs, quantities, currency, and progression rewards. The client may submit an action in a later contract, but it may not directly set a balance or append arbitrary inventory entries. Collection responses must be bounded and use a revision or ETag for cache and conflict handling.

### Cloud saves

```http
GET /api/v1/me/saves/{slot}
PUT /api/v1/me/saves/{slot}
```

The slot is a bounded identifier such as `primary`; it is not a filesystem path. A successful `PUT` replaces the complete validated save for that slot:

```json
{
  "schemaVersion": 1,
  "baseRevision": 4,
  "clientVersion": "0.1.0-debug",
  "contentVersion": "foundation-1",
  "state": {
    "environmentId": "environment-001",
    "health": 100,
    "inventory": { "prototype.scrap": 3 }
  }
}
```

The response returns the server revision and update time:

```json
{
  "slot": "primary",
  "schemaVersion": 1,
  "revision": 5,
  "updatedAt": "2026-07-16T00:00:00.000Z",
  "state": { "environmentId": "environment-001", "health": 100 }
}
```

Writes require an `Idempotency-Key` and a current `baseRevision` or `If-Match` ETag. A stale write returns `409 conflict` and never overwrites a newer save. The implementation must enforce a maximum payload size, allowed state fields, and a retention/deletion policy before cloud saves are enabled.

### Analytics events

```http
POST /api/v1/events/batch
```

The batch is transport-only telemetry. It does not change game state:

```json
{
  "events": [
    {
      "eventId": "event-opaque-id",
      "name": "prototype_run_started",
      "version": "1",
      "surface": "android",
      "sessionId": "session-opaque-id",
      "clientVersion": "0.1.0-debug",
      "contentVersion": "foundation-1",
      "occurredAt": "2026-07-16T00:00:00.000Z",
      "properties": { "environmentId": "environment-001" }
    }
  ]
}
```

The server accepts only an allowlist of event names and property keys, caps batch size, validates event time skew, and redacts or rejects email, access tokens, save payloads, filesystem paths, and free-form sensitive text. A valid accepted batch returns `202` with `{ "status": "accepted" }`. Delivery is best effort and must not block local gameplay or save/load.

The transport shape extends the existing `packages/telemetry` and `packages/analytics` types; it does not replace the platform-neutral event definitions.

### Client version checks

```http
GET /api/v1/client-versions?platform=android&channel=debug
```

```json
{
  "platform": "android",
  "channel": "debug",
  "minVersion": "0.1.0",
  "recommendedVersion": "0.1.0",
  "contentVersion": "foundation-1",
  "updateUrl": null,
  "schemaVersion": 1
}
```

The endpoint is read-only and cacheable for a short interval. `304` is valid when the client supplies a matching ETag. A temporary `503` must leave the prototype playable according to its local policy; it must not silently erase local saves.

### Early Access registration

The current landing route is a disabled-by-default compatibility surface at `POST /api/early-access`. It accepts `{ email, consent, source }`, normalizes the email, rate-limits requests, and writes to the configured server-side storage path only when `EARLY_ACCESS_ENABLED=true`. It is not the approved production backend.

The planned versioned contract is:

```http
POST /api/v1/early-access
```

```json
{
  "email": "player@example.com",
  "consent": true,
  "source": "hero"
}
```

Success returns `202`:

```json
{ "status": "accepted" }
```

The service must normalize email for duplicate detection, avoid returning whether an address already exists, require affirmative consent, allowlist the source, apply abuse controls, and return `Cache-Control: no-store`. The production implementation must define data ownership, retention, deletion/export handling, processor/subprocessor disclosures, contact details, and privacy/terms/cookie copy before the form is enabled. Until that review is complete, the landing form remains a product slice with an unavailable state rather than a claim of live registration.

## Shared data and compatibility boundaries

- Canonical content IDs and prototype definitions come from `packages/game-data`; clients must not invent production IDs locally.
- Telemetry event names and contexts remain platform-neutral in `packages/telemetry`; provider-specific delivery belongs in `packages/analytics`.
- Android `user://save_v1.json` is a local prototype save and is not a cloud API response. Migration between local schema versions and cloud schema versions requires an explicit adapter and tests.
- Environment variables, database URLs, provider credentials, signing material, and deployment paths are server configuration, never contract fields.

## Rollout and acceptance gate

Implementation begins only after this contract, privacy copy, retention rules, ownership, and abuse controls are reviewed. The first implementation should use a disposable synthetic player and synthetic Early Access addresses.

Required contract tests before a service is enabled:

1. validate success and error examples for every resource above;
2. prove token scoping prevents cross-player access;
3. prove idempotent retries do not duplicate registrations or cloud-save writes;
4. prove stale save revisions return `409` without data loss;
5. prove event allowlisting and redaction reject sensitive fields;
6. prove version-check failure does not delete or corrupt a local save;
7. prove Early Access disablement returns `503` with no persistence;
8. run the tests with disposable data and remove it after verification.

No endpoint implementation, database, secret, deployment change, DNS change, or public exposure is included in this design slice.
