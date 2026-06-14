# Cursor Rules (MedLens+)

Rules live as `.mdc` files with YAML frontmatter. See [Cursor docs](https://cursor.com/docs/rules).

## Always-on (keep lean)

| File | Purpose |
|------|---------|
| `engineering-standards.mdc` | Architecture, schema-first, validation commands |
| `medical-safety.mdc` | Golden rules — non-negotiable |
| `agent-discipline.mdc` | Minimal diff, no placeholders, verify deps |
| `graphify.mdc` | Explore via graphify before raw grep/read |

## On-demand (glob or description)

| File | Activates when |
|------|----------------|
| `nextjs-frontend.mdc` | `apps/web/**`, `packages/types/**` |
| `fastapi-backend.mdc` | `apps/api/**` |
| `langgraph-ai-workflows.mdc` | workflows, `packages/agents/**` |
| `testing.mdc` | test files |
| `devops-ci.mdc` | `.github/**`, Dockerfiles |
| `github-delivery.mdc` | Issue/PR/delivery work (agent-requested) |
| `pr-quality-gate.mdc` | `apps/**`, `packages/**` |
| `frontend-quality.mdc` | `apps/web/**` — clinical UI skills |
| `technical-seo.mdc` | `apps/web/**` — technical SEO + links to content-seo & AEO skills |

Skills: `.cursor/skills/README.md`  
Map: `docs/agent-context/RULES_AND_SKILLS_MAP.md`
