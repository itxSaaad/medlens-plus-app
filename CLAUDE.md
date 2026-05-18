# CLAUDE.md

Claude Code operating instructions for MedLens+.

## First-Run Checklist
1. Read `README.md`
2. Read `AGENTS.md`
3. Read `docs/product/GOLDEN_RULES.md`
4. Read `docs/architecture/SYSTEM_ARCHITECTURE.md`
5. Pick one ticket from `planning/tickets/`

## Execution Rules
- Follow the 3-branch model: `develop` -> `staging` -> `main`
- Use adapter/factory boundaries; do not hardcode providers in workflows
- Keep all behavior env-backed and feature-flag-backed
- Treat tests + docs as part of done criteria
- Never bypass medical safety guardrails

## Required Validation Before PR
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## Skill Playbooks
- `docs/agent-context/skills/01-repo-governance.md`
- `docs/agent-context/skills/02-mvp-feature-delivery.md`
- `docs/agent-context/skills/03-safety-and-privacy-gate.md`
- `docs/agent-context/skills/04-ci-cd-and-releases.md`
