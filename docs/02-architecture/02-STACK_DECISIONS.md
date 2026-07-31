# Stack Decisions

> Re-derived July 2026 against current official docs/pricing (not carried forward
> unexamined from the prior pass). Where this update changes a prior conclusion, the
> change and why are called out explicitly — see "What Changed" at the bottom.

## Current Implementation Baseline

- Frontend: Next.js + TypeScript + Tailwind
- Backend: FastAPI + Pydantic v2
- Adapter/factory architecture for providers
- Env-backed settings and feature flags
- CI with JS and Python quality gates

Zero of the target stack below is implemented yet beyond these scaffolds — no Alembic
migrations, no LangGraph, no embedding/rerank providers, no dashboard UI exist in code.
This document is the target, not a status report.

## Target Production Stack

### Frontend

- Next.js 16 App Router, React Server Components by default for read-only/aggregate
  views; client-side data fetching (TanStack Query) reserved for the interactive
  per-upload detail view only — not the whole app. Rationale and cache-safety rules
  (critical for a multi-tenant PHI app — Next.js's `fetch` cache and tag-based
  revalidation must never be shared across users) are in
  [05-SHARED_PACKAGES_STRATEGY.md](./05-SHARED_PACKAGES_STRATEGY.md) and
  [06-DASHBOARD_SPEC.md](../01-product/06-DASHBOARD_SPEC.md).
- TypeScript strict mode, no `any` policy
- shadcn/ui + Tailwind v4 + Radix — confirmed still the standard choice for a
  fast-moving small team in 2026: copy-in source (no vendor lock-in, zero runtime
  cost), RSC-friendly, accessible-by-default primitives (matters for a health product's
  WCAG obligations).
- Zustand (client-only state: filters, impersonation banner, UI panels) + TanStack
  Query (server state) — confirmed still the 2026 default pairing, and it carries
  forward unchanged into the future Expo app.
- Charting: **Recharts** on web. Not shared with mobile — Recharts renders to SVG/DOM
  and cannot run on React Native. What _is_ shared cross-platform is the data-shaping
  logic (series/flag computation), not the chart component itself; mobile picks its own
  native-renderer chart library (Victory Native XL or similar) when it's built.

### Backend

- FastAPI + Pydantic v2, structured with **lifespan-managed** engine/session-factory
  singletons (not the deprecated `@app.on_event`) and request-scoped DI sessions via
  `Depends`. `pool_pre_ping=True` everywhere — idle connections get silently killed by
  poolers and serverless idle timeouts, the single most common async-FastAPI production
  bug.
- SQLAlchemy 2 async + **Alembic, using the official async template**
  (`alembic init -t async`) — Alembic has no native async API; the async template wires
  a sync migration context through `run_sync`. A `MetaData(naming_convention=...)` is
  set before the first autogenerate so future diffs don't churn constraint names.
  Autogenerate does not detect renames, server-default changes, or enum value changes —
  every generated revision is hand-reviewed, and data backfills use expand/contract
  (add nullable → backfill → enforce constraint), never a single migration against a
  populated table. CI runs `upgrade head && downgrade base && upgrade head` as a gate.
  Seed/reference data (lab reference ranges, unit dictionaries, LOINC synonym table) is
  idempotent data migrations, not a bespoke seed script — kept version-controlled and
  reversible alongside schema, as before.
- LangGraph for explicit state-machine orchestration — re-validated, not just carried
  forward (see AI Pipeline section). Kept because the pipeline's actual shape
  (conditional low-confidence → human-review routing, checkpointed resume) is exactly
  LangGraph's fit, not because it's fashionable.
