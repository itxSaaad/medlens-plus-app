# Supply Chain Security

Checklist for dependency and CI supply-chain controls on `medlens-plus-app`. Most toggles are **GitHub UI** settings; repo files implement the rest.

## Repository controls (GitHub UI)

| Control | Where | Status |
| ------- | ----- | ------ |
| Dependency graph | **Settings → Code security and analysis → Dependency graph** | Enable |
| Dependabot alerts | **Settings → Code security → Dependabot alerts** | Enable |
| Dependabot security updates | Same page | Enable |
| Dependency review | **Settings → Code security → Dependency review** | Enable (blocks vulnerable deps on PRs when configured) |
| Action allowlist | **Settings → Actions → General → Allow specified actions** | GitHub-owned + verified creators only |
| Secret scanning | **Settings → Code security → Secret scanning** | Enable when available |
| Fork PR workflows | **Settings → Actions → Fork pull request workflows** | Require approval for outside collaborators |

## In-repo controls

| Control | Implementation |
| ------- | -------------- |
| Dependabot version updates | [`.github/dependabot.yml`](../.github/dependabot.yml) → `target-branch: main` |
| CodeQL advisory scanning | [`.github/workflows/codeql.yml`](../.github/workflows/codeql.yml) |
| npm audit (advisory) | `pnpm audit --audit-level=high` in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) (non-blocking) |
| Action pinning | Workflows pin `uses:` to full commit SHA with version comment |
| Branch protection + CODEOWNERS | [`.github/branch-protection.yml`](../.github/branch-protection.yml), [`BRANCH_PROTECTION_SETUP.md`](./BRANCH_PROTECTION_SETUP.md) |
| Conventional commits / semantic release | Commitlint + [`.releaserc.json`](../.releaserc.json) |
| PAT hygiene | Single `GH_PAT` secret — [`GITHUB_AUTOMATION_PAT.md`](./GITHUB_AUTOMATION_PAT.md) |

## Action pinning policy

Third-party Actions are pinned to immutable commit SHAs:

```yaml
uses: actions/checkout@df4cb1c069e1874edd31b4311f1884172cec0e10 # v6
```

When Dependabot opens a **GitHub Actions** version bump PR, verify the new SHA in the diff before merging to `main`.

## Fork PR safety

Workflows with write permissions must not check out and execute untrusted code from fork PRs:

- `pull_request_target` workflows ([`dependabot-retarget.yml`](../.github/workflows/dependabot-retarget.yml)) only post comments using `GH_PAT` — no build of fork code
- Standard `pull_request` workflows use `GITHUB_TOKEN` with read-only or scoped permissions

## Secret hygiene

| Do | Don't |
| -- | ----- |
| Store automation PAT as `GH_PAT` repository secret | Commit tokens or embed PAT in `git remote` for CI |
| Rotate `GH_PAT` quarterly | Reuse expired or leaked tokens |
| Delete `BRANCH_SYNC_PAT`, `CODACY_PROJECT_TOKEN` after migration | Keep redundant secrets |

## Codacy removal (manual UI)

Codacy was removed from repository files. Complete uninstall in GitHub:

1. **Settings → Integrations → Applications** → uninstall **Codacy**
2. **Settings → Secrets → Actions** → delete `CODACY_PROJECT_TOKEN`
3. **Settings → Code security** → confirm Codacy not listed
4. **Settings → Branches** → confirm no required check named "Codacy Static Analysis"

## Request Info bot

1. Install [Request Info](https://github.com/apps/request-info) on this repository
2. Config: [`.github/config.yml`](../.github/config.yml)
3. Create label `needs-more-info` if missing (**Issues → Labels**)

## Review cadence

| Cadence | Task |
| ------- | ---- |
| Weekly | Review CodeQL + Dependabot alerts under **Security** |
| Per PR | Confirm `pnpm audit` and CI green on `main` |
| Quarterly | Rotate `GH_PAT`; re-run action SHA audit after major Dependabot Actions PRs |

See also: [`TOOLING_SETUP.md`](../open-source/TOOLING_SETUP.md), [`GITHUB_AUTOMATION_PAT.md`](./GITHUB_AUTOMATION_PAT.md).
