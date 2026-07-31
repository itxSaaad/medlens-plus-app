# Deployment Topology

## Goal

Explain why the platform is split across Vercel and a separate worker, name the worker host and its fallback, and give the authoritative request lifecycle and failure-mode reference. `02-STACK_DECISIONS.md` links here rather than repeating this detail; free-tier numbers live in [`07-FREE_TIER_LIMITS.md`](./07-FREE_TIER_LIMITS.md); the cross-cutting reliability/observability spec is in [`08-RESILIENCE_AND_OBSERVABILITY.md`](./08-RESILIENCE_AND_OBSERVABILITY.md).

## Diagram

```text
Browser
  |
  v
Vercel ── Next.js (web) + FastAPI (thin routes only: auth, upload, read APIs,
  |        dashboard/admin APIs, QStash webhook receiver — nothing that loads an
  |        ML model or blocks >~1s)
  |                                   |
  |--- Supabase (Auth, Postgres+pgvector, Storage) via Supavisor pooled connection
  |--- Upstash Redis (rate limits, idempotency keys, job-status/LLM-response cache)
  |--- Upstash QStash (publish "process report" job)
  |
  v
QStash ──(HTTP delivery, retries + backoff, 15-min max response, DLQ on exhaustion)──>
  |
  v
Worker (default: Dockerized Hugging Face Space, CPU Basic — 16GB RAM / 2 vCPU;
  |     fallback: Render free, only with a lighter OCR engine — see below)
  |     gated by a shared-secret header + QStash signature verification
  |
  |     Docling OCR, LangGraph pipeline, LLM / embedding / rerank calls.
  |     Stateless: pulls the source file from Supabase Storage via signed URL,
  |     processes in memory, writes results back, persists nothing locally.
  |
  v
writes observations / trends / summary back to Supabase Postgres (pooled connection)
  |
  v
Vercel read APIs / Supabase Realtime ──> Browser (client polls or subscribes)
```

## Why the split is required

Vercel serverless functions: 10s duration (Hobby) / 60s (Pro), 250MB bundle cap, ephemeral filesystem, no persistent process between invocations. Docling's layout/table/OCR models plus native dependencies exceed the bundle budget, and OCR + a multi-step LangGraph/LLM pipeline routinely exceeds the duration budget **regardless of plan tier** — a Pro upgrade does not make this viable. Vercel therefore never runs heavy pipeline work; it only ever does sub-second I/O (auth check, signed-URL issue, DB row insert/read, publish a queue message). That is what makes the 10s/60s ceiling a non-issue rather than a constant risk: nothing that could approach it is allowed to run there.

## Worker host: Hugging Face Space (default), Render (fallback)

The default worker is a **Dockerized Hugging Face Space on CPU Basic** (16GB RAM / 2 vCPU / 2,000 CPU-hours/month free, sleeps after 48h idle). This is a deliberate change from a prior "Render" default. Docling's default pipeline needs ~2–4GB resident RAM in real-world use, which does **not** reliably fit Render free tier's 512MB cap — a real OOM risk that would surface late, during implementation. HF Spaces CPU Basic is the only free host that comfortably fits default Docling.

Two caveats to verify and enforce, not assume:

- **Pre-launch account check (blocking):** some newer HF free accounts are reportedly restricted to ZeroGPU-only and cannot create CPU-Basic Spaces. Verify on the actual account that a CPU-Basic Space can be created **before** committing to this host. If it can't, fall back to Render (below) or a paid CPU upgrade.
- **HF Spaces are public-by-default and demo-oriented.** The worker must stay fully stateless and PHI-free at rest: pull the source file from Supabase Storage via a short-lived signed URL, process it in memory, write the structured result back to Postgres, persist nothing on the Space. Gate the `/process` endpoint with a shared-secret header **and** QStash signature verification (`QSTASH_CURRENT_SIGNING_KEY` / `QSTASH_NEXT_SIGNING_KEY`) so only QStash can invoke it.

**Render free tier is the documented fallback**, viable only if the OCR engine is swapped to a lighter pipeline (RapidOCR/Tesseract instead of default Docling models) that fits 512MB. That swap must be a config change through the existing OCR-engine adapter/factory (`OCR_PROVIDER`, see [`04-ADAPTER_FACTORY_GUIDE.md`](./04-ADAPTER_FACTORY_GUIDE.md)), never a rewrite. Render specifics if used: 750 free instance-hours/month, spins down after 15min idle (~1min cold start), 5GB/month egress (cut from 100GB in April 2026).

## Why cold starts don't hurt UX

