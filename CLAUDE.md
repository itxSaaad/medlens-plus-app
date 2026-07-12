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
| `packages/logger` | Shared logging utilities |
| `turbo.json` | Turborepo task pipeline (lint, typecheck, test, build) |
| `packages/schemas` | OpenAPI / JSON schema strategy |
| `packages/parsers` | Extraction guidance |
| `packages/agents` | Agent layer standards |

## Execution
- Trunk-based: branch from `main`, PR back to `main` (squash merge). No `develop` branch.
- Naming: [`docs/open-source/NAMING_CONVENTIONS.md`](docs/open-source/NAMING_CONVENTIONS.md) — `feat/TKT-NNN-slug`, conventional commits, semantic PR title
- **Every commit message must pass `commitlint.config.cjs`** (`@commitlint/config-conventional`) or the required `Commit And PR Convention Checks` CI job fails the PR: `<type>(<scope>): <subject>` header, valid `type` (`feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `release`, etc.), header ≤100 chars, blank line between header/body/footer. `body-max-line-length` is disabled (commit bodies routinely contain unwrappable URLs, e.g. Dependabot changelog links) — still wrap prose by hand for readability. Run `pnpm exec commitlint --from HEAD~1 --to HEAD` locally before pushing if unsure.
- Adapter/factory boundaries; env + feature flags
- PR-only merges; auto-merge disabled
- Never bypass medical safety guardrails

## Validation

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

Turborepo orchestrates workspace tasks (`turbo.json`). CI caches `.turbo/` via GitHub Actions.

## Skills and rules
- Index: `.claude/skills/medlens/SKILL.md`
- Discipline: `.claude/rules/agent-discipline.md`
- Rules map: `docs/agent-context/RULES_AND_SKILLS_MAP.md`

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
