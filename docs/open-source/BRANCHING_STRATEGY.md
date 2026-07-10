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
hotfix (from main)          -->  main  -->  backmerge PR into develop
post-promotion               -->  sync workflow opens a backmerge PR (empty diff, merge commit)
```

**PR-only rule:** All changes to `develop` and `main` land via **pull requests with required CI and one CODEOWNERS approval**. Auto-merge is disabled on protected branches.

1. Feature branches open PRs to **`develop`** (squash merge only, manual merge after CI passes).
2. Maintainers promote with a **manual PR** `develop` → `main` (see below). Squash merge only — `main` requires linear history and its branch protection rejects merge commits.
3. After every push to `main`, [`sync-develop.yml`](../../.github/workflows/sync-develop.yml) opens or updates a `main` → `develop` PR automatically. **Merge it with "Create a merge commit," never squash.**

### Why the backmerge is a PR, not an automatic fast-forward

`develop`'s branch protection has `allow_force_pushes: false`. A workflow cannot force-push or fast-forward the ref directly — GitHub rejects it (`422: Changes must be made through a pull request`), and that's correct: it's the same PR-only rule everything else follows, not an exception. `sync-develop.yml` therefore always opens/updates a PR rather than pushing to the ref; a human still clicks merge, same as any other protected-branch change.

**Merge method matters.** `develop` has no linear-history requirement, so a real **merge commit** is used for this PR — never squash. A merge commit gives `main`'s promotion commit a real ancestry edge into `develop`, so the drift is resolved for good. Squashing the backmerge would create yet another commit with no shared history, and the next `git log develop..main` would show "ahead by 1" again — the loop the human-run process used to fall into. `allow_merge_commit` is enabled repo-wide for this reason; it's intentionally *not* used for feature PRs or promotion PRs, only this one.

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

[`sync-develop.yml`](../../.github/workflows/sync-develop.yml) runs directly on every push to `main` (a plain `push` trigger — not chained through other workflows, which proved unreliable: a chain of `workflow_run` triggers silently no-ops if any upstream workflow gets cancelled, e.g. by a concurrency-group collision):

| Condition | Action |
|-----------|--------|
| Same SHA on `main` and `develop` | No-op |
| Same file tree, different SHAs (post-squash promotion) | Open/update `main` → `develop` PR, empty diff, merge with a merge commit |
| `main` ahead with non-empty diff (hotfix) | Open/update `main` → `develop` PR for human review/merge |
| `develop` ahead with unpromoted work | No-op (open promotion PR when ready) |

Both drift cases end the same way — a PR merged with **"Create a merge commit."** There is no direct-push/force-push path; `develop`'s branch protection doesn't allow one.

## Hotfix / post-promotion propagation

Merge the PR opened by the sync workflow:

```bash
gh pr list --base develop --head main --state open
gh pr merge <number> --merge   # never --squash for this PR
```

Or create one manually if the workflow hasn't fired yet:

```bash
gh pr create --head main --base develop --title "chore: sync develop with main"
```

## One-time branch alignment

If `develop` and `main` diverged with real conflicting file changes (not just post-promotion graph drift), resolve locally then push through the **same backmerge PR**, since neither branch accepts direct pushes:

```bash
git checkout develop
git pull origin develop
git merge origin/main
# resolve conflicts; prefer develop for integration work already on develop
git push origin develop:conflict/resolve-main-develop
gh pr edit <backmerge-pr-number> --head conflict/resolve-main-develop   # or open a fresh PR to develop
```

Use a real conflict-resolution merge only when trees differ with actual conflicts — not for post-promotion graph-only drift, which the sync workflow already handles as an empty-diff PR.

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
- Squash merge only for feature PRs into `develop` and for `develop` → `main` promotion PRs (`main` requires linear history; its protection rejects merge commits)
- Merge commit only for `main` → `develop` backmerge PRs (never squash — see "Why the backmerge is a PR" above)
- No direct pushes to `main` or `develop` under any circumstance, including by automation — both reject force-pushes and require PRs
- Auto-merge disabled; Dependabot PRs still require manual merge on `develop`
- Auto-delete merged feature branches; never delete protected branches
- Weekly drift detection: [`branch-drift.yml`](../../.github/workflows/branch-drift.yml)
