# GitHub Automation PAT (`GH_PAT`)

Repository workflows that update protected branches, user Projects, or open issues/PRs need a **fine-grained Personal Access Token** stored as the `GH_PAT` repository secret. Create and rotate this token **only in the GitHub UI** — never commit a PAT to git or embed it in `git remote` URLs used by CI.

## Why one PAT

| Workflow | Needs |
| -------- | ----- |
| [`project-automation.yml`](../../.github/workflows/project-automation.yml) | Update user Project #2 Status field |
| [`ci.yml`](../../.github/workflows/ci.yml) cleanup job | Delete merged feature branches |

`GITHUB_TOKEN` cannot access user-owned Projects v2 reliably. `GH_PAT` replaces the legacy `BRANCH_SYNC_PAT` secret.

Trunk-based (single `main` branch) removed the cross-branch sync/drift automation (`sync-develop.yml`, `branch-drift.yml`, `dependabot-retarget.yml`) that previously needed this PAT too — see [`BRANCHING_STRATEGY.md`](../open-source/BRANCHING_STRATEGY.md) for why.

## Step 1 — Create fine-grained PAT

1. GitHub.com → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**
2. **Resource owner:** your account (`itxSaaad`)
3. **Repository access:** **Only select repositories** → `medlens-plus-app`
4. **Permissions:**

| Permission | Access | Used for |
| ---------- | ------ | -------- |
| Contents | Read and write | Delete merged feature branches |
| Metadata | Read | All API calls |
| Projects | Read and write | Project Status automation |

- **Expiration:** 90 days (rotate quarterly) or custom per org policy
- **Generate token** and copy the value once

## Step 2 — Add repository secret

1. Repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
2. Name: `GH_PAT`
3. Value: paste the token → **Add secret**

## Step 3 — Remove redundant secrets

After workflows succeed with `GH_PAT`, delete in **Settings → Secrets → Actions**:

- `BRANCH_SYNC_PAT` (replaced by `GH_PAT`)
- `CODACY_PROJECT_TOKEN` (if still present after Codacy uninstall)

Keep: `CODECOV_TOKEN`, and the automatic `GITHUB_TOKEN`.

## Rotation policy

| Interval | Action |
| -------- | ------ |
| Every 90 days (or before expiry) | Generate new fine-grained PAT with same scopes |
| Same day | Update `GH_PAT` secret in repository settings |
| After update | Revoke the old token in Developer settings |
| Verify | Merge a PR to `main` and confirm the cleanup job deletes the feature branch, or run Project Status automation manually |

## Security rules

- **Never** commit PATs to the repository or store them in workflow files
- **Never** use `git remote set-url` with an embedded PAT for CI; local maintainer scripts may use admin PAT separately
- Limit repository access to `medlens-plus-app` only
- Revoke immediately if leaked; audit **Settings → Security log**

## Troubleshooting

| Symptom | Likely cause |
| ------- | ------------- |
| Cleanup job: `GH_PAT is not set` | Secret missing or misnamed |
| Branch deletion HTTP 403 | PAT lacks **Contents: Read and write** or token owner is not admin |
| Project automation HTTP 403 | PAT lacks **Projects: Read and write**; confirm Project #2 includes this repo |
| `Resource not accessible` in logs | Workflow still using `GITHUB_TOKEN` instead of `GH_PAT` |

See also: [`BRANCH_PROTECTION_SETUP.md`](./BRANCH_PROTECTION_SETUP.md), [`SUPPLY_CHAIN_SECURITY.md`](./SUPPLY_CHAIN_SECURITY.md).
