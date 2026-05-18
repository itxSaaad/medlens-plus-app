# Branching Strategy (3-Branch Model)

## Long-Lived Branches
- `main`: production branch (protected)
- `staging`: release candidate validation branch
- `develop`: integration branch

## Working Branches
- `feat/<ticket-id>-<slug>` — new features
- `fix/<ticket-id>-<slug>` — bug fixes
- `refactor/<scope>` — code refactoring without behavior change
- `test/<scope>` — test additions or improvements
- `ci/<scope>` — CI/CD configuration changes
- `chore/<scope>` — dependency updates, tooling
- `docs/<scope>` — documentation
- `release/<version>` — release preparation

## Merge Policy
1. Feature/fix/chore/docs branches merge into `develop` via PR.
2. `develop` is promoted to `staging` via PR.
3. `staging` is promoted to `main` via PR.

## Required Checks Per PR
- Branch Naming Validation
- JS Quality - Lint Typecheck Test Build
- Python Quality - Ruff Mypy Pytest
- Commit And PR Convention Checks

## Workflow Chain
- CI first
- Release second (semantic-release runs only after successful CI on `main`)
- Deploy third (currently skip-only by design)

## Enforcement
- Apply branch protection to `main`, `staging`, `develop`
- Require approvals, CODEOWNERS review, and conversation resolution
- No direct pushes to protected branches
- Auto-delete merged branches except `main`, `staging`, and `develop`
