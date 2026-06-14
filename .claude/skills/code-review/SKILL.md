---
name: code-review
description: PR quality, security review, Dependabot hygiene, and MedLens+ review standards.
---

# Code Review

Use when preparing or reviewing pull requests.

## PR size and body
- **CI naming:** `docs/open-source/NAMING_CONVENTIONS.md` — branch, commit, PR title
- Use [PR template](https://github.com/itxSaaad/medlens-plus-app/blob/main/.github/pull_request_template.md): ticket link, problem, solution, checklists, validation evidence
- **Recommended:** ≤150 changed files (AI review tools), ≤400 lines meaningful diff, one issue per PR
- Summary, safety impact, privacy impact, test evidence, `Closes #NNN`

## Before merge
```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

## Security hygiene
- Dependabot PRs target `develop` — merge manually after CI
- Never commit `.env` or tokens; env-backed settings only
- CVE triage: Critical/High patch within 7 days

## Load on demand
| Task | Reference |
|------|-----------|
| Deep code review patterns | `references/code-reviewer/` |
| OWASP / secure coding | `references/secure-code-guardian/` |

Rule: `.cursor/rules/pr-quality-gate.mdc` · Command: `/review`
