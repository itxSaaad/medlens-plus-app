# GitHub Copilot Instructions for MedLens+

## Mission
Build MedLens+ as a safety-first, longitudinal medical report intelligence platform.

## Non-Negotiables
- Never diagnose disease.
- Never prescribe medicine.
- Never suggest dosage changes.
- Never replace doctor consultation.
- Always use report-provided reference ranges.
- Warn when comparing values from different labs.

## Engineering Defaults
- Use typed contracts and schema-first development.
- Keep provider integrations behind interfaces and factories.
- Keep config env-backed and feature-flag-backed.
- Add tests for any changed behavior.
- Update docs in the same PR for architecture/config/flow changes.

## Branch and PR Rules
- Branch from `main`; PR to `develop` (features) or `main` (hotfixes).
- Long-lived branches: `main`, `staging`, `develop` only.
- All merges to protected branches are **manual PR merges** — auto-merge disabled.
- Link a GitHub issue (`Closes #NNN`) in every PR.
- Include safety impact, user impact, and test evidence in PR body.

## Local Validation
Run before requesting review:
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## Reference Docs
- `AGENTS.md`
- `docs/product/GOLDEN_RULES.md`
- `docs/architecture/SYSTEM_ARCHITECTURE.md`
- `docs/ops/CONFIGURATION_AND_FLAGS.md`
- `docs/open-source/QUALITY_GATES.md`
- `docs/open-source/GITHUB_PROJECTS.md`
- `.cursor/skills/code-review-and-pr-quality/SKILL.md`
- `.cursor/skills/github-project-delivery/SKILL.md`
