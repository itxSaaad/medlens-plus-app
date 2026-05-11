# Quality Gates

Every PR targeting `develop`, `staging`, or `main` must pass:

1. JS lint (`pnpm lint`)
2. JS typecheck (`pnpm typecheck`)
3. JS unit tests (`pnpm --filter @medlens/web test:unit`)
4. JS build (`pnpm build`)
5. Python lint (`uv run --directory apps/api ruff check .`)
6. Python typecheck (`uv run --directory apps/api mypy src`)
7. Python unit tests (`uv run --directory apps/api pytest -m "not integration"`)
8. Config/flag test coverage (`apps/api/tests/unit/test_settings.py`)
9. Commit lint and semantic PR title checks

## Integration Gates (Pre-release)
- Web integration tests: `pnpm --filter @medlens/web test:integration`
- API integration tests: `pnpm api:test:integration`

## Local Pre-Push Checklist
- Run `pnpm lint`
- Run `pnpm typecheck`
- Run `pnpm test`
- Run `pnpm build`
