---
description: Run or add tests following MedLens+ testing strategy for the current change.
---

Read `.claude/skills/testing/SKILL.md` and on demand `references/test-master/`.

1. Identify which packages changed (`apps/web`, `apps/api`, `packages/*`).
2. Run the narrowest relevant test commands first, then workspace checks if needed.

## Web
```bash
pnpm --filter @medlens/web test:unit
pnpm --filter @medlens/web test:integration
```

## API
```bash
pnpm --filter @medlens/api test
pnpm --filter @medlens/api test:integration
```

## Full gate
```bash
pnpm test
```

Report: commands run, pass/fail, gaps in coverage for the diff, and suggested tests if missing.
