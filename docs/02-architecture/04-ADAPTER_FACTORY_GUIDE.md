# Adapter and Factory Guide

## Goal

Allow replacing infrastructure services by adding new adapter classes, not rewriting core logic.

## Folder Conventions

- Interfaces: `apps/api/src/api/core/interfaces.py`
- Factories: `apps/api/src/api/core/factories.py`
- Providers: `apps/api/src/api/providers/<domain>/`
- Workflow orchestration: `apps/api/src/api/workflows/`
- Env + flags: `apps/api/src/api/core/settings.py`

## Current Provider Keys

- `AUTH_PROVIDER=supabase`
- `STORAGE_PROVIDER=supabase`
- `DB_PROVIDER=supabase_postgres`
- `OCR_PROVIDER=docling`
- `LLM_PROVIDER=openai`
- `EMBEDDING_PROVIDER=jina` — fallback `bge_small_en_v15`. Interface: `EmbeddingProvider.embed_text(text: str) -> list[float]`.
- `RERANK_PROVIDER=noop` — enable-later `bge_v2_m3`. Interface: `RerankProvider.rerank(query: str, candidates: list[str]) -> list[tuple[int, float]]`.

Both new interfaces live in `apps/api/src/api/core/interfaces.py` alongside the existing five; only used by the cross-report RAG feature (`../ai/01-EXTRACTION_PIPELINE.md`), never by per-report extraction.

### Embedding provider

| `EMBEDDING_PROVIDER` | Adapter                                                  | Notes                                                                                                                                                                                                                                                                                                            |
| -------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `jina` (default)     | Jina Embeddings v3, Matryoshka-truncated to **512 dims** | Hosted API, 1M tokens/month free tier — effectively unlimited at this corpus size. 512 is the pinned dimension: it must match the `vector(512)` column in [03-DATA_MODEL.md](./03-DATA_MODEL.md). MRL means the truncation point can be raised later without re-picking a model or re-indexing the model family. |
| `bge_small_en_v15`   | Self-hosted `bge-small-en-v1.5` on the worker            | Documented fallback for when the Jina API is unavailable/rate-limited or an air-gapped deployment is needed. **Not the default** — its native 384 dims do not match the `vector(512)` column, so enabling it requires a dedicated column/index and a re-embed migration, not just an env flip.                   |

`embed_text` returns a fixed-length `list[float]` sized to the active provider's configured dimension; the factory asserts the returned length matches the schema dimension so a misconfigured provider fails loudly at startup rather than writing malformed vectors.

### Rerank provider

| `RERANK_PROVIDER` | Adapter                                        | Notes                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `noop` (default)  | Identity pass-through                          | MVP does **not** rerank (see [02-STACK_DECISIONS.md](./02-STACK_DECISIONS.md) AI Pipeline). `rerank` returns candidates in their input order with a monotonically-decreasing passthrough score, so callers can wire the interface in now and enable a real reranker later with zero call-site change.                                                                    |
| `bge_v2_m3`       | Self-hosted BGE-Reranker v2-m3 (cross-encoder) | Enable-later option. **Apache-2.0**, chosen deliberately over Jina Reranker v2 (CC-BY-NC-4.0): this product may be commercialized, and a non-commercial-licensed model in the pipeline becomes a hard blocker at that point. A 568M-param cross-encoder does not fit free-tier worker RAM alongside Docling — enabling it is a hosting decision, not just a config flip. |

### Tenancy/RBAC adapter surface (DB provider)

The `supabase_postgres` DB provider exposes **two** client constructors, not one — this is the app-layer half of the row-level-security design in [03-DATA_MODEL.md](./03-DATA_MODEL.md#row-level-security), and business modules pick between them explicitly:

- **Request-scoped client** — initialized with the caller's JWT, used for _all_ patient/caregiver traffic. Every query runs under Postgres RLS with the caller's identity. This is the default; a service is never handed a raw connection.
- **Service-role client** — bypasses RLS at the Postgres level by design. The factory only hands it out inside FastAPI route handlers that are already admin-gated _and_ that have independently verified `admin`/`super_admin` against the database (never the JWT claim alone). The service-role key is a server-side env secret (`SUPABASE_SERVICE_ROLE_KEY`), never shipped to `apps/web`, rotated quarterly.

Do not add an `is_admin`-style branch to a shared client factory that silently widens a request-scoped client into a privileged one; the two clients are separate call paths so an admin bypass can never be reached from a patient session. Impersonation is its own audited admin endpoint (writes the audit row before returning data, queries the service-role client scoped to the target `patient_user_id`) — see 03-DATA_MODEL.md.

## Model and Queue/Cache Env Vars

- `LLM_MODEL_CLASSIFY`, `LLM_MODEL_EXTRACT`, `LLM_MODEL_SUMMARY` — OpenRouter model-id strings, set independently per stage so each can be swapped to a paid model on its own schedule (see `docs/03-ai/03-MODEL_PROVIDER_MATRIX.md`).
- `QSTASH_TOKEN`, `QSTASH_CURRENT_SIGNING_KEY`, `QSTASH_NEXT_SIGNING_KEY` — QStash publish + webhook-signature verification (`docs/02-architecture/06-DEPLOYMENT_TOPOLOGY.md`).
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — rate limiting, idempotency keys, job-status/LLM-response caching. Not a queue.

## Add a New Storage Provider Example

1. Create `providers/storage/s3_storage.py` implementing `FileStorageProvider`.
2. Add factory branch in `get_storage_provider`.
3. Set `STORAGE_PROVIDER=s3` in environment.
4. Run unit + integration tests.

## Feature-Flagged Workflow Controls

- `FF_ENABLE_OCR_FALLBACK`
- `FF_ENABLE_SCHEMA_VALIDATION`
- `FF_ENABLE_HISTORICAL_COMPARISON`
- `FF_ENABLE_DOCTOR_PACKET_EXPORT`
- `FF_REQUIRE_MANUAL_REVIEW_ON_VALIDATION_ERRORS`

These are loaded via `Settings.from_env()` and injected into `ReportProcessingWorkflow`.

## Hard Rule

Business modules (workflow/services) must depend on interfaces only, never concrete providers.
