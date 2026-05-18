# Stack Decisions

## Current Implementation Baseline

- Frontend: Next.js + TypeScript + Tailwind
- Backend: FastAPI + Pydantic v2
- Adapter/factory architecture for providers
- Env-backed settings and feature flags
- CI with JS and Python quality gates

## Target Enterprise Stack (Recommended)

### Frontend
- Next.js App Router (targeting Next.js 16 conventions)
- Server Components for low client bundle surfaces
- TypeScript strict mode, no `any` policy
- shadcn/ui + Tailwind for accessible primitives
- Zustand + TanStack Query for pragmatic client state and server state

### Backend
- FastAPI + Pydantic v2
- SQLAlchemy 2 async
- Alembic migrations
- LangGraph for explicit state-machine orchestration
- Ruff + mypy enforced in CI

### Observability and Reliability
- Langfuse for LLM traces and token/cost telemetry
- Sentry with pre-send PII scrubbing hooks
- Axiom for structured logs with PHI-safe patterns

### Data and Infra
- Neon Postgres (or Supabase Postgres in early stage)
- Pinecone for embeddings only (no raw PHI)
- Upstash Redis for rate limits/cache/session state

## Multi-LLM Extensibility Rule

The system must support provider failover:
- LLM selection goes through `LLMProvider` interface and factory
- Provider switch must require env/config change only
- Workflows must never hardcode one model vendor SDK path

## Provider Swap Policy

When replacing a service:
1. Implement provider class for the interface
2. Add mapping in factory
3. Change env key
4. Run contract and integration tests

No direct provider SDK calls in workflow/business modules.
