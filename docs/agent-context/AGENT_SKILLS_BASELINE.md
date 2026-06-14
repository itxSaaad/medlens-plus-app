# Agent Skills Baseline (Codex, Claude, Copilot, Cursor)

This repository expects coding agents to operate as a software engineering firm.

## Operating Principles

- Architecture first, implementation second
- No hardcoded infra details in business logic
- Tests and docs are part of feature completion
- Safety and privacy constraints are non-negotiable
- **PR-only merges** to protected branches — no auto-merge, no workflow branch merges

## Provider-Agnostic Agent Behavior

- Agents must use adapter/factory boundaries already defined
- Any LLM change should happen via provider interface selection, not direct workflow rewrites
- Agent-generated code must preserve env-backed and flag-backed behavior

## CLI Discipline

- Use project scripts for repeatable workflows
- Prefer deterministic commands and explicit outputs
- No silent side-effects in scripts

## Quality Expectations

- Strong typing
- Test coverage for changed behavior
- Clear error handling and observability-safe logs
- Agent discipline: minimal diff, no placeholders, verify dependencies

## Provider-Specific Instruction Files

- `CLAUDE.md` — Claude Code entrypoint
- `CODEX.md` — Codex sessions
- `.github/copilot-instructions.md` — GitHub Copilot
- `.cursor/rules/*.mdc` — Cursor rules (see `.cursor/rules/README.md`)

## Skill matrix

| Layer | Purpose | Location |
|-------|---------|----------|
| **Consolidated** | 18 flat skills | `.cursor/skills/`, `.claude/skills/` |
| **References** | Upstream depth (on-demand) | `references/<upstream-skill-name>/` inside each skill |

**Full map:** [`RULES_AND_SKILLS_MAP.md`](./RULES_AND_SKILLS_MAP.md)  
**Provenance:** [`SKILLS_PROVENANCE.md`](./SKILLS_PROVENANCE.md)

| Tool | Index |
|------|-------|
| Claude | `.claude/skills/medlens/SKILL.md` |
| Cursor | `.cursor/skills/README.md` |

### Skills (18)

`safety-privacy`, `project-delivery`, `web-frontend`, `product-ux`, `ui-accessibility`, `web-performance`, `marketing-ui`, `technical-seo`, `content-seo`, `answer-engine-optimization`, `analytics-tagging`, `api-backend`, `ai-workflows`, `parser-pipeline`, `testing`, `code-review`, `devops`, `debugging`

Personal plugin installs (e.g. Jeffallan marketplace) are optional locally — the repo stays lean with consolidated skills only.