A spun-down HF Space (48h idle) or a spun-down Render instance (15min idle) is **not** a failure mode for this design, because QStash is a durable queue with retries: it re-delivers the job until the worker wakes and responds (its 15-minute max response window comfortably covers a cold start plus the full OCR+LLM pipeline). Report processing is already an async "processing…" state for the user, so wake latency is invisible to them. Stated plainly: **queue durability cancels out worker cold-start weakness** — this is why a sleeping free-tier worker is an acceptable production posture, not a gap to engineer around.

## Request lifecycle: report upload

1. Client uploads the file to Vercel's FastAPI upload endpoint.
2. Endpoint writes the file to Supabase Storage, inserts a `report_document` row (`review_status = pending`), and computes an idempotency key (`SET key <state> NX EX <ttl>` in Upstash Redis, keyed on **report content + pipeline version**, not the QStash message id).
3. Endpoint injects the current W3C `traceparent`/`tracestate` into the QStash message headers, publishes a QStash message (`POST /process` on the worker) carrying `document_id` + idempotency key, then returns immediately to the client.
4. QStash delivers to the worker. On failure (worker asleep, 5xx, timeout) QStash retries with backoff automatically (up to 5, customizable via `Upstash-Retries`); on repeated failure it moves the message to its DLQ (3-day retention).
5. Worker verifies the QStash signature + shared-secret header, extracts the trace context, checks the idempotency key in Redis (if `NX` fails, the job is already in-flight/done — return the stored result instead of recomputing), then pulls the file via signed URL and runs the LangGraph pipeline (`../ai/04-LANGGRAPH_MIGRATION.md`), writing observations, trends, and summary back to Supabase Postgres and updating `review_status`.
6. Client sees the update via polling a status endpoint or a Supabase Realtime subscription on `report_document`.

## Failure modes

| Scenario                                              | Behavior                                                                                                                                | Why it's acceptable                                                                                                                      |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Worker asleep/cold (HF 48h idle, Render 15min idle)   | QStash retries with backoff until the worker responds                                                                                   | Processing is already async and non-blocking; the UI shows a "processing" state, not a failure, during the wake window                   |
| QStash delivery fails after all retries               | Message lands in QStash's DLQ (3-day retention); a worker-side terminal-failure handler creates/updates a `review_queue_item` row       | Surfaces in the admin review queue instead of disappearing silently — see `../product/06-DASHBOARD_SPEC.md`                              |
| QStash retry re-delivers an in-flight/completed job   | Idempotency key (`NX` on report content + pipeline version) short-circuits reprocessing and returns the stored result                   | Stops a retry from double-billing a scarce free-tier LLM call                                                                            |
| Vercel function approaches its duration limit         | Should never happen — Vercel never performs OCR/LLM/pipeline work                                                                       | This row exists to make explicit that hitting the limit is a bug (heavy work leaked into a Vercel route), not a capacity problem to tune |
| Worker crashes mid-pipeline                           | QStash at-least-once delivery + the idempotency check in step 5 mean a re-delivered message resumes safely rather than corrupting state | Avoids a bespoke resumable-workflow mechanism for MVP                                                                                    |
| HF Space suspended (public-Space policy / abuse flag) | Better Stack uptime monitor alerts on the missed ping (`08-RESILIENCE_AND_OBSERVABILITY.md`)                                            | The worker is detached from Vercel, so a silent suspension would otherwise be invisible until reports stopped completing                 |

## Supabase connection + auto-pause

Both the Vercel functions and the worker connect to Postgres through the **Supavisor pooler in transaction mode**, using small pool sizes (e.g. 1–5 on Vercel, where every invocation is a fresh process). `pool_pre_ping=True` everywhere — poolers and serverless idle timeouts silently kill idle connections. Free Supabase projects auto-pause after 7 days of no activity; a scheduled keep-alive ping (e.g. a GitHub Actions cron hitting a lightweight read) prevents that. See [`07-FREE_TIER_LIMITS.md`](./07-FREE_TIER_LIMITS.md).

## Local development

Local dev runs via `docker-compose.dev.yml` (`../ops/01-LOCAL_AND_PROD_RUNTIME.md`), which brings up `postgres`, `redis`, `minio`, `api`, and `web` containers. Locally the `api` container plays both roles (thin routes + worker) — no need to run two services or a real HF Space. Two adjustments on top of the existing compose setup:

- **QStash:** use its local development mode (CLI/emulator that delivers to `http://localhost:<port>/process` without a public URL), or bypass the hop entirely by calling the worker's `/process` directly from the upload handler, gated behind `QSTASH_ENABLED=false` so the queue hop is _skipped_, not mocked.
- **Redis:** the existing local `redis` container satisfies rate-limiting/idempotency/caching — no Upstash account needed for local dev.

Supabase is used directly (shared dev project or the Supabase CLI's local stack) rather than MinIO once storage-dependent features are implemented; MinIO in the existing compose file remains the offline/no-network fallback.
