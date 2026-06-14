# Branching Strategy (Main-First, 3-Branch Model)

## Long-Lived Branches
- `main`: production branch (protected)
- `staging`: release candidate validation branch
- `develop`: integration branch

## Working Branches
- Branch **from `main`** (always matches production baseline)
- `feat/<ticket-id>-<slug>` or `feat/<description-slug>` — new features
- `fix/<ticket-id>-<slug>` or `fix/<description-slug>` — bug fixes
- `hotfix/<ticket-id>-<slug>` or `hotfix/<description-slug>` — urgent production fixes (PR to `main`)
- `refactor/<scope>`, `test/<scope>`, `ci/<scope>`, `chore/<scope>`, `docs/<scope>`

## Merge Policy

```text
feat/fix/chore (from main)  -->  develop  -->  staging  -->  main
hotfix (from main)          -->  main  -->  backmerge PRs to staging + develop
```

**PR-only rule:** All changes to `develop`, `staging`, and `main` land via **pull requests with required CI**. Human review is optional until the CODEOWNERS gate is re-enabled (see [`docs/ops/BRANCH_PROTECTION_SETUP.md`](../ops/BRANCH_PROTECTION_SETUP.md)). No workflow auto-merges branches. Auto-merge is disabled on protected branches.

1. Feature branches open PRs to **`develop`** (squash merge only, manual merge after CI passes).
2. Maintainers promote with **manual promotion PRs** (see below).
3. After every successful release on `main`, [Branch Backmerge](https://github.com/itxSaaad/medlens-plus-app/actions/workflows/branch-backmerge.yml) **opens PRs only** — maintainers resolve conflicts and merge manually.

## Manual promotion

Open promotion PRs yourself (GitHub UI or `gh`):

```bash
# develop → staging
gh pr create --head develop --base staging --title "chore: promote develop to staging"

# staging → main
gh pr create --head staging --base main --title "chore: promote staging to main"
```

Review, wait for CI, resolve conflicts if any, then squash merge. Repeat until branches are aligned.

## Backmerge

When `main` moves (hotfix or promotion), CI on `main` runs first, then semantic-release, then the backmerge workflow opens PRs `main` → `staging` and `main` → `develop`. **These PRs are not merged automatically.** Review each one, fix conflicts locally if needed, and merge manually.

## Required Checks Per PR
- Branch Naming Validation
- JS Quality - Lint Typecheck Test Build
- Python Quality - Ruff Mypy Pytest
- Commit And PR Convention Checks

## Enforcement
- One-time setup: [`docs/ops/BRANCH_PROTECTION_SETUP.md`](../ops/BRANCH_PROTECTION_SETUP.md)
- Branch, commit, and PR naming: [`NAMING_CONVENTIONS.md`](./NAMING_CONVENTIONS.md)
- Squash merge only on `develop`, `staging`, `main`
- Auto-merge disabled; Dependabot PRs still require manual merge on `develop`
- Auto-delete merged feature branches; never delete protected branches
