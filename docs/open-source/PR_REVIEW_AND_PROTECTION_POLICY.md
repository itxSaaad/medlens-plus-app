# PR Review and Protection Policy

This repository enforces merge discipline similar to an enterprise software team.

## Mandatory PR Rules

1. No direct pushes to `main`, `staging`, or `develop`.
2. Every code change must come via pull request.
3. Approval requirements:
   - `main`: 2 approvals (recommended target)
   - `staging`: 1 approval
   - `develop`: 1 approval
4. Required checks must pass before merge:
   - JS Quality - Lint Typecheck Test Build
   - Python Quality - Ruff Mypy Pytest
   - Branch Naming Validation (PR only)
   - Commit And PR Convention Checks
5. CODEOWNERS review required for protected paths.
6. Resolve all conversations before merge.

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
