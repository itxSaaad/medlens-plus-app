---
name: devops
description: GitHub Actions CI/CD, Docker, env secrets, feature flags, and PR-only deployment gates.
---

# DevOps

Use when changing workflows, release config, Docker, or deployment gates.

## Rules
- PR-only merges; no secrets in repo files
- CI gates all PRs to `develop`, `staging`, `main`
- `semantic-release` on `main` creates `vX.Y.Z` tags after CI
- Deploy workflow is gated — do not enable without maintainer approval
- Env and flags: `docs/ops/CONFIGURATION_AND_FLAGS.md`

## Validation
```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

Review: `.github/workflows/ci.yml`, `release.yml`, `deploy.yml`

Rule: `.cursor/rules/devops-ci.mdc`
