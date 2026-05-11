# Stack Decisions

## Objectives

- Free to start
- Fast weekend development
- Production migration path to cloud
- Easy service replacement with minimal code changes

## Chosen Stack (MVP)

- UI: Next.js + TypeScript + Tailwind
- Auth: Supabase Auth
- Storage: Supabase Storage
- API: FastAPI + Pydantic
- DB: Supabase Postgres
- Workflow orchestration: LangGraph
- OCR: Docling + fallback strategy
- LLM provider abstraction: OpenAI-compatible provider layer
- Observability: OpenTelemetry + Sentry
- IaC: Terraform modules from day zero

## Why This Works Long-Term

- Initial cost stays low with managed free tiers.
- Service dependencies are abstracted by provider interfaces + factories.
- Cloud migration is incremental and controlled.

## Provider Swap Policy

When replacing a service:
1. Create provider class implementing the interface.
2. Register provider in factory.
3. Switch provider via environment variable.
4. Run provider contract tests.

No direct provider SDK calls should appear in workflow/business modules.
