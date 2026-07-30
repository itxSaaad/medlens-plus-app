# Resilience and Observability

Cross-cutting non-functional spec for every external-provider call (OCR, LLM, embedding, rerank, storage, DB) on the worker, and for the thin Vercel API layer. Applies on top of the topology in [`06-DEPLOYMENT_TOPOLOGY.md`](./06-DEPLOYMENT_TOPOLOGY.md); free-tier numbers in [`07-FREE_TIER_LIMITS.md`](./07-FREE_TIER_LIMITS.md). This is the single source of truth for reliability + observability.

## Circuit Breakers

- Wrap every provider with **`purgatory`** (async-native) on the worker: OCR, LLM, embedding, rerank, storage. Not `aiobreaker` (effectively abandoned — no release in 12+ months) and not `pybreaker` (weaker async story).
- Wrap the **provider**, not each individual call, so a broad provider outage fails fast instead of burning the retry budget and the daily free-tier quota. The breaker trips on repeated 5xx/timeouts and half-opens after a cooldown.
- On open circuit: return a non-2xx from `/process` so QStash's own retry/backoff handles redelivery later. The worker does **not** implement a second retry loop on top of QStash's delivery retries.

## Retries

- **`tenacity`** for transient failures, wrapping individual calls (complementary to the provider-level breaker above). Retry on: HTTP 429 (respecting `Retry-After`), 5xx, connection/timeout errors. Exponential backoff starting 1s, capped ~30s, with up to 2s random jitter; bounded attempt count.
- **Never** retry 400/401/403/404, validation errors, or content-policy refusals — these are deterministic; retrying wastes money and free-tier quota. Terminal errors go straight to `needs_review` / `review_queue_item`.

## Idempotency

- Idempotency key computed at upload time: `SET key <state> NX EX <ttl>` in Upstash Redis, keyed on **report content + pipeline version**, **not** the QStash message id (which changes per retry).
- The worker checks the key before processing. If `NX` fails, the job is already in-flight/done — return the stored result instead of recomputing. This is what stops a QStash redelivery from double-billing a scarce free-tier LLM call.

## Durable, Retriable Processing

- QStash is the durable/retriable/DLQ mechanism ([`06-DEPLOYMENT_TOPOLOGY.md`](./06-DEPLOYMENT_TOPOLOGY.md)) — no separate Postgres-based queue. Up to 5 retries (customizable via `Upstash-Retries`), 15-minute max response window, 3-day DLQ retention.
- Jobs that exhaust QStash's retries land in the DLQ and create a `review_queue_item` row (`reason = processing_failed`), surfaced in the admin review queue (`../product/06-DASHBOARD_SPEC.md`).

## Streaming and Backpressure

- **`StreamingResponse`** for large file upload/download — chunked (~1MB chunks), flat memory profile. Required both under the worker's memory budget and to keep the Vercel upload route sub-second.
- **LLM token streaming via SSE** (not WebSockets — cleaner for one-way token flow), masking free-tier model latency for summary generation. Use an `asyncio.Queue` between the LLM producer and the SSE consumer for backpressure.
- Known Starlette limitation: `GZipMiddleware` does **not** compress `StreamingResponse` (it needs the full body). Streamed endpoints go uncompressed — which is what you want for low-latency token chunks anyway.

## Compression

- `GZipMiddleware` on **normal JSON API responses only** (see the streaming caveat above).
- Large text columns (`ocr_text_raw` if retained transiently, summaries) rely on Postgres **TOAST** transparent compression (pglz/lz4) — no application-level compression. App-side compression would produce opaque, unqueryable bytes for negligible extra savings.
- File uploads (PDF/image) are already compressed formats — do not re-compress.

## Rate Limiting / Backpressure

- Per-user limiter backed by Upstash Redis, protecting the scarce LLM free quotas ([`07-FREE_TIER_LIMITS.md`](./07-FREE_TIER_LIMITS.md)): a **Lua token-bucket script** (atomic check-and-decrement in one round trip) or Upstash's own sliding-window ratelimiter.
- Single-instance limiter is sufficient at current scale; no distributed-limiter work is needed until the worker runs as more than one instance.

## Structured Logging and Tracing

- **OpenTelemetry SDK** instruments both the Vercel API surface and the worker (`opentelemetry-instrumentation-fastapi`, `-sqlalchemy`, `-httpx`), plus a span per LangGraph node (`../ai/04-LANGGRAPH_MIGRATION.md`).
- Export via **OTLP into Sentry** (ingests OTLP directly now) for error tracking + tracing, and to **Axiom** for structured logs/traces (500GB/month free — unifies logs across the split topology). Backends stay swappable without touching application code.
- **Trace context must survive the QStash hop:** inject W3C `traceparent`/`tracestate` into the QStash message headers before publishing (`TraceContextTextMapPropagator().inject(...)`), extract them at the worker's request entry, so one trace spans browser → Vercel API → QStash → worker → LLM call. Implement this in the queue-client wrapper, not per call site.
- Structured JSON logs carry `trace_id`/`span_id`. **PHI redaction is enforced at the logger boundary** (`packages/logger`, already redaction-aware — see `packages/logger/src/redact.ts`), never left to call-site discipline. The correlation ID is opaque, not a patient identifier.

## Health, Readiness, and Uptime

- Expand `/health` beyond a liveness ping to report live provider status: DB reachable, storage reachable, and each `purgatory` circuit breaker's open/closed state.
- Feeds the admin system-health widget (`../product/06-DASHBOARD_SPEC.md`), alongside free-tier quota indicators (LLM requests used today, Supabase storage %, worker CPU-hours / instance-hours this month).
- **Better Stack** free uptime monitoring pings the worker — it doubles as a keep-alive signal and, critically, alerts when the public-by-default HF Space has been suspended (otherwise invisible, since the worker is detached from Vercel).

## Graceful Degradation

- On LLM/OCR circuit-open: let QStash redeliver later; show the user an honest "processing delayed" state.
- Never silently fail a report or fabricate a result to mask a failure — a stalled-but-visible state is always preferred over a wrong one, consistent with `../product/03-GOLDEN_RULES.md`'s explicit-uncertainty requirement.

## SLO starters

- Upload success rate ≥ 99%
- Extraction completion ≤ 2 minutes p95 (excluding worker cold-start wake, which is async/invisible to the user)
- Summary generation success ≥ 98%
