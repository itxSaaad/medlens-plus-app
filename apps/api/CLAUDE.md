# apps/api — Claude context

FastAPI backend (`@medlens/api`), Python 3.12+.

## Commands

```bash
pnpm --filter @medlens/api dev
pnpm --filter @medlens/api lint
pnpm --filter @medlens/api typecheck
pnpm --filter @medlens/api test
pnpm --filter @medlens/api test:integration
```

## Layout

```text
src/api/
  core/         interfaces.py, factories.py, settings.py
  providers/    auth, storage, db, ocr, llm
  workflows/    report_processing.py, etc.
  domain/       domain models
  main.py       FastAPI app
tests/
  unit/
  integration/
```

## Conventions
- All providers via interfaces + factories — never hardcode vendors in routes.
- Async I/O; Pydantic v2 schemas; env-backed settings.
- No PHI in logs; safety filters on AI output.

## Skills
- `api-backend` — FastAPI, OpenAPI, Postgres
- `ai-workflows` — LangGraph, prompts, RAG
- `parser-pipeline` — OCR, extractors
- `safety-privacy` — medical guardrails

Reference: `docs/architecture/ADAPTER_FACTORY_GUIDE.md`
