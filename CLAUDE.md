# CLAUDE.md

Claude Code instructions for MedLens+.

## First run
1. `README.md`, `AGENTS.md`, `docs/product/GOLDEN_RULES.md`
2. `docs/architecture/SYSTEM_ARCHITECTURE.md`
3. Pick a **Ready** issue on [Project #2](https://github.com/users/itxSaaad/projects/2)

## Monorepo

| Path | Role |
|------|------|
| `apps/web` | Next.js 16 — see `apps/web/CLAUDE.md` |
| `apps/api` | FastAPI — see `apps/api/CLAUDE.md` |
| `packages/types` | Shared TS contracts |
| `packages/schemas` | OpenAPI / JSON schema strategy |
| `packages/parsers` | Extraction guidance |
| `packages/agents` | Agent layer standards |

## Execution
- Branch from `main`; PR to `develop` (features) or `main` (hotfixes)
- Naming: [`docs/open-source/NAMING_CONVENTIONS.md`](docs/open-source/NAMING_CONVENTIONS.md) — `feat/TKT-NNN-slug`, conventional commits, semantic PR title
- Adapter/factory boundaries; env + feature flags
- PR-only merges; auto-merge disabled
- Never bypass medical safety guardrails

## Validation

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

## Skills and rules
- Index: `.claude/skills/medlens/SKILL.md`
- Discipline: `.claude/rules/agent-discipline.md`
- Rules map: `docs/agent-context/RULES_AND_SKILLS_MAP.md`

## graphify
When `graphify-out/graph.json` exists:
- `graphify query "<question>"` before broad file reads
- `graphify update .` after structural code changes
