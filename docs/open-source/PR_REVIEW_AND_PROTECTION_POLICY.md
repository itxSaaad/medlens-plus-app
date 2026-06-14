# PR Review and Protection Policy

This repository enforces merge discipline similar to an enterprise software team.

## Mandatory PR Rules

1. No direct pushes to `main`, `staging`, or `develop`.
2. Every code change must come via pull request.
3. Use the [PR template](../../.github/pull_request_template.md) for the body (ticket link, problem, solution, checklists, validation evidence).
4. Approval requirements (current solo-maintainer mode — see [`docs/ops/BRANCH_PROTECTION_SETUP.md`](../ops/BRANCH_PROTECTION_SETUP.md)):
   - `develop`, `staging`, `main`: **0 approvals** (PR + required CI only)
   - **Future:** re-enable CODEOWNERS + 1 approval per branch when a second reviewer exists
5. Required checks must pass before merge:
   - Branch Naming Validation
   - JS Quality - Lint Typecheck Test Build
   - Python Quality - Ruff Mypy Pytest
   - Commit And PR Convention Checks
   - Graphify Sync
6. Resolve blocking conversations before merge.

## Recommended PR Size (not enforced by CI)

Keep PRs reviewable for humans and AI tools:

| Guideline | Target | Why |
|-----------|--------|-----|
| Changed files | **≤150** (recommended) | CodeRabbit auto-skips above 150; Copilot skips above ~300 |
| Meaningful diff | **≤400 lines** | Faster human review; easier cherry-pick |
| Scope | **One issue / logical change** | Cleaner history; modular commits on feature branches |

Large stacks (e.g. initial skills consolidation) are acceptable when commits are modular and documented — **request AI review manually** only on scoped follow-up PRs or after splitting.

## AI Review Policy (manual only)

- **CodeRabbit:** `auto_review.enabled: false` in [`.coderabbit.yaml`](../../.coderabbit.yaml). Trigger with `@coderabbitai review` or `@coderabbitai full review` in a PR comment when ready.
- **GitHub Copilot:** Do not enable automatic PR review in repo rulesets or Copilot settings. Assign **Copilot** as a reviewer when you want feedback.
- **Codacy:** On-demand via PR comment / dashboard (no blocking auto-review by default).

Setup details: [`TOOLING_SETUP.md`](./TOOLING_SETUP.md).

## CODEOWNERS (future)

When `require_code_owner_reviews` is re-enabled, CODEOWNERS paths in [`.github/CODEOWNERS`](../../.github/CODEOWNERS) apply. Until then, maintainers merge after CI without approval gate.

## Branch Promotion Rules

- `feature/*` -> `develop`
- `develop` -> `staging`
- `staging` -> `main`

Only promote forward after validations pass.

## Quality Expectations

- No unreviewed "vibe-coded" logic.
- Code must be test-backed and maintainable.
- New behavior requires tests and docs updates in same PR.
- Safety-critical language changes require explicit reviewer acknowledgment.
