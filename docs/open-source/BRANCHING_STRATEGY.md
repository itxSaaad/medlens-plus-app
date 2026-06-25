# Branching Strategy (Main-First, 2-Branch Model)

## Long-Lived Branches
- `main`: production branch (protected)
- `develop`: integration and validation branch

## Working Branches
- Branch **from `main`** (always matches production baseline)
- `feat/<ticket-id>-<slug>` or `feat/<description-slug>` — new features
- `fix/<ticket-id>-<slug>` or `fix/<description-slug>` — bug fixes
- `hotfix/<ticket-id>-<slug>` or `hotfix/<description-slug>` — urgent production fixes (PR to `main`)
- `refactor/<scope>`, `test/<scope>`, `ci/<scope>`, `chore/<scope>`, `docs/<scope>`

## Merge Policy

```text
feat/fix/chore (from main)  -->  develop  -->  main
hotfix (from main)          -->  main  -->  hotfix PR into develop (when diff non-empty)
post-promotion              -->  sync workflow fast-forwards develop to main (same tree)
```

**PR-only rule:** All changes to `develop` and `main` land via **pull requests with required CI and one CODEOWNERS approval**. Auto-merge is disabled on protected branches.

1. Feature branches open PRs to **`develop`** (squash merge only, manual merge after CI passes).
2. Maintainers promote with a **manual PR** `develop` → `main` (see below).
3. After squash promotion to `main`, [`sync-develop.yml`](../../.github/workflows/sync-develop.yml) **fast-forwards** `develop` to `main` when file trees match — **do not** open a manual backmerge PR in that case.

## Manual promotion

Squash promotion uses the **PR title as the only commit message on `main`**. `semantic-release` will not see individual `develop` commits — the promotion title must match the highest semver in the batch.

Before opening the promotion PR:

```bash
bash scripts/suggest-promotion-title.sh
```

Promotion PR title rules:

| Batch contains | Minimum PR title type | Example |
|----------------|----------------------|---------|
| `feat!` or `BREAKING CHANGE` | `feat!:` | `feat!: promote auth redesign to main` |
| `feat:` (no breaking) | `feat:` | `feat: promote waitlist admin to main` |
| `fix:` / `perf:` / `revert:` / `release:` / `chore(deps):` only | `fix:` | `fix: promote bugfix batch to main` |
| docs/ci/chore-only | `chore:` | `chore: promote develop to main` |

**Never** use `chore: promote develop to main` when the batch contains releasable `feat` or `fix` work — that skips versioning.

```bash
gh pr create --head develop --base main --title "feat: promote integration batch to main"
```

Use the PR **body** to list included PRs and issues. CI runs **Promotion Release Semver Check** on `develop` → `main` PRs.

Review, wait for CI, resolve conflicts if any, then squash merge.

## Automated develop sync

[`sync-develop.yml`](../../.github/workflows/sync-develop.yml) runs on every push to `main`:

| Condition | Action |
|-----------|--------|
| Same SHA on `main` and `develop` | No-op |
| Same file tree, different SHAs (post-squash promotion) | Fast-forward `develop` to `main` |
| `main` ahead with non-empty diff (hotfix) | Open/update PR `main` → `develop` for human merge |
| `develop` ahead with unpromoted work | No-op (open promotion PR when ready) |

**Do not** manually backmerge `main` → `develop` after a squash promotion when trees already match — that reintroduces merge-commit drift loops.

## Hotfix propagation

When `main` has hotfix commits not on `develop` (non-empty diff), merge the PR opened by the sync workflow:

```bash
gh pr list --base develop --head main --state open
```

Or create one manually:

```bash
gh pr create --head main --base develop --title "chore: propagate main hotfixes to develop"
```

## One-time branch alignment

If `develop` and `main` diverged with conflicting file changes:

```bash
git checkout develop
git pull origin develop
git merge origin/main
# resolve conflicts; prefer develop for integration work already on develop
git push origin develop
```

Use merge only when trees differ with real conflicts — not for post-promotion graph-only drift.

## Required Checks Per PR
- Branch Naming Validation
- JS Quality - Lint Typecheck Test Build
- Python Quality - Ruff Mypy Pytest
- Commit And PR Convention Checks
- Promotion Release Semver Check (`develop` → `main` promotion PRs only)

## Enforcement
- One-time setup: [`docs/ops/BRANCH_PROTECTION_SETUP.md`](../ops/BRANCH_PROTECTION_SETUP.md)
- Branch, commit, and PR naming: [`NAMING_CONVENTIONS.md`](./NAMING_CONVENTIONS.md)
- Release promotion titles: [`RELEASE_PROCESS.md`](./RELEASE_PROCESS.md)
- Squash merge only on `develop` and `main`
- Auto-merge disabled; Dependabot PRs still require manual merge on `develop`
- Auto-delete merged feature branches; never delete protected branches
- Weekly drift detection: [`branch-drift.yml`](../../.github/workflows/branch-drift.yml)
