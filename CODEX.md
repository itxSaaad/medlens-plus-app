# CODEX.md

Codex operating instructions for MedLens+.

## Scope and Quality
- Build like a production engineering team, not a prototype script.
- Keep edits minimal, modular, and cherry-pick safe.
- Preserve typed contracts across frontend/backend boundaries.

## Architecture Guardrails
- Backend business logic must depend on interfaces in `apps/api/src/api/core/interfaces.py`
- Provider resolution must happen through `apps/api/src/api/core/factories.py`
- Runtime behavior must be controlled by `apps/api/src/api/core/settings.py`
- Frontend and backend share contracts through schemas/OpenAPI, not runtime coupling

## Safety Guardrails
- Never add diagnosis or prescription flows.
- Keep comparisons tied to uploaded lab ranges.
- Add warning paths for cross-lab comparisons.
- Ensure AI outputs pass safety post-processing.

## Required Commands Before Raising PR
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## Skill Playbooks
Read `.claude/skills/medlens/SKILL.md` for the index. Modular rules: `.claude/rules/agent-discipline.md`. Map: `docs/agent-context/RULES_AND_SKILLS_MAP.md`.
