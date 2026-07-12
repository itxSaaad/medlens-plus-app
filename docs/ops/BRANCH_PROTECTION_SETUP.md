# Branch Protection Setup (One-Time)

Run once per repository or after changing required CI checks.

## Prerequisites

- Repository admin access
- PAT with `admin:repo` embedded in `git remote get-url origin` **or** `GITHUB_TOKEN` exported (for this script only)
- Repository secret **`GH_PAT`** for automated workflows — see [`GITHUB_AUTOMATION_PAT.md`](./GITHUB_AUTOMATION_PAT.md)
- No `gh auth login` required — the setup script uses `curl` + PAT from git remote

## Current policy

- **PR required** on `main` (the only long-lived branch — trunk-based, see [`BRANCHING_STRATEGY.md`](../open-source/BRANCHING_STRATEGY.md))
- **Required CI checks** must pass (see list below)
- **1 CODEOWNERS approval from `@itxSaaad`** on `main` for collaborator PRs
- **Repo owner (`@itxSaaad`) may merge own PRs** without external approval (`enforce_admins: false`)
- **Conversation resolution** required before merge
- **Last-push approval** required for collaborators (prevents self-approve after pushing)
- **Admins excluded** from protection (`enforce_admins: false`) so the sole owner can self-merge; Write collaborators are still subject to CODEOWNERS review
- **Classic branch protection** is authoritative on personal repos
- **Rulesets** with `github-actions[bot]` bypass are best-effort (often rejected on personal repos)
- **`GH_PAT`** (fine-grained PAT) lets `project-automation.yml` and the `ci.yml` cleanup job manage Projects and delete merged branches

## Merge settings

Squash merge only. **Auto-merge disabled** — every PR must be merged manually after CI passes.

The setup script applies merge settings via API. Also verify in GitHub UI: **Settings → General → Pull Requests** → uncheck **Allow auto-merge**.

## Required status checks

- Branch Naming Validation
- JS Quality - Lint Typecheck Test Build
- Python Quality - Ruff Mypy Pytest
- Commit And PR Convention Checks

## Apply protection to GitHub

```bash
bash .github/setup-branch-protection.sh
```

Optional repo override:

```bash
bash .github/setup-branch-protection.sh owner/repo
```

The script:

1. Patches repository merge settings (squash only, no auto-merge)
2. Creates/updates a ruleset for `main` with GitHub Actions bypass (best-effort)
3. Applies **classic** branch protection mirroring the same policy (authoritative)

Configuration reference: [`.github/branch-protection.yml`](../../.github/branch-protection.yml)

## After changing CI job names

Re-run `bash .github/setup-branch-protection.sh` so required status check contexts stay in sync.

## Deferred hardening

- Add repository secret **`GH_PAT`** before relying on Project Status automation or branch cleanup (replaces legacy `BRANCH_SYNC_PAT`)
- Add **Integration Tests** job to required checks after stable green runs on PRs
- Enable **signed commits** only when all maintainers use commit signing
- Migrate to organization repo + rulesets when Actions bypass is required
