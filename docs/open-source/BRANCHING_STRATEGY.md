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
hotfix (from main)          -->  main  -->  manual backmerge into develop
```

**PR-only rule:** All changes to `develop` and `main` land via **pull requests with required CI**. Human review is optional until the CODEOWNERS gate is re-enabled (see [`docs/ops/BRANCH_PROTECTION_SETUP.md`](../ops/BRANCH_PROTECTION_SETUP.md)). No workflow auto-merges branches. Auto-merge is disabled on protected branches.

1. Feature branches open PRs to **`develop`** (squash merge only, manual merge after CI passes).
2. Maintainers promote with a **manual PR** `develop` → `main` (see below).
3. After `main` moves (hotfix or promotion), maintainers **manually** sync `develop` from `main` (see Backmerge).

## Manual promotion

Open the promotion PR yourself (GitHub UI or `gh`):

```bash
gh pr create --head develop --base main --title "chore: promote develop to main"
```

Review, wait for CI, resolve conflicts if any, then squash merge.

## Backmerge (manual only)

When `main` has commits `develop` does not (hotfix or post-promotion squash), sync `develop` yourself:

```bash
gh pr create --head main --base develop --title "chore: backmerge main into develop"
```

Or locally:

```bash
git checkout develop
git pull origin develop
git merge origin/main
# resolve conflicts, then push or open PR
```

There is **no** automated backmerge workflow — open the PR yourself when needed.

## One-time branch alignment

If `develop` and `main` diverged (e.g. after removing `staging`), pick one approach:

**Merge (safer, no force-push):**

```bash
git checkout develop
git pull origin develop
git merge origin/main
# resolve conflicts; prefer develop for integration work already on develop
git push origin develop
```

**Rebase (linear history, rewrites `develop`):**

```bash
git checkout develop
git pull origin develop
git rebase origin/main
# resolve conflicts per commit
git push --force-with-lease origin develop
```

Use merge unless you explicitly want a linear `develop` history and are the only person pushing to `develop`.

## Required Checks Per PR
- Branch Naming Validation
- JS Quality - Lint Typecheck Test Build
- Python Quality - Ruff Mypy Pytest
- Commit And PR Convention Checks

## Enforcement
- One-time setup: [`docs/ops/BRANCH_PROTECTION_SETUP.md`](../ops/BRANCH_PROTECTION_SETUP.md)
- Branch, commit, and PR naming: [`NAMING_CONVENTIONS.md`](./NAMING_CONVENTIONS.md)
- Squash merge only on `develop` and `main`
- Auto-merge disabled; Dependabot PRs still require manual merge on `develop`
- Auto-delete merged feature branches; never delete protected branches
