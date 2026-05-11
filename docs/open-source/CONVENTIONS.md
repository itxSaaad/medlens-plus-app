# Repository Conventions

## Naming Conventions

## Files and Folders
- Python modules: `snake_case.py`
- TypeScript files: `kebab-case.ts` or `kebab-case.tsx`
- Test files:
  - Python unit: `tests/unit/test_*.py`
  - Python integration: `tests/integration/test_*.py`
  - Web unit: `src/tests/unit/*.test.ts(x)`
  - Web integration: `src/tests/integration/*.integration.test.ts`
- Docs: `UPPER_SNAKE_CASE.md` for core strategy docs, `kebab-case.md` for workflow notes is acceptable, but keep style consistent per folder.

## Code Conventions
- Keep business logic dependent on interfaces, not concrete providers.
- Keep side effects at boundaries (providers/adapters), not core workflow logic.
- Use explicit types in Python and TypeScript.
- Keep functions small and single-purpose.

## Comment Conventions
- Add comments only when intent is not obvious from code.
- Prefer explaining "why" over "what".
- Do not add noisy comments that restate code.

## Architecture Conventions
- Provider interfaces live in `apps/api/src/api/core/interfaces.py`.
- Provider selection lives in `apps/api/src/api/core/factories.py`.
- Runtime config and feature flags live in `apps/api/src/api/core/settings.py`.
- Workflows consume `Settings/FeatureFlags` and interfaces only.

## Testing Conventions
- Unit tests are mandatory for all new logic.
- Integration tests are mandatory for infra interactions.
- Feature flags must have tests covering enabled and disabled behavior.

## Docs Conventions
- Any change to architecture/config/workflow must update docs in same PR.
- Docs must reflect real current code paths, not planned behavior only.
