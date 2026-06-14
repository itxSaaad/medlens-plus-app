---
description: Implement one GitHub Project story end-to-end with tests and docs.
---

Use this workflow:
1. Read `AGENTS.md` and `CLAUDE.md`
2. Pick a **Ready** issue from the [GitHub Project Board](https://github.com/users/itxSaaad/projects/2)
3. Implement only that issue scope
4. Add/update tests
5. Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
6. Open PR to `develop` with `Closes #NNN` and notes for:
   - user impact
   - safety impact
   - privacy/security notes
