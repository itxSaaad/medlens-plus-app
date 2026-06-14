---
description: Code review against MedLens+ PR quality, safety, and contract standards.
---

Read `.claude/skills/code-review/SKILL.md` and `.claude/skills/safety-privacy/SKILL.md`.

For deeper review, load on demand:
- `references/code-reviewer/`
- `references/secure-code-guardian/`
- `ui-accessibility` + `references/web-design-guidelines/` when `apps/web` changes

Review the current diff and output:

## Summary
What changed and user impact.

## Findings (severity ordered)
- Blockers / should-fix / nit

## Checklist
- [ ] Tests for changed behavior
- [ ] Types/contracts aligned
- [ ] Safety and privacy notes adequate
- [ ] No placeholders or drive-by refactors
- [ ] `pnpm lint`, `typecheck`, `test`, `build` evidence

## Verdict
Approve / request changes — with concrete next steps.
