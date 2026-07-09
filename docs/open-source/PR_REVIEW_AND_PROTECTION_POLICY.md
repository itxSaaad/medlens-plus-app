# PR Review and Protection Policy

This repository enforces merge discipline similar to an enterprise software team.

## Mandatory PR Rules

1. No direct pushes to `main` or `develop`.
2. Every code change must come via pull request.
3. Use the [PR template](../../.github/pull_request_template.md) for the body (ticket link, problem, solution, checklists, validation evidence).
4. Approval requirements (see [`docs/ops/BRANCH_PROTECTION_SETUP.md`](../ops/BRANCH_PROTECTION_SETUP.md)):
   - `develop`, `main`: **1 CODEOWNERS approval from `@itxSaaad`** for collaborator PRs
   - Repo owner (`@itxSaaad`) may merge own PRs without external approval
   - Last-push approval required for collaborators; blocking conversations must be resolved before merge
5. Required checks must pass before merge:
   - Branch Naming Validation
   - JS Quality - Lint Typecheck Test Build
   - Python Quality - Ruff Mypy Pytest
   - Commit And PR Convention Checks
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
- **CodeQL:** Advisory security scanning on PRs; review alerts in **Security → Code scanning** (does not block merge by default).

Setup details: [`TOOLING_SETUP.md`](./TOOLING_SETUP.md).

## CODEOWNERS

[`@itxSaaad`](https://github.com/itxSaaad) is the sole code owner. Every collaborator PR to `main` or `develop` requires approval from `@itxSaaad`. The repo owner may merge their own PRs without external approval. See [`.github/CODEOWNERS`](../../.github/CODEOWNERS).

## Branch Promotion Rules

- `feature/*` -> `develop`
- `develop` -> `main`

Only promote forward after validations pass.

## Quality Expectations

- No unreviewed "vibe-coded" logic.
- Code must be test-backed and maintainable.
- New behavior requires tests and docs updates in same PR.
- Safety-critical language changes require explicit reviewer acknowledgment.
