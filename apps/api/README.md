# apps/api

FastAPI backend for MedLens+.

## Run via pnpm scripts

- `pnpm --filter @medlens/api dev`
- `pnpm --filter @medlens/api lint`
- `pnpm --filter @medlens/api typecheck`
- `pnpm --filter @medlens/api test`
- `pnpm --filter @medlens/api test:integration`

These scripts delegate to `uv` internally.

`pnpm install` at the repo root runs `scripts/sync-python-deps.mjs`, which calls `uv sync --directory apps/api --frozen --group dev` automatically (skipped with a warning if `uv` isn't on PATH).
