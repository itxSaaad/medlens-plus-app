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
- **Target branch:** `develop` (all npm, pip, and GitHub Actions version updates)
- **Policy:** Never merge Dependabot PRs directly to `main`; land on `develop` first
- **No install required** — enabled automatically when the config file is on `main`
- **CI:** Branch naming validation bypasses `dependabot/*`; Dependabot `chore(deps):` / `chore(deps-dev):` commits already pass commitlint
- **Lockfile conflicts:** When several npm Dependabot PRs overlap, open one manual branch with all version bumps and run `pnpm install` once — do **not** hand-merge `pnpm-lock.yaml` conflict hunks; delete the lockfile and regenerate if needed

### Main-first limitation

Dependabot **cannot** create a branch from `main` while opening the PR to `develop`. Version updates always branch from the `target-branch` commit (`develop` HEAD).

| Update type | PR target | Branch source |
| ----------- | --------- | ------------- |
| Version updates | `develop` | `develop` HEAD |
| Security updates | **`main`** (default branch) | `main` HEAD |

**Workaround for version updates:** Keep `develop` aligned with `main` via [`sync-develop.yml`](../../.github/workflows/sync-develop.yml) so Dependabot reads the same lockfiles as production.

**Security PRs to `main`:** [`dependabot-retarget.yml`](../../.github/workflows/dependabot-retarget.yml) comments with retarget instructions. Manually change the PR base to `develop` or cherry-pick the bump — do not merge security PRs directly to `main`.

## Turborepo (monorepo task orchestration)

- **Config:** [`turbo.json`](../../turbo.json)
- **Tasks:** `lint`, `typecheck`, `test`, `build`, `test:integration` across pnpm workspaces
- **Root commands:** `pnpm lint`, `typecheck`, `test`, `build` delegate to `turbo run`
- **CI cache:** GitHub Actions restores `.turbo/` keyed on `pnpm-lock.yaml` + `turbo.json` (no Vercel Remote Cache)
- **Filter examples:**
  - `pnpm exec turbo run build --filter=@medlens/web...` — web + upstream packages
  - `pnpm exec turbo run lint typecheck test --filter=@medlens/api` — API only

## Local formatting

- **Command:** `pnpm format` at repo root (Prettier for JS/TS/JSON/YAML/CSS, `ruff format` for API, Markdownlint `--fix` for docs)
- **Check only:** `pnpm format:check` (Prettier dry run)
- **Editor:** `.editorconfig` + `.vscode/settings.json` (format on save; Prettier, Ruff, Markdownlint)
- **On commit:** Husky `pre-commit` runs `lint-staged` on **staged files only** (skips graphify, `.cursor`, graphify skills); full `pnpm lint` runs in CI
- **Python deps:** `pnpm install` runs `uv sync --directory apps/api --frozen --group dev` automatically when `uv` is on PATH (via `postinstall`)

## Branch promotion and drift

- **Promotion:** manual PR `develop` → `main`, merged with **"Rebase and merge"** (fast-forward in the normal case — see [`RELEASE_PROCESS.md`](./RELEASE_PROCESS.md)); no title convention or pre-check script needed
- **Develop sync:** [`.github/workflows/sync-develop.yml`](../../.github/workflows/sync-develop.yml) is a hotfix-divergence safety net — no-ops when `main`/`develop` already match, which is the normal post-promotion state (requires `GH_PAT`)
- **Drift detection:** [`.github/workflows/branch-drift.yml`](../../.github/workflows/branch-drift.yml) — weekly advisory issue
- **Bot PRs:** Dependabot targets `develop`; merge manually after review

### Manual cleanup after removing Codacy

See [`docs/ops/SUPPLY_CHAIN_SECURITY.md`](../ops/SUPPLY_CHAIN_SECURITY.md#codacy-removal-manual-ui) for the full checklist:

- Uninstall the [Codacy GitHub App](https://github.com/apps/codacy) from this repository
- Delete the `CODACY_PROJECT_TOKEN` repository secret (if present)

### Request Info bot

- **Config:** [`.github/config.yml`](../../.github/config.yml)
- **Install:** [Request Info app](https://github.com/apps/request-info) → configure for `medlens-plus-app`
- **Label:** create `needs-more-info` under **Issues → Labels** if missing

### GitHub automation PAT

- **Secret:** `GH_PAT` — see [`docs/ops/GITHUB_AUTOMATION_PAT.md`](../ops/GITHUB_AUTOMATION_PAT.md)
- **Replaces:** `BRANCH_SYNC_PAT` (delete after migration)

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
