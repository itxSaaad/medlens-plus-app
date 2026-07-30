# Configuration and Feature Flags

## Config Source of Truth

Backend runtime config is loaded from:

- `apps/api/src/api/core/settings.py`

Use:

- root `.env.example`
- `apps/api/.env.example`
- `apps/web/.env.example`

## Provider Selection (Factory-backed)

- `AUTH_PROVIDER` (e.g. `supabase`)
- `STORAGE_PROVIDER` (e.g. `supabase`)
- `DB_PROVIDER` (e.g. `supabase_postgres`)
- `OCR_PROVIDER` (e.g. `docling`; swap to `rapidocr`/`tesseract` for the Render fallback worker's 512MB cap — see `../architecture/06-DEPLOYMENT_TOPOLOGY.md`)
- `LLM_PROVIDER` (e.g. `groq` primary; `openrouter`/`gemini` fallbacks)
- `EMBEDDING_PROVIDER` (e.g. `jina`; fallback `gemini`) — cross-report RAG only, never per-report extraction
- `RERANK_PROVIDER` (e.g. `bge`; stubbed no-op adapter in MVP, swappable to `cohere` later)

These map to factory methods in `apps/api/src/api/core/factories.py`. Full adapter contract and swap rules: [`../architecture/04-ADAPTER_FACTORY_GUIDE.md`](../02-architecture/04-ADAPTER_FACTORY_GUIDE.md).

## Per-Stage LLM Model Selection

Set independently so each pipeline stage can move to a paid model on its own schedule (fallback-chain policy in `../ai/03-MODEL_PROVIDER_MATRIX.md`):

- `LLM_MODEL_CLASSIFY`
- `LLM_MODEL_EXTRACT`
- `LLM_MODEL_SUMMARY`

## Queue, Cache, and Worker Secrets

- `QSTASH_TOKEN` — publish messages to QStash from Vercel routes
- `QSTASH_CURRENT_SIGNING_KEY`, `QSTASH_NEXT_SIGNING_KEY` — verify QStash webhook signatures on the worker's `/process` endpoint
- `QSTASH_ENABLED` — set `false` locally to skip the queue hop (call the worker directly), not mock it (`../architecture/06-DEPLOYMENT_TOPOLOGY.md`)
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — rate limiting, idempotency keys, job-status/LLM-response cache. Not a queue, not session state
- `WORKER_SHARED_SECRET` — shared-secret header gating the worker's `/process` endpoint (HF Spaces are public-by-default)

## Observability and Email

- `SENTRY_DSN` — OTLP error/trace ingest (both Vercel surface and worker)
- `AXIOM_TOKEN`, `AXIOM_DATASET` — structured logs/traces
- `OTEL_EXPORTER_OTLP_ENDPOINT` — OpenTelemetry OTLP export target
- `RESEND_API_KEY` — transactional email (waitlist, magic-link/OTP, report-ready)

## Feature Flags

- `FF_ENABLE_OCR_FALLBACK`
- `FF_ENABLE_SCHEMA_VALIDATION`
- `FF_ENABLE_HISTORICAL_COMPARISON`
- `FF_ENABLE_DOCTOR_PACKET_EXPORT`
- `FF_REQUIRE_MANUAL_REVIEW_ON_VALIDATION_ERRORS`

## Current Flag Effects in Code

- OCR fallback path in workflow: `FF_ENABLE_OCR_FALLBACK`
- Validation error insertion when no observations: `FF_ENABLE_SCHEMA_VALIDATION`
- Historical comparison step enable/disable: `FF_ENABLE_HISTORICAL_COMPARISON`
- Manual review gating for validation errors: `FF_REQUIRE_MANUAL_REVIEW_ON_VALIDATION_ERRORS`

## Enterprise Guidance

- Keep production flags in secret manager/config service (not git).
- Use staged rollouts by deployment environment (preview/staging/production), not by branch — trunk-based development has a single branch, so flags (not branches) gate what's visible where.
- Track all flag changes in release notes.
