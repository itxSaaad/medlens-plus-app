# Branch Protection Setup (One-Time)

Run once per repository or after changing required CI checks.

## Prerequisites

- `gh` CLI authenticated with `admin:repo` or equivalent
- Repository admin access

## Current policy (solo maintainer)

- **PR required** on `develop`, `staging`, and `main`
- **Required CI checks** must pass (see list below)
- **0 approving reviews** — CODEOWNERS review gate is disabled until a second reviewer exists
- `.github/CODEOWNERS` is kept for future use; it has no effect while `require_code_owner_reviews` is `false`

### Re-enable CODEOWNERS reviews later

Update [`.github/branch-protection.yml`](../../.github/branch-protection.yml) and [`.github/setup-branch-protection.sh`](../../.github/setup-branch-protection.sh):

- `require_code_owner_reviews: true`
- `required_approving_review_count: 1` on `develop`, `staging`, and `main` (main was previously 2)

Then re-run the setup script below.

## Merge settings

Squash merge only. **Auto-merge disabled** — every PR must be merged manually after CI passes.

```powershell
$mergeSettings = @{
    allow_squash_merge = $true
    allow_merge_commit = $false
    allow_rebase_merge = $false
    allow_auto_merge = $false
    delete_branch_on_merge = $true
} | ConvertTo-Json
$mergeSettings | gh api -X PATCH repos/itxSaaad/medlens-plus-app --input -
```

Also verify in GitHub UI: **Settings → General → Pull Requests** → uncheck **Allow auto-merge**.

Before merging any promotion or backmerge PR, confirm no open PR has auto-merge queued (should be impossible once disabled).

## Required status checks

- Branch Naming Validation
- JS Quality - Lint Typecheck Test Build
- Python Quality - Ruff Mypy Pytest
- Commit And PR Convention Checks
- Graphify Sync

## Apply protection to GitHub

**Unix / Git Bash:**

```bash
bash .github/setup-branch-protection.sh
```

**PowerShell (equivalent):**

```powershell
$checks = @(
    "Branch Naming Validation",
    "JS Quality - Lint Typecheck Test Build",
    "Python Quality - Ruff Mypy Pytest",
    "Commit And PR Convention Checks",
    "Graphify Sync"
)

function New-ProtectionBody([int]$ReviewCount) {
    return @{
        required_status_checks = @{ strict = $true; contexts = $checks }
        enforce_admins = $false
        required_pull_request_reviews = @{
            dismiss_stale_reviews = $true
            require_code_owner_reviews = $false
            require_last_push_approval = $false
            required_approving_review_count = $ReviewCount
        }
        restrictions = $null
        allow_force_pushes = $false
        allow_deletions = $false
    } | ConvertTo-Json -Depth 6
}

@(
    @{ Name = "develop"; Reviews = 0 },
    @{ Name = "staging"; Reviews = 0 },
    @{ Name = "main"; Reviews = 0 }
) | ForEach-Object {
    New-ProtectionBody -ReviewCount $_.Reviews | gh api -X PUT "repos/itxSaaad/medlens-plus-app/branches/$($_.Name)/protection" --input -
}
```

Squash merge only on `develop`, `staging`, and `main`. Feature branches are deleted after merge.
