---
name: api-backend
description: FastAPI async services, OpenAPI contracts, Postgres repositories, and Python patterns for apps/api.
---

# API Backend

Use for `apps/api`, shared schemas, and database access.

## Mandatory boundaries
- `core/interfaces.py` — contracts
- `core/factories.py` — provider resolution
- `core/settings.py` — env config only
- `providers/*` — vendor implementations
- No raw SQL in routes/workflows — repository layer only

## Rules
- Async handlers and I/O-bound providers
- Pydantic v2 for request/response schemas
- Patient-safe HTTP errors; no PHI in logs
- Schema-first: additive OpenAPI/JSON schema changes before code
- Share schemas across languages — no shared JS/Python runtime

## Commands
```bash
pnpm --filter @medlens/api dev
pnpm --filter @medlens/api lint typecheck test test:integration
```

## Load on demand
| Task | Reference |
|------|-----------|
| FastAPI patterns | `references/fastapi-expert/` |
| Python async / typing / pytest | `references/python-pro/` |
| REST / OpenAPI design | `references/api-designer/` |
| Postgres / Supabase | `references/postgres-pro/` |

Docs: `docs/architecture/ADAPTER_FACTORY_GUIDE.md` · Rule: `.cursor/rules/fastapi-backend.mdc`
