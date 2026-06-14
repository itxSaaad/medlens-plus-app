---
name: project-delivery
description: GitHub Project delivery, branching, PR policy, MVP shipping, and manual promotion for MedLens+.
---

# Project Delivery

Use when picking work, shipping features, opening PRs, or promoting branches.

## Source of truth
- [GitHub Project #2](https://github.com/users/itxSaaad/projects/2) — issues #15–#60
- Naming rules: `docs/open-source/NAMING_CONVENTIONS.md` (**CI-enforced**)

## Pick up work
1. Filter **Status = Ready** on the project board
2. Comment on issue; branch from `main`: `feat/TKT-XXX-slug` (or `chore/scope` for repo governance)
3. PR to `develop` with `Closes #NNN`; title = conventional commit format
4. Status: In Progress → In Review → Done

## Commits and CI
- Conventional Commits; **lowercase subject**; body lines **≤100 characters**
- Husky runs commitlint on every commit; CI re-checks all PR commits
- Before push: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`
- After structural changes: run `pnpm graphify:update` locally (artifacts stay gitignored)

## PR policy
- PR-only merges to `develop` and `main` — **no auto-merge**
- Use [PR template](https://github.com/itxSaaad/medlens-plus-app/blob/main/.github/pull_request_template.md)
- Recommended ≤150 changed files for AI review; modular commits on feature branch

## MVP delivery
1. Read issue acceptance criteria
2. Interfaces + factories + env-backed settings — no hardcoded providers
3. Tests for changed behavior; feature flags for staged rollout
4. Update docs when user-facing

## Promotion (manual)
```bash
gh pr create --head develop --base main --title "chore: promote develop to main"
```
Backmerge: open PR `main` → `develop` manually after hotfixes or promotion.

## Release
- `semantic-release` on `main` tags `vX.Y.Z` after CI

Maintainer delivery sync: `python .github/maintainer/sync-delivery.py --all`

Rules: `.cursor/rules/engineering-standards.mdc`, `.cursor/rules/github-delivery.mdc`
