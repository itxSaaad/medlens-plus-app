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
hotfix (from main)          -->  main  -->  backmerge PR into develop (rare)
promotion (no hotfix pending) -->  rebase-merge: true fast-forward, main == develop, no backmerge needed
```

**PR-only rule:** All changes to `develop` and `main` land via **pull requests with required CI and one CODEOWNERS approval**. Auto-merge is disabled on protected branches.

1. Feature branches open PRs to **`develop`** (squash merge only, manual merge after CI passes). Squashing here is fine and desirable — one clean commit per feature, and `develop` isn't tagged or released from directly.
2. Maintainers promote with a **manual PR** `develop` → `main`, merged with **"Rebase and merge"** — never squash, never a merge commit (see below for why).
3. [`sync-develop.yml`](../../.github/workflows/sync-develop.yml) still runs on every push to `main` as a safety net, but in the normal case it finds `main` and `develop` already at the exact same commit and no-ops. It only opens a backmerge PR in the rare case `main` has diverged (a hotfix landed directly on `main`, bypassing `develop`).

### Why promotion uses rebase-merge, not squash

Squashing `develop` into `main` was the root cause of a recurring problem: it collapses many commits into one new commit with no shared ancestry to `develop`'s originals, so `main` and `develop` permanently diverge in commit graph even when their file content is identical. Every promotion cycle reintroduced the same "N commits ahead, 0 files changed" drift, requiring a backmerge PR every single time.

Rebase-merge doesn't have this problem, and it has a specific behavior that resolves the whole issue: **when the head branch requires no actual rebasing — i.e. it's already a direct linear descendant of the base — GitHub performs a true fast-forward: zero new commits, identical SHAs on both branches.** In the normal flow (feature branches always cut from `main`, always landing on `develop` first, no direct hotfixes to `main`), `develop` is always a direct descendant of `main`. So promoting via rebase-merge makes `main` become **exactly** `develop`'s tip — same commit, same history, same code. No backmerge, no drift, nothing left to reconcile.

This only breaks down if `main` gets a commit `develop` doesn't have (a hotfix). That's the one case where a real backmerge PR is still needed — see below. It's meant to be rare; the normal path never needs one.

## Manual promotion

No special title convention or batch-semver validation is needed. `semantic-release` reads `main`'s real commit history directly (rebase-merge preserves every individual `develop` commit, unlike squash), so any conventional-commit-formatted title works:

```bash
gh pr create --head develop --base main --title "chore: promote develop to main"
```

Use the PR **body** to list included PRs and issues. Wait for CI, resolve conflicts if any (a real hotfix divergence — see below), then merge with **"Rebase and merge."** Do not squash and do not use a merge commit for this PR — either one reintroduces the drift this design exists to avoid.

## Automated develop sync (hotfix safety net)

[`sync-develop.yml`](../../.github/workflows/sync-develop.yml) runs directly on every push to `main` (a plain `push` trigger — not chained through other workflows, which proved unreliable: a chain of `workflow_run` triggers silently no-ops if any upstream workflow gets cancelled, e.g. by a concurrency-group collision):

| Condition | Action |
|-----------|--------|
| Same SHA on `main` and `develop` | No-op — this is the expected state after every normal rebase-merge promotion |
| Same file tree, different SHAs | Open/update `main` → `develop` PR, empty diff, merge with a merge commit |
| `main` ahead with non-empty diff (hotfix) | Open/update `main` → `develop` PR for human review/merge |
| `develop` ahead with unpromoted work | No-op (open promotion PR when ready) |

Both drift cases (which should now only occur after a hotfix) end the same way — a PR merged with **"Create a merge commit."** There is no direct-push/force-push path; `develop`'s branch protection doesn't allow one.

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

## Enforcement
- One-time setup: [`docs/ops/BRANCH_PROTECTION_SETUP.md`](../ops/BRANCH_PROTECTION_SETUP.md)
- Branch, commit, and PR naming: [`NAMING_CONVENTIONS.md`](./NAMING_CONVENTIONS.md)
- Release process: [`RELEASE_PROCESS.md`](./RELEASE_PROCESS.md)
- Squash merge for feature PRs into `develop`; **rebase merge** (never squash, never merge commit) for `develop` → `main` promotion PRs — `main` requires linear history, and only rebase-merge can fast-forward instead of creating a new commit
- Merge commit only for `main` → `develop` backmerge PRs, which should now be rare (hotfix divergence only — normal promotions fast-forward and need no backmerge)
- No direct pushes to `main` or `develop` under any circumstance, including by automation — both reject force-pushes and require PRs
- Auto-merge disabled; Dependabot PRs still require manual merge on `develop`
- Auto-delete merged feature branches; never delete protected branches
- Weekly drift detection: [`branch-drift.yml`](../../.github/workflows/branch-drift.yml)
