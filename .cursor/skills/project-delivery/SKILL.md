---
name: project-delivery
description: GitHub Project delivery, branching, PR policy, MVP shipping, and manual promotion for MedLens+.
---

# Project Delivery

Use when picking work, shipping features, opening PRs, or promoting branches.

## Source of truth
- [GitHub Project #2](https://github.com/users/itxSaaad/projects/2) — issues #15–#60
- Epic/sprint context: `planning/epics/`, `planning/sprints/`

## Pick up work
1. Filter **Status = Ready** on the project board
2. Comment on issue; branch from `main`: `feat/TKT-XXX-slug`
3. PR to `develop` with `Closes #NNN`
4. Status: In Progress → In Review → Done

## PR policy
- PR-only merges to `develop`, `staging`, `main` — **no auto-merge**
- Conventional Commits; minimal diff; one ticket per PR
- Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`
- PR body: summary, safety impact, privacy impact, test evidence, docs updated

## MVP delivery
1. Read issue acceptance criteria
2. Interfaces + factories + env-backed settings — no hardcoded providers
3. Tests for changed behavior; feature flags for staged rollout
4. Update docs when user-facing

## Promotion (manual)
```bash
gh pr create --head develop --base staging --title "chore: promote develop to staging"
gh pr create --head staging --base main --title "chore: promote staging to main"
```
Backmerge PRs from `main` → `staging` / `develop` are opened by CI — merge manually.

## Release
- `semantic-release` on `main` tags `vX.Y.Z` after CI

Maintainer delivery sync: `python .github/maintainer/sync-delivery.py --all`

Rules: `.cursor/rules/engineering-standards.mdc`, `.cursor/rules/github-delivery.mdc`
