# Early Access Contract

Status: implementation slice, disabled by default pending privacy and contact review.

## Endpoint

`POST /api/early-access`

Request:

```json
{
  "email": "survivor@example.com",
  "consent": true,
  "source": "hero"
}
```

The endpoint accepts `hero` and `landing` as source values. Other values are normalized to `unknown`.

Success returns HTTP `202` with the stable response:

```json
{
  "status": "accepted"
}
```

The response deliberately does not reveal whether an email was already registered.

## Validation and safety

- The endpoint requires `application/json` and explicit consent.
- Email input is trimmed, lowercased, length-limited to 254 characters, and checked against a basic email shape.
- The response never echoes the submitted email.
- A process-local limit of five requests per client key per fifteen minutes is applied as a baseline. A shared rate limiter is required before public exposure at scale.
- Storage failures return a generic `503`; internal paths and error details are not exposed to the client.
- The route is Node.js-only and sends `Cache-Control: no-store`.

## Storage boundary

The feature is disabled unless `EARLY_ACCESS_ENABLED=true` is explicitly set. The storage path is selected in this order:

1. `EARLY_ACCESS_STORAGE_PATH`, when explicitly configured.
2. `/var/lib/the-infected/early-access.ndjson` in production.
3. A system temporary path during development.

Records contain only the normalized email, consent timestamp, source, and schema version. Production storage must remain outside the Git checkout and be readable only by the runtime user/group. The existing systemd sandbox already permits writes under `/var/lib/the-infected`; this branch does not change that service or enable the feature.

## Review gates before enabling

- Publish the final Privacy, Cookies, Terms, and Contact language.
- Confirm the retention period and deletion process.
- Provide a private data-request contact channel; public GitHub issues are not a data-request channel.
- Configure `EARLY_ACCESS_ENABLED=true` only in the reviewed server environment.
- Exercise success, invalid input, disabled, rate-limited, and storage-failure paths against the production build.
