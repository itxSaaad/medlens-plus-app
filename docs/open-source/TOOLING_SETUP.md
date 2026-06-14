# Third-Party Tooling Setup

Install these GitHub Apps on `itxSaaad/medlens-plus-app` and add repository secrets where noted.

## CodeRabbit (PR review + issue enrichment)

- **Config:** [`.coderabbit.yaml`](../../.coderabbit.yaml)
- **PR review:** **Manual only** — comment `@coderabbitai review` (incremental) or `@coderabbitai full review` on the PR when ready
- **File limit:** CodeRabbit skips PRs over **150 changed files**; split large stacks or review by directory (`coderabbit review --dir`)
- **Issue enrichment (free/OSS beta):** Duplicate detection, related issues/PRs, smart labels on new issues
- **Planning:** Auto-plan on `type:story` issues (engineering plans only — not medical advice); comment `@coderabbitai plan` on any issue
- **Install:** [CodeRabbit GitHub App](https://github.com/apps/coderabbitai)

## Codecov (coverage dashboard)

- **Config:** [`codecov.yml`](../../codecov.yml)
- **Install:** [Codecov project](https://codecov.io/gh/itxSaaad/medlens-plus-app)
- **Secret:** `CODECOV_TOKEN` — copy from Codecov project settings → Repository upload token

## Codacy (quality dashboard)

- **Config:** [`.codacy.yml`](../../.codacy.yml)
- **Workflow:** [`.github/workflows/codacy.yml`](../../.github/workflows/codacy.yml)
- **Install:** [Codacy GitHub App](https://github.com/apps/codacy)
- **Secret:** `CODACY_PROJECT_TOKEN` — from Codacy → Project → Settings → Integrations

## Dependabot (dependency updates)

- **Config:** [`.github/dependabot.yml`](../../.github/dependabot.yml)
- **Target branch:** `develop` (all npm, pip, and GitHub Actions updates)
- **Policy:** Never merge Dependabot PRs directly to `main`; land on `develop` first
- **No install required** — enabled automatically when the config file is on `main`

## Branch promotion, backmerge, and drift

- **Promotion:** manual PRs only — \`develop\` → \`staging\` → \`main\` (see [`BRANCHING_STRATEGY.md`](./BRANCHING_STRATEGY.md))
- **Backmerge:** [`.github/workflows/branch-backmerge.yml`](../../.github/workflows/branch-backmerge.yml) — on push to `main`, **opens PRs only** to `staging` and `develop` (no auto-merge)
- **Drift detection:** [`.github/workflows/branch-drift.yml`](../../.github/workflows/branch-drift.yml) — weekly advisory issue
- **Bot PRs:** Dependabot targets `develop`; merge manually after review

## GitHub Copilot (PR review)

- **Instructions:** [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md)
- **PR review:** **Manual only** — do not enable automatic Copilot code review on PRs
- **Disable auto-review (one-time per repo):**
  1. **Settings → Copilot → Code review** — turn off automatic reviews for this repository
  2. **Settings → Rules → Rulesets** — remove or edit any ruleset with **Automatically request Copilot code review**
  3. **github.com/settings/copilot** — set **Automatic Copilot code review** to **Disabled** on your account
- **Request review:** Assign **Copilot** as a reviewer on the PR when you want feedback (PRs over ~300 changed files are skipped)
- **Recommended PR size:** ≤150 changed files for useful AI review; ≤400 lines meaningful diff for human review (see [`PR_REVIEW_AND_PROTECTION_POLICY.md`](./PR_REVIEW_AND_PROTECTION_POLICY.md))

## Graphify (codebase knowledge graph)

- **CLI:** `uv tool install graphifyy`
- **Update after code changes:** `pnpm graphify:update`
- **CI:** Graphify sync check runs on PRs touching `apps/`, `packages/`, `docs/`

### Local git hooks (Husky)

Hooks in [`.husky/`](../../.husky/) refresh the knowledge graph automatically:

| Hook | When | Behavior |
|------|------|----------|
| `post-commit` | After each local commit | Incremental `graphify update .` |
| `post-checkout` | Branch switch | Full `graphify update . --force` |
| `post-merge` | After `git pull` (merge) | Full `graphify update . --force` |

**Skip hooks:** `SKIP_GRAPHIFY_HOOK=1 git checkout <branch>` or `SKIP_GRAPHIFY_HOOK=1 git pull`

Hooks use Husky (`pnpm prepare`); do not run `graphify hook install` separately — it writes to `.git/hooks` and conflicts with Husky.

Committed artifacts: `graphify-out/graph.json` and `graphify-out/GRAPH_REPORT.md` only (see [`.gitignore`](../../.gitignore)).

## Branch protection (one-time)

See [`docs/ops/BRANCH_PROTECTION_SETUP.md`](../ops/BRANCH_PROTECTION_SETUP.md).
