# Branching Strategy (3-Branch Model)

## Long-Lived Branches
- `main`: production branch (protected)
- `staging`: pre-production stabilization and release candidate validation
- `develop`: active integration branch for ongoing feature work

## Working Branches
- `feat/<ticket-id>-<slug>`
- `fix/<ticket-id>-<slug>`
- `chore/<scope>`

## Merge Policy
1. Feature/fix/chore branches merge into `develop` via PR.
2. `develop` is promoted to `staging` at release-candidate cut.
3. After staging validation, `staging` merges into `main`.

## Required Checks Per PR
- JS quality pipeline: lint, typecheck, test, build
- Python quality pipeline: ruff, mypy, pytest
- Commit lint and semantic PR title check
- Review approval from CODEOWNERS

## Release Cadence
- Weekly internal release to `staging`
- Monthly stable release to `main`