- `tenacity` for retry (the maintained 2026 standard; classify 429/5xx/timeouts as
  retriable, 4xx/validation/content-policy refusals as terminal, exponential backoff +
  jitter) and `purgatory` for async circuit breaking (`aiobreaker` is effectively
  abandoned — no release in 12+ months; `pybreaker`'s async story is a bolt-on).
  `tenacity` wraps individual calls; `purgatory` wraps the provider so a broad outage
  fails fast instead of burning the retry budget and the daily free-tier quota. Full
  spec in [08-RESILIENCE_AND_OBSERVABILITY.md](./08-RESILIENCE_AND_OBSERVABILITY.md).
- Ruff + mypy enforced in CI

Rejected: SQLModel (lags SQLAlchemy/Pydantic releases, Alembic support is a thin
wrapper, not native) and Piccolo (immature migration system — hand-written migrations,
no branching/multi-head merge), both wrong tradeoffs for a project that treats schema
history as an audit trail.

### Observability and Reliability

- **OpenTelemetry SDK in both the Vercel API surface and the worker**, exporting via
  OTLP into **Sentry** (which now ingests OTLP directly), giving error tracking +
  tracing on Sentry's free Developer tier without vendor lock-in — the instrumentation
  stays swappable to a different backend later without touching application code.
- **Axiom** for structured logs (500GB/month free — comfortably unifies logs from the
  split Vercel-function / external-worker topology in one queryable place).
- The trace must survive the async **QStash** hop: the Vercel function injects the W3C
  `traceparent`/`tracestate` into the QStash message headers before publishing; the
  worker extracts it on receipt so one trace spans browser → Vercel API → QStash →
  worker → LLM call. This is the concrete mechanism, not just an aspiration — implement
  it as part of the queue client wrapper, not left to each call site.
- **No PHI in logs, ever** — enforced at the logger boundary (`packages/logger`), not
  left to call-site discipline.
- Full non-functional spec (circuit breakers, retries, idempotency, streaming,
  compression): [`08-RESILIENCE_AND_OBSERVABILITY.md`](./08-RESILIENCE_AND_OBSERVABILITY.md)

### Data and Infra

- Supabase Postgres (Auth + Storage + DB) — the only DB, no Neon migration planned;
  free tier today (500MB DB, 1GB storage, 50,000 MAU, pgvector included at no
  surcharge), upgrade is a plan-tier change only (see
  [`07-FREE_TIER_LIMITS.md`](./07-FREE_TIER_LIMITS.md)). Two operational rules the free tier
  forces on the design, not optional hardening: (1) **do not persist uploaded source
  files** past processing — parse, extract, delete, so the 1GB storage cap and raw-PHI
  exposure both stay bounded; (2) free projects **auto-pause after 7 days of
  inactivity** — mitigate with a lightweight scheduled keep-alive ping.
- **pgvector inside Supabase Postgres** for all embeddings, HNSW index (not IVFFlat —
  HNSW needs no tuning and gives strong recall at this corpus size; IVFFlat only wins
  on very large, mostly-static datasets this product will not reach for years).
- **Upstash Redis** for rate limits, idempotency keys, and job-status/LLM-response
  caching only — it is not a queue. Idempotency is the concrete mechanism that stops a
  QStash retry from double-billing an LLM call: `SET key <state> NX EX <ttl>` keyed on
  report content + pipeline version, not on the QStash message id.
- **Upstash QStash** as the durable job queue between Vercel and the worker — 1,000
  messages/day free, 15-minute max response duration (the worker can legitimately hold
  the connection open for the full OCR+LLM pipeline), 5 retries + dead-letter queue.

### AI Pipeline

- **PDF parsing**: Docling remains the correct choice for tabular lab reports — ranks
  above PyMuPDF4LLM for table-structure preservation, which matters directly for
  value/unit/range extraction. Fast path: Docling's `SimplePipeline` (text-layer only)
  for digitally-generated PDFs; full layout+table+OCR pipeline for scanned/photographed
  reports. Must run on the worker, never in a Vercel function.
- **Worker host — reconfirmed with a real change**: default worker is a **Dockerized
  Hugging Face Space (CPU Basic)**, not Render. Docling's default pipeline is
  RAM-heavy (~2–4GB resident in real-world use) and does not reliably fit Render free
  tier's 512MB. HF Spaces CPU Basic gives 16GB RAM / 2 vCPU / 2,000 CPU-hours/month free
  — the only free host that actually fits default Docling. Full rationale, the Render
  fallback path (viable only if the OCR engine is swapped to a lighter pipeline), and
  the OCR-engine adapter boundary that makes that swap a config change: see
  [`06-DEPLOYMENT_TOPOLOGY.md`](./06-DEPLOYMENT_TOPOLOGY.md).
- **LLM — provider order changed from a single default to a policy-driven fallback
  chain**, because the research surfaced a real constraint the prior pass didn't
  weigh: **free-tier LLM providers differ in whether they train on submitted
  prompts**, and this product's inputs are health data. Default chain, each provider
  behind the existing `LLMProvider` adapter, selected independently per pipeline stage
  via `LLM_MODEL_*` env vars:
  1. **Groq** (Llama 3.3 70B) — primary for any stage that sees report content
     (extraction, explanation). Fast, generous free daily cap, no training-on-prompts
     concern for the free tier.
  2. **OpenRouter free models** (DeepSeek-R1, Gemma) — secondary/fallback for model
     diversity and when Groq is rate-limited or circuit-broken. Note the free-tier cap
     is a real constraint: 50 requests/day by default, raised permanently to 1,000/day
     after a one-time $10 top-up — budget for that top-up early, it is the cheapest
     reliability upgrade available.
  3. **Google Gemini (AI Studio) free tier** — explicitly **last resort and opt-in
     only**, restricted to stages that do not see PHI (e.g., generic FAQ copy), because
     Google's free-tier terms permit training on submitted prompts. Never route
     report content or user health data through it without a paid key that carries a
     no-training guarantee.
     Every provider swaps via env var only, per the existing adapter/factory rule — this
     fallback _order_ is policy, not new code paths.
- **Embeddings**: Jina Embeddings v3, **Matryoshka-truncated to 512 dims** (revised from
  a prior 256-dim plan — 512 is the better balance of pgvector storage/index memory
  against retrieval quality at this corpus size; MRL means the truncation point can be
  raised later without re-picking a model), free tier (1M tokens/month — effectively
  unlimited at this product's per-user corpus size of a few hundred short strings).
  **Not used for per-report field extraction** — that's a closed-world single-document
  problem solved by LLM structured output + deterministic validation, where retrieval
  has no role. The retrieval unit itself is a synthetic per-observation/per-report
  summary string built from already-extracted structured rows, never raw OCR text —
  chunking raw OCR would reintroduce the vendor-layout noise extraction exists to
  remove.
- **RAG + reranking — first-class, scoped deliberately**: reserved for the cross-report
  "ask your health history" feature, where retrieval is a real problem (which of a
  user's many reports is relevant to their question). Pipeline: Postgres full-text
  search (`tsvector`/`ts_rank_cd`) run in parallel with pgvector HNSW cosine search,
  fused with **Reciprocal Rank Fusion** (not weighted sum — RRF needs no cross-scale
  score normalization). **Reranking is a stubbed no-op adapter in MVP**, not wired up —
  a corpus of one user's few hundred clean summary strings doesn't need a cross-encoder
  rerank pass to get right answers, and self-hosting one on the free worker isn't
  actually free (568M-param models don't fit alongside everything else). When reranking
  is justified later, **BGE-Reranker v2-m3** (Apache-2.0) is the pinned choice —
  deliberately not Jina Reranker v2 (CC-BY-NC-4.0), since this product may be
  commercialized later and a non-commercial-licensed model in the pipeline becomes a
  blocker at that point, not before. Hybrid search + reranking is explicitly **not**
  applied to single-report extraction/classification/summary generation.
- **Structured extraction for template-agnostic reports**: hybrid — Docling
  layout/OCR → LLM structured output (JSON-schema/constrained decoding, the current
  best practice for reliable field extraction, not prompt-only JSON) as the primary
  semantic field-matcher → a deterministic post-pass that canonicalizes the extracted
  test name against a curated alias table (fuzzy match into a controlled vocabulary —
  this is where fuzzy matching belongs, as normalization, not as the primary
  extraction mechanism), checks unit sanity and physiological plausibility, and
  computes a **per-field** confidence score with a `requires_human_review` boolean —
  field-level, not report-level, so one bad field routes only that field to review.
  Canonical field identity uses **LOINC codes** (free to use, including commercially,
  in perpetuity — cost is not a blocker), populated via a hand-curated internal
  synonym→LOINC mapping table scoped to the panel types this product actually supports
  (LFT, CBC, KFT, etc.), not runtime auto-mapping. Full mechanics:
  [`../ai/01-EXTRACTION_PIPELINE.md`](../03-ai/01-EXTRACTION_PIPELINE.md).
- **Where RAG explicitly does not belong**: per-report extraction, green/yellow/red flag
  computation (must be deterministic rule-based comparison against reference ranges —
  an LLM must never decide a flag color), and timeline/trend computation (SQL
  aggregation over `lab_observation` rows). Even in the RAG-justified Q&A feature,
  numeric trend math stays deterministic SQL — the LLM interprets and phrases, it does
  not compute.

## Multi-LLM Extensibility Rule

The system must support provider failover:

- LLM selection goes through `LLMProvider` interface and factory
- Provider switch must require env/config change only
- Workflows must never hardcode one model vendor SDK path
- The Groq → OpenRouter → Gemini fallback chain above is implemented as this same
  factory mechanism, triggered by circuit-breaker state, not a special case

## Provider Swap Policy

When replacing a service:

1. Implement provider class for the interface
2. Add mapping in factory
3. Change env key
4. Run contract and integration tests

No direct provider SDK calls in workflow/business modules.
