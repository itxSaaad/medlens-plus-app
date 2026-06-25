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

- **Config:** [`codecov.yml`](../../codecov.yml) — flags scoped to `apps/web` and `apps/api`; ignores tests, graphify artifacts, and agent tooling paths
- **Install:** [Codecov project](https://codecov.io/gh/itxSaaad/medlens-plus-app)
- **Secret:** `CODECOV_TOKEN` — copy from Codecov project settings → Repository upload token

## CodeQL (security scanning)

- **Workflow:** [`.github/workflows/codeql.yml`](../../.github/workflows/codeql.yml)
- **Config:** [`.github/codeql/codeql-config.yml`](../../.github/codeql/codeql-config.yml)
- **Languages:** JavaScript/TypeScript (`apps/web`, `packages/*`) and Python (`apps/api`)
- **Schedule:** Weekly Monday 06:00 UTC + on every PR/push to `main` and `develop`
- **Policy:** **Advisory** — does not block merges; review alerts under **Security → Code scanning**
- **Enable (one-time):** **Settings → Code security and analysis** → ensure **Code scanning** is enabled after the workflow is on `main`
- **Promote to required:** optional after 1–2 clean weeks (add job name to branch protection script)

## Dependabot (dependency updates)

- **Config:** [`.github/dependabot.yml`](../../.github/dependabot.yml)
- **Target branch:** `develop` (all npm, pip, and GitHub Actions updates)
- **Policy:** Never merge Dependabot PRs directly to `main`; land on `develop` first
- **No install required** — enabled automatically when the config file is on `main`
- **CI:** Branch naming validation bypasses `dependabot/*`; Dependabot `chore(deps):` / `chore(deps-dev):` commits already pass commitlint
- **Lockfile conflicts:** When several npm Dependabot PRs overlap, open one manual branch with all version bumps and run `pnpm install` once — do **not** hand-merge `pnpm-lock.yaml` conflict hunks; delete the lockfile and regenerate if needed

## Local formatting

- **Command:** `pnpm format` at repo root (Prettier for JS/TS/JSON/YAML/CSS, `ruff format` for API, Markdownlint `--fix` for docs)
- **Check only:** `pnpm format:check` (Prettier dry run)
- **Editor:** `.editorconfig` + `.vscode/settings.json` (format on save; Prettier, Ruff, Markdownlint)
- **On commit:** Husky `pre-commit` runs `lint-staged` on **staged files only** (skips graphify, `.cursor`, graphify skills); full `pnpm lint` runs in CI

## Branch promotion and drift

- **Promotion:** manual PR `develop` → `main` with **semantic squash title** (see [`RELEASE_PROCESS.md`](./RELEASE_PROCESS.md)); run `bash scripts/suggest-promotion-title.sh` first
- **Develop sync:** [`.github/workflows/sync-develop.yml`](../../.github/workflows/sync-develop.yml) aligns `develop` after `main` pushes
- **Drift detection:** [`.github/workflows/branch-drift.yml`](../../.github/workflows/branch-drift.yml) — weekly advisory issue
- **Bot PRs:** Dependabot targets `develop`; merge manually after review

### Manual cleanup after removing Codacy

- Uninstall the [Codacy GitHub App](https://github.com/apps/codacy) from this repository
- Delete the `CODACY_PROJECT_TOKEN` repository secret (if present)

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
- **Update:** `pnpm graphify:update` when structure changes (local only; **not committed**)
- **Output:** `graphify-out/` is in [`.gitignore`](../../.gitignore) — each machine builds its own graph

### Local git hooks (Husky)

| Hook | When | Behavior |
| ------ | ------ | ---------- |
| `pre-commit` | Before each commit | **Staged files only:** Prettier, ESLint (web), Ruff (api), Markdownlint — skips `graphify-out/**`, `.cursor/**`, graphify skills |
| `post-checkout` | Branch switch | Full `graphify update . --force` (writes to local `graphify-out/` only) |
| `post-merge` | After `git pull` (merge) | Full `graphify update . --force` (local only) |

**Skip graphify hooks:** `SKIP_GRAPHIFY_HOOK=1 git checkout <branch>` or `SKIP_GRAPHIFY_HOOK=1 git pull`

Hooks use Husky (`pnpm prepare`). Do **not** run `graphify hook install` — conflicts with Husky.

## Branch protection (one-time)

See [`docs/ops/BRANCH_PROTECTION_SETUP.md`](../ops/BRANCH_PROTECTION_SETUP.md).
