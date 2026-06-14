# Third-Party Tooling Setup

Install these GitHub Apps on `itxSaaad/medlens-plus-app` and add repository secrets where noted.

## CodeRabbit (PR review + issue enrichment)

- **Config:** [`.coderabbit.yaml`](../../.coderabbit.yaml)
- **PR review:** Auto-review on PRs to `main`, `develop`, `staging`
- **Issue enrichment (free/OSS beta):** Duplicate detection, related issues/PRs, smart labels on new issues
- **Planning:** Auto-plan on `type:story` issues (engineering plans only — not medical advice); comment `@coderabbitai plan` on any issue
- **Install:** https://github.com/apps/coderabbitai

## Codecov (coverage dashboard)

- **Config:** [`codecov.yml`](../../codecov.yml)
- **Install:** https://codecov.io/gh/itxSaaad/medlens-plus-app
- **Secret:** `CODECOV_TOKEN` — copy from Codecov project settings → Repository upload token

## Codacy (quality dashboard)

- **Config:** [`.codacy.yml`](../../.codacy.yml)
- **Workflow:** [`.github/workflows/codacy.yml`](../../.github/workflows/codacy.yml)
- **Install:** https://github.com/apps/codacy
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

## Graphify (codebase knowledge graph)

- **CLI:** `uv tool install graphifyy`
- **Update after code changes:** `pnpm graphify:update`
- **CI:** Graphify sync check runs on PRs touching `apps/`, `packages/`, `docs/`

## Branch protection (one-time)

See [`docs/ops/BRANCH_PROTECTION_SETUP.md`](../ops/BRANCH_PROTECTION_SETUP.md).
