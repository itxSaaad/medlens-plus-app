# Deployment Strategy

How MedLens+ is deployed today and the paid-tier path when free limits are outgrown. The authoritative topology, request lifecycle, and failure modes are in [`../architecture/06-DEPLOYMENT_TOPOLOGY.md`](../02-architecture/06-DEPLOYMENT_TOPOLOGY.md); per-service free-tier numbers and upgrade triggers are in [`../architecture/07-FREE_TIER_LIMITS.md`](../02-architecture/07-FREE_TIER_LIMITS.md). This file is the ops-level summary — it must not diverge from those two.

## Phase 1 — Free tier (current)

The platform is deliberately **split**: Vercel runs only thin, sub-second work; a separate worker runs everything heavy. See `06-DEPLOYMENT_TOPOLOGY.md` for why (Vercel's 10s/60s duration and 250MB bundle caps make Docling/LangGraph/LLM work impossible there regardless of plan).

| Concern                          | Service (free tier)                                              | Notes                                                                                                                                                                                |
| -------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Web + thin API                   | **Vercel Hobby**                                                 | Next.js web app + FastAPI thin routes (auth, upload, read/admin APIs, QStash webhook receiver)                                                                                       |
| Worker                           | **Dockerized Hugging Face Space, CPU Basic** (default)           | 16GB RAM / 2 vCPU — the only free host that fits default Docling (~2–4GB RAM). Fallback: **Render free**, viable only with a lighter OCR engine (see below)                          |
| DB / Auth                        | **Supabase** free tier                                           | 500MB Postgres + pgvector, Auth, connected via Supavisor pooler (transaction mode) from both Vercel and worker                                                                       |
| Storage                          | **Supabase Storage** free tier                                   | 1GB. **Not Cloudflare R2** — storage is unified in Supabase. Source files are pulled by the worker via signed URL and **not persisted past processing** (PHI-minimization + 1GB cap) |
| Queue / dispatch                 | **Upstash QStash**                                               | Durable HTTP queue between Vercel and worker; retries + DLQ absorb worker cold starts                                                                                                |
| Cache / rate-limit / idempotency | **Upstash Redis**                                                | Never a queue, never session state                                                                                                                                                   |
| Email                            | **Resend**                                                       | Waitlist, magic-link/OTP, report-ready notices (or Supabase auth mailer for OTP)                                                                                                     |
| Observability                    | **Sentry** (OTLP) + **Axiom** (logs) + **Better Stack** (uptime) | See [`../architecture/08-RESILIENCE_AND_OBSERVABILITY.md`](../02-architecture/08-RESILIENCE_AND_OBSERVABILITY.md)                                                                    |
| CI/CD                            | **GitHub Actions**                                               | Unlimited standard-runner minutes while the repo is public                                                                                                                           |
| Domain / DNS / TLS               | Registrar (~$10–12/yr) + **Vercel** DNS/TLS (free)               | Only non-free line item                                                                                                                                                              |

### Worker host detail

Default is the **HF Space (CPU Basic)**. Two conditions gate it: (a) verify pre-launch that the HF account can create a CPU-Basic Space — some new free accounts are ZeroGPU-only; (b) keep the Space stateless and PHI-free at rest, gated by a shared-secret header plus QStash signature verification.

**Render free tier is the documented fallback**, viable only when the OCR engine is swapped to a lighter pipeline (RapidOCR/Tesseract) that fits Render's 512MB cap. That swap is a config change through the `OCR_PROVIDER` adapter (`../architecture/04-ADAPTER_FACTORY_GUIDE.md`), not a rewrite. Full rationale in `06-DEPLOYMENT_TOPOLOGY.md`.

### Why cold starts are acceptable

A sleeping worker (HF: 48h idle; Render: 15min idle) is not a failure: QStash re-delivers until the worker wakes, and processing is already an async "processing…" state to the user. Queue durability cancels out worker cold-start weakness.

## Phase 2 — Paid scale

Upgrades are plan/key changes, not rewrites — triggers are enumerated in `07-FREE_TIER_LIMITS.md`. In order of likely need:

1. **OpenRouter $10 lifetime top-up** (50 → 1,000 req/day) — cheapest reliability upgrade; do this early.
2. **Supabase Pro** ($25/mo — 8GB DB, 100GB storage, no auto-pause) when DB > 500MB or auto-pause becomes unacceptable.
3. **Worker**: paid HF CPU upgrade, or Render $7/mo (512MB, lighter OCR) / $25/mo (2GB) when CPU-hours run out or the Space is suspended.
4. **QStash / Upstash Redis** pay-as-you-go past 1,000 msgs/day or 500K commands/mo.
5. **Sentry Team** ($26/mo) past 5,000 errors/mo; **Resend** ($20/mo) past 100 emails/day; **Vercel Pro** before charging real users (Hobby ToS is non-commercial); **GitHub Team** only if the repo goes private with heavy CI.

A wholesale cloud migration (AWS/GCP) is explicitly **not** on the near-term roadmap — the adapter/factory boundaries keep it possible, but the Supabase + Upstash + worker split scales well past portfolio traffic on managed free/cheap tiers.

## Deployment mechanics

- Trunk-based: branch from `main`, PR back to `main` (squash merge). PR-only merges, auto-merge disabled.
- Vercel auto-deploys `main` (production) and PR previews. The worker deploys from its Dockerfile to the HF Space (or Render) on merge.
- Secrets/config live in each host's env store, not git — see [`02-CONFIGURATION_AND_FLAGS.md`](./02-CONFIGURATION_AND_FLAGS.md).
- Never bypass medical safety guardrails as part of any deploy or rollback.
