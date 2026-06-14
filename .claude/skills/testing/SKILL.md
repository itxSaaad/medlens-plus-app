---
name: testing
description: Vitest, pytest, layered unit/integration tests, and contract coverage across the MedLens+ monorepo.
---

# Testing

Use when adding or running tests for any package change.

## Matrix
| Layer | Tool | Location |
|-------|------|----------|
| Web unit | Vitest | `apps/web/src/tests/unit/` |
| Web integration | Vitest | `apps/web/src/tests/integration/` |
| API unit | pytest | `apps/api/tests/unit/` |
| API integration | pytest | `apps/api/tests/integration/` |

## Rules
- Test behavior changed in the PR; mock providers at interfaces
- Mark integration tests explicitly; keep unit tests fast
- Parsers, safety filters, and trends require coverage when touched

## Commands
```bash
pnpm --filter @medlens/web test:unit test:integration
pnpm --filter @medlens/api test test:integration
pnpm test   # full gate
```

## Load on demand
| Task | Reference |
|------|-----------|
| Layered testing strategy | `references/test-master/` |

Rule: `.cursor/rules/testing.mdc` · Command: `/test`
