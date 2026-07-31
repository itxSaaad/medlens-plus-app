# apps/api

FastAPI backend for MedLens+.

## Run locally

```bash
pnpm --filter @medlens/api dev
pnpm --filter @medlens/api lint
pnpm --filter @medlens/api typecheck
pnpm --filter @medlens/api test
pnpm --filter @medlens/api test:integration
```

These scripts delegate to `uv` internally.

`pnpm install` at the repo root runs `scripts/sync-python-deps.mjs`, which calls `uv sync --directory apps/api --frozen --group dev` automatically (skipped with a warning if `uv` isn't on PATH).

## Project shape

- `src/api/core/` — settings, interfaces, factories, and shared app wiring
- `src/api/providers/` — auth, storage, OCR, LLM, and other integrations
- `src/api/workflows/` — processing pipelines and orchestration logic
- `src/api/domain/` — domain models and business rules
- `tests/` — unit and integration coverage

## Conventions

- Prefer interface-based providers and factories over hardcoded vendor logic.
- Keep payload validation and schemas explicit using Pydantic.
- Follow the repository safety and privacy guardrails for any PHI or AI-generated content.

## Reference docs

- FastAPI docs: [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)
- Pydantic docs: [https://docs.pydantic.dev/](https://docs.pydantic.dev/)
- Uvicorn docs: [https://www.uvicorn.org/](https://www.uvicorn.org/)
