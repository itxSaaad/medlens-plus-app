# PR Review and Protection Policy

This document defines merge control for enterprise-grade open-source collaboration.

## Mandatory PR Rules

1. No direct pushes to `main`, `staging`, or `develop`.
2. Every code change must come via pull request.
3. At least 1 approval is required before merge.
4. Required checks must pass before merge:
   - CI / JS Quality
   - CI / Python Quality
   - CI / Commit Message Lint
   - PR Title Lint
5. CODEOWNERS review required for protected branches.
6. Resolve all conversations before merge.

## Branch Promotion Rules

- `feature/*` -> `develop`
- `develop` -> `staging`
- `staging` -> `main`

Only promote forward after validations pass.

## Quality Expectations

- No "vibe-coded" unreviewed logic.
- Code must be measurable, test-backed, and maintainable.
- New behavior requires tests and doc updates in same PR.
- Safety-critical language changes require explicit reviewer note.

## Repository Settings (GitHub UI)

Apply branch protection or rulesets for `develop`, `staging`, and `main`:

- Require pull request before merging
- Require approvals (>=1; recommend 2 for `main`)
- Require review from Code Owners
- Require status checks to pass before merging
- Require conversation resolution before merging
- Restrict force pushes and deletions
- Include administrators in restrictions

## Recommended Merge Strategy

- Use `Squash and merge` for feature PRs into `develop`.
- Use `Create a merge commit` for `develop -> staging -> main` promotions to preserve release trail.
