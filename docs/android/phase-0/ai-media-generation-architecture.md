# AI Media Generation Architecture

**Status:** Architecture and documentation decision only. No deployment or implementation occurred during Phase 0.

## 1. Purpose of Open-Generative-AI

We have decided to standardize on the following open-source repository as our centralized AI media generation layer:

**Repository:** https://github.com/anil-matcha/Open-Generative-AI

Open-Generative-AI provides a unified media-generation interface so we do not need to maintain dozens of unrelated provider integrations. It supports capabilities such as:

- Image generation
- Video generation
- Creative media workflows
- Provider selection
- Generation-job management
- Supported future media capabilities

## 2. What It Is Not

Open-Generative-AI will **not** become the foundation of The Infected or any of our applications.

- It is **not** our game engine
- It is **not** our backend
- It is **not** our gameplay systems
- It is **not** embedded in the Android APK or web frontend
- It does **not** replace FFmpeg, Python/Pillow/Cairo, Voicebox, Godot VideoStreamPlayer, or our cinematic manifests

Our applications and backend architecture remain independent from this repository.

## 3. No-Local-GPU Decision

Effective immediately:

- We will **not** deploy or maintain local GPU infrastructure
- We will use our existing backend servers as the orchestration layer
- AI inference will be performed by our existing cloud providers
- No application should communicate directly with an external AI provider

## 4. Backend Orchestration Responsibilities

Our backend will handle:

- Authentication
- Authorization
- Request routing
- Model selection
- Provider failover
- Rate limiting
- Logging
- Usage tracking
- Security controls
- Caching where appropriate
- Generation-job status
- Normalized provider responses
- Cost and quota enforcement

## 5. Provider Order

Our current AI provider stack:

| Priority | Provider | Use |
| --- | --- | --- |
| Primary | Langdock | General AI inference |
| Secondary | Anymize | General AI inference (failover) |
| Tertiary | Logicc | General AI inference (failover) |
| Specialized | Meshy | 3D character generation, infected models, survivors, weapons, gear, environmental objects, promotional 3D assets |

Additional cloud services may be integrated for specialized tasks.

The backend must remain the source of truth for provider routing.

## 6. Provider-Failover Design

```
Internal tool / approved application request
        ↓
Our backend API
        ↓
Authentication and authorization
        ↓
Media-generation request normalization
        ↓
Provider router
        ↓
Langdock / Anymize / Logicc / Meshy
        ↓
Generated asset validation
        ↓
Secure storage
        ↓
Asset manifest and provenance record
        ↓
Approved project pipeline
```

If the primary provider (Langdock) fails or is unavailable, the backend routes to the secondary (Anymize), then tertiary (Logicc). Meshy is used for specialized 3D generation tasks independently of the general failover chain.

Open-Generative-AI must **not** bypass our backend and communicate directly with providers from a public client.

## 7. Credential-Security Boundary

Provider credentials must **never** be placed inside:

- The Android APK
- The web frontend
- Client-side JavaScript
- Godot resources
- Public repositories

All provider credentials are stored securely in the backend and accessed only through the backend API.

## 8. The Infected Use Cases

For The Infected, this platform may support the development and content-production pipeline for:

- Cinematic artwork
- Level-introduction source images
- Trailers
- Promotional videos
- Story development
- Mission writing
- Character dialogue
- Voicebox narration scripts
- Infected concepts
- Survivor concepts
- Environment artwork
- Weapon and gear presentation
- Marketing content
- Social-media assets

It may also help prepare source materials for the CPU-based cinematic pipeline.

## 9. Offline-Gameplay Boundary

Core gameplay must remain independent from real-time AI inference.

The APK must **not** require Langdock, Logicc, Anymize, Meshy, or Open-Generative-AI to:

- Launch
- Load a level
- Move the player
- Fight infected
- Use weapons
- Manage inventory
- Save progress
- Play level cinematics
- Complete missions
- Work offline

AI may later support intentionally designed online features, but those must be optional, separately reviewed, and protected by backend controls.

Pre-generated content is preferred for the initial APK.

## 10. Relationship to the Cinematic Pipeline

The approved level-cinematic pipeline remains:

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

Open-Generative-AI does not replace: FFmpeg, Python/Pillow/Cairo, Voicebox, Godot VideoStreamPlayer, our cinematic manifests, our backend, our game engine, or our gameplay systems.

## 11. Asset Provenance Requirements

Every asset generated through the AI media platform must have:

