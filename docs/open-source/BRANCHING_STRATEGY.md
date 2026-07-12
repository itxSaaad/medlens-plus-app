# Branching Strategy (Trunk-Based, Single Branch)

## Long-Lived Branches
- `main`: the only long-lived branch. Protected, always deployable, always tagged/released from.

There is no `develop` branch. There used to be — see "Why trunk-based" below for what that cost and why it was dropped.

## Working Branches
- Branch **from `main`**
- `feat/<ticket-id>-<slug>` or `feat/<description-slug>` — new features
- `fix/<ticket-id>-<slug>` or `fix/<description-slug>` — bug fixes
- `hotfix/<ticket-id>-<slug>` or `hotfix/<description-slug>` — urgent production fixes
- `refactor/<scope>`, `test/<scope>`, `ci/<scope>`, `chore/<scope>`, `docs/<scope>`

## Merge Policy

```text
feat/fix/chore/hotfix (from main)  -->  PR  -->  main (squash merge)
```

That's the entire flow. One branch, one merge target, one merge method.

**PR-only rule:** All changes to `main` land via **pull requests with required CI and one CODEOWNERS approval**. Auto-merge is disabled. No direct pushes, ever — `main`'s branch protection has no bypass for this.

1. Branch from `main`.
2. Open a PR back to `main`. Required checks: Branch Naming Validation, JS Quality, Python Quality, Commit And PR Convention Checks.
3. Merge with **squash** — the only merge method enabled on this repo (`allow_squash_merge: true`, `allow_merge_commit: false`, `allow_rebase_merge: false`).
4. `ci.yml` runs quality checks on the resulting push to `main`, then calls `release.yml` (semantic-release: tag + GitHub Release) and `deploy.yml` as `needs:`-gated reusable workflows in the same run. Anything not ready for users yet ships behind a feature flag (see `docs/ops/CONFIGURATION_AND_FLAGS.md`), not behind a separate branch.

## Why trunk-based

This repo ran a two-branch (`main` + `develop`) GitFlow-lite model for a while. It caused a real, recurring problem: keeping two independently-protected branches in sync — same code *and* same commit history — turned out to be structurally difficult on GitHub, for reasons worth knowing if this is ever reconsidered:

- **Squash promotion** (`develop` → `main`) collapses many commits into one new commit with no shared ancestry to the originals. Even with identical file content, the two branches permanently diverge in commit graph — every promotion cycle needed a backmerge PR to reconcile.
- **Merge-commit backmerges** fix the ancestry link but permanently block future rebase-merges on any range that includes them (GitHub's rebase-merge refuses to rebase past a merge commit).
- **Rebase-merge**, it turns out, can't actually produce a byte-identical fast-forward either: GitHub's merge API re-stamps the `committer` field on every commit it processes, on every merge strategy, even when no real rebasing is needed. That changes the SHA every time. Confirmed empirically on this repo by inspecting the raw commit objects — same tree, same parent, same author, different committer, different SHA.

The conclusion: **byte-identical history between two independently-protected branches is not achievable through GitHub's PR merge API, under any merge strategy**, as long as direct pushes are disallowed (which they should be). Content can always be kept identical; the commit graph cannot, short of granting some automation a bypass to push directly — a bigger trust trade-off than it's worth for a small team.

Dropping `develop` sidesteps the entire problem class rather than chasing a fix for it. One branch can't diverge from itself.

## Feature flags replace the integration branch

`develop` served as a staging/integration gate before code reached `main`. Trunk-based development replaces that function with feature flags: land code on `main` behind a flag, verify it in whatever environment you need, flip the flag when ready. See `docs/ops/CONFIGURATION_AND_FLAGS.md`.

## Required Checks Per PR
- Branch Naming Validation
- JS Quality - Lint Typecheck Test Build
- Python Quality - Ruff Mypy Pytest
- Commit And PR Convention Checks

## Enforcement
- One-time setup: [`docs/ops/BRANCH_PROTECTION_SETUP.md`](../ops/BRANCH_PROTECTION_SETUP.md)
- Branch, commit, and PR naming: [`NAMING_CONVENTIONS.md`](./NAMING_CONVENTIONS.md)
- Release process: [`RELEASE_PROCESS.md`](./RELEASE_PROCESS.md)
- Squash merge only — the only method enabled on the repo
- No direct pushes to `main` under any circumstance, including by automation
- Auto-merge disabled; Dependabot PRs target `main` and still require manual merge
- Auto-delete merged feature branches; never delete `main`
