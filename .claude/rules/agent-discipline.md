# Agent Discipline

Apply to every coding task unless a more specific skill overrides.

## Before editing

1. Read the file(s) you will change and their immediate callers.
2. Match existing naming, import style, error handling, and test patterns.
3. Use `graphify query` when exploring unfamiliar code (see root `CLAUDE.md`).

## While implementing

- Deliver the **smallest correct diff** — no drive-by refactors.
- **No placeholders**: no `TODO`, `...`, empty stubs, or "implement later" in shipped code.
- **Verify before import**: check `package.json` / `pyproject.toml` before adding dependencies; do not assume a package exists from training data.
- **Interface-first**: define types/contracts before implementation for new modules.
- Prefer extending existing functions/components over new parallel abstractions.
- Use concrete error messages and project error types; avoid bare `except:` in Python.

## Anti-slop

- No over-commenting obvious code.
- No generic variable names (`data`, `result`, `temp`) when domain terms exist.
- No "As an AI…" or filler prose in docs or PR text.
- Follow patterns in canonical files (e.g. `apps/api/src/api/core/factories.py`, `apps/web/src/app/page.tsx`).

## Before finishing

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

Report what you ran and any failures; do not claim done without evidence.
