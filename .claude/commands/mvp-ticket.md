---
description: Implement one planning ticket end-to-end with tests and docs.
---

Use this workflow:
1. Read `AGENTS.md` and `CLAUDE.md`
2. Ask for ticket id if missing
3. Implement only that ticket scope
4. Add/update tests
5. Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
6. Prepare PR notes with:
   - user impact
   - safety impact
   - privacy/security notes
