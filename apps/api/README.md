# apps/api

FastAPI backend for MedLens+ (CLI scaffolded with `uv init`).

## Local
- `uv sync --group dev`
- `uv run uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000`

## Quality
- `uv run ruff check .`
- `uv run mypy src`
- `uv run pytest`

## Docker
- Dev: uses `apps/api/Dockerfile.dev`
- Prod: uses `apps/api/Dockerfile`