- Source provider recorded
- Generation model/version recorded
- Generation date recorded
- Prompt or source material recorded (where applicable)
- License and commercial-use status verified
- SHA-256 hash recorded
- Storage location recorded
- Approval status recorded

## 12. Future Integration Plan

When approved later, use a separate service or repository rather than embedding the entire platform inside the Android or web application codebase.

### Proposed Service Architecture

```
Open-Generative-AI service
        ↓
Private backend network/API
        ↓
Provider adapters
        ↓
Secure generated-asset storage
        ↓
Project asset pipelines
```

The service must support provider abstraction so a project is not permanently tied to one vendor.

### Proposed Provider-Adapter Interface

Each provider adapter must implement:

- `generate(request: GenerationRequest) -> GenerationJob`
- `get_job_status(job_id: string) -> JobStatus`
- `get_result(job_id: string) -> GenerationResult`
- `cancel_job(job_id: string) -> bool`
- `list_capabilities() -> Capability[]`

### Proposed Backend Endpoints

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/media/generate` | POST | Submit a generation request |
| `/api/media/jobs/{id}` | GET | Check job status |
| `/api/media/jobs/{id}/result` | GET | Retrieve generation result |
| `/api/media/jobs/{id}` | DELETE | Cancel a job |
| `/api/media/capabilities` | GET | List available providers and capabilities |
| `/api/media/assets/{id}` | GET | Retrieve a generated asset |
| `/api/media/assets/{id}/provenance` | GET | Retrieve asset provenance record |

### Authentication and Authorization Design

- All endpoints require authentication (API key or OAuth token)
- Role-based access control (admin, developer, service)
- Per-project API keys with scoped permissions
- Rate limiting per key and per project
- Audit log for all generation requests

### Rate-Limit and Quota Design

- Per-key rate limit (requests per minute)
- Per-project monthly quota (generation count or cost)
- Provider-specific rate limits (respect provider API limits)
- Quota enforcement with overage protection
- Usage alerts at 80% and 95% of quota

### Logging and Usage-Tracking Design

- All requests logged with: timestamp, user, project, provider, model, request type, cost
- Usage metrics: generation count, success/failure rate, average latency, cost per generation
- Retention: 90 days for request logs, 12 months for usage aggregates
- Exportable usage reports per project and per provider

### Asset-Storage and Provenance Design

- Generated assets stored in secure cloud storage (S3-compatible)
- Each asset has a provenance record: provider, model, prompt, generation date, license, commercial-use status, SHA-256, storage URL
- Assets are immutable once stored
- Access controlled via signed URLs with expiration
- Asset manifest updated atomically with provenance record

## 13. Licensing Review Status

| Component | License | Commercial Use | Review Status |
| --- | --- | --- | --- |
| Open-Generative-AI | To be verified from repository | To be verified | [Pending external evidence] |
| Langdock | Per provider agreement | Per provider agreement | [Pending external evidence] |
| Anymize | Per provider agreement | Per provider agreement | [Pending external evidence] |
| Logicc | Per provider agreement | Per provider agreement | [Pending external evidence] |
| Meshy | Per Meshy ToS | Paid plan: permitted without attribution. Free plan: CC BY 4.0 | [Pending external evidence] |

All licensing must be reviewed and verified before implementation begins.

## 14. Risks and Blockers

| Risk | Severity | Notes |
| --- | --- | --- |
| Open-Generative-AI license not yet verified | Medium | Must review repository LICENSE file before integration |
| Provider availability not guaranteed | Medium | Failover design mitigates but does not eliminate provider downtime |
| Cost of AI inference at scale | Medium | Quota and rate-limit design needed before production use |
| Provider API changes | Low | Provider abstraction layer insulates from vendor lock-in |
| Credential security | High | Credentials must never be exposed in client-side code or public repositories |

## 15. Phase 0 Boundary

This is currently an architecture and documentation decision only.

**Do not yet:**

- Clone Open-Generative-AI into the application repository
- Deploy it
- Modify its code
- Connect provider credentials
- Create public endpoints
- Integrate it into the Android APK
- Add runtime AI dependencies
- Begin live inference features
- Expose it directly to the frontend

**During Phase 0, only document:**

- Proposed integration
- Security boundaries
- Provider adapters
- Required backend endpoints
- Licensing considerations
- Deployment options
- Implementation phases

Implementation begins only after Phase 0 is approved.

## 16. Confirmation

- No deployment or implementation occurred
- PR #66 remains Draft and unmerged
- No application or gameplay code changed
- No provider credentials were connected
- No runtime AI dependencies were added