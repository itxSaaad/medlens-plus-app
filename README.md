# MedLens+

MedLens+ is an AI-powered medical report intelligence platform that turns scattered lab reports into a longitudinal, doctor-ready health timeline.

## Why MedLens+ Exists
Most tools can "chat with a PDF." MedLens+ is different:
- Tracks report-to-report changes over time
- Flags out-of-range values based on source report ranges
- Builds patient-friendly explanations and doctor-ready summaries
- Surfaces trend risks and missing information without diagnosis claims
- Creates structured medical memory for patients and caregivers

## Product Principles
- Safety first: no diagnosis claims, strict medical disclaimers
- Source-grounded outputs only (no unverified hallucinations)
- Longitudinal intelligence over one-off chatbot answers
- Privacy by design and minimal data collection
- Open-source, contributor-friendly, production-minded architecture

## Repository Structure
- `docs/product/` Product vision, PRD, scope, user journeys
- `docs/architecture/` System design, data model, AI pipeline, security
- `docs/roadmap/` Year plan, release milestones, prioritization
- `docs/open-source/` Contribution model, governance, standards
- `docs/ops/` Deployment, environments, observability, runbooks
- `docs/agent-context/` Instructions for coding agents
- `planning/sprints/` Sprint-by-sprint execution plan
- `planning/tickets/` Detailed implementation tickets
- `infra/terraform/` IaC for future AWS/Azure migration paths

## Recommended Stack (Free Now, Scalable Later)
- Frontend: Next.js 16 + TypeScript + Tailwind + shadcn/ui (Vercel free)
- Backend API: FastAPI (Python) on Render/Fly free tier initially
- DB: Supabase Postgres (free tier)
- Auth: Supabase Auth (email + OAuth)
- Storage: Cloudflare R2 (low-cost, S3-compatible)
- Queue/Jobs: Upstash Redis + QStash (free starter)
- OCR/Extraction: Docling + Tesseract fallback
- AI orchestration: LangGraph + LangChain
- LLM provider abstraction: OpenRouter/OpenAI-compatible adapter
- Observability: OpenTelemetry + Sentry free tier
- IaC: Terraform from day one for migration to AWS/Azure

## Planned Milestones
1. Foundation and ingestion pipeline
2. Structured extraction and medical timeline model
3. Trend analysis and doctor-ready summary generation
4. Safety layer, review workflows, and production hardening
5. Contributor ecosystem and public launch prep

## Start Here
- Product and PRD: `docs/product/`
- MVP v1 scope: `docs/product/MVP_V1_SPEC.md`
- Golden safety rules: `docs/product/GOLDEN_RULES.md`
- Engineering blueprint: `docs/architecture/`
- Shared package strategy: `docs/architecture/SHARED_PACKAGES_STRATEGY.md`
- Execution plan: `planning/sprints/` and `planning/tickets/`
- MVP to Enterprise plan: `docs/roadmap/MVP_TO_ENTERPRISE_PLAN.md`
- Contributor onboarding: `CONTRIBUTING.md`
- Quality gates: `docs/open-source/QUALITY_GATES.md`
- Branching model: `docs/open-source/BRANCHING_STRATEGY.md`
- Conventions: `docs/open-source/CONVENTIONS.md`
- Operating manual: `docs/open-source/PROJECT_OPERATING_MANUAL.md`
- Runtime (docker dev/prod): `docs/ops/LOCAL_AND_PROD_RUNTIME.md`
- Env + feature flags: `docs/ops/CONFIGURATION_AND_FLAGS.md`
- Coding-agent brief: `AGENTS.md`

## License
MIT (see `LICENSE`)
