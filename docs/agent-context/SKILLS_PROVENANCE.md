# Skills Provenance

Upstream content vendored into consolidated skills under `.cursor/skills/` and `.claude/skills/`.  
MedLens constraints live in each skill's `SKILL.md`; upstream catalogs live in `references/<upstream-skill-name>/`.

No sync script — update references manually when refreshing upstream content.

## Reference map

| Consolidated skill | Reference folder | Upstream repo | Path in repo | Commit SHA | License |
|------------------|------------------|---------------|--------------|------------|---------|
| `web-frontend` | `react-best-practices` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | `skills/react-best-practices` | `f8a72b9603728bb92a217a879b7e62e43ad76c81` | MIT |
| `web-frontend` | `composition-patterns` | vercel-labs/agent-skills | `skills/composition-patterns` | `f8a72b9603728bb92a217a879b7e62e43ad76c81` | MIT |
| `web-frontend` | `bencium-controlled-ux-designer` | [bencium/bencium-claude-code-design-skill](https://github.com/bencium/bencium-claude-code-design-skill) | `bencium-controlled-ux-designer/skills/bencium-controlled-ux-designer` | `c6f5a718d43ba5a5d540bf74efbd4dba81400c72` | See upstream |
| `web-frontend` | `nextjs-developer` | [Jeffallan/claude-skills](https://github.com/Jeffallan/claude-skills) | `skills/nextjs-developer` | `e8be415bc94d8d6ebddc2fb50e5d03c6e27d4319` | MIT |
| `web-frontend` | `typescript-pro` | Jeffallan/claude-skills | `skills/typescript-pro` | `e8be415bc94d8d6ebddc2fb50e5d03c6e27d4319` | MIT |
| `ui-accessibility` | `web-design-guidelines` | vercel-labs/agent-skills | `skills/web-design-guidelines` | `f8a72b9603728bb92a217a879b7e62e43ad76c81` | MIT |
| `ui-accessibility` | `audit` | [accesslint/claude-marketplace](https://github.com/accesslint/claude-marketplace) | `plugins/accesslint/skills/audit` | `ceb3fa80fc8be8d8959f5b3eb812ac8cc33a5a59` | MIT |
| `ui-accessibility` | `scan` | accesslint/claude-marketplace | `plugins/accesslint/skills/scan` | `ceb3fa80fc8be8d8959f5b3eb812ac8cc33a5a59` | MIT |
| `ui-accessibility` | `diff` | accesslint/claude-marketplace | `plugins/accesslint/skills/diff` | `ceb3fa80fc8be8d8959f5b3eb812ac8cc33a5a59` | MIT |
| `marketing-ui` | `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills) | `skills/frontend-design` | `57546260929473d4e0d1c1bb75297be2fdfa1949` | See upstream LICENSE |
| `api-backend` | `fastapi-expert` | Jeffallan/claude-skills | `skills/fastapi-expert` | `e8be415bc94d8d6ebddc2fb50e5d03c6e27d4319` | MIT |
| `api-backend` | `python-pro` | Jeffallan/claude-skills | `skills/python-pro` | `e8be415bc94d8d6ebddc2fb50e5d03c6e27d4319` | MIT |
| `api-backend` | `api-designer` | Jeffallan/claude-skills | `skills/api-designer` | `e8be415bc94d8d6ebddc2fb50e5d03c6e27d4319` | MIT |
| `api-backend` | `postgres-pro` | Jeffallan/claude-skills | `skills/postgres-pro` | `e8be415bc94d8d6ebddc2fb50e5d03c6e27d4319` | MIT |
| `ai-workflows` | `prompt-engineer` | Jeffallan/claude-skills | `skills/prompt-engineer` | `e8be415bc94d8d6ebddc2fb50e5d03c6e27d4319` | MIT |
| `ai-workflows` | `rag-architect` | Jeffallan/claude-skills | `skills/rag-architect` | `e8be415bc94d8d6ebddc2fb50e5d03c6e27d4319` | MIT |
| `testing` | `test-master` | Jeffallan/claude-skills | `skills/test-master` | `e8be415bc94d8d6ebddc2fb50e5d03c6e27d4319` | MIT |
| `code-review` | `code-reviewer` | Jeffallan/claude-skills | `skills/code-reviewer` | `e8be415bc94d8d6ebddc2fb50e5d03c6e27d4319` | MIT |
| `code-review` | `secure-code-guardian` | Jeffallan/claude-skills | `skills/secure-code-guardian` | `e8be415bc94d8d6ebddc2fb50e5d03c6e27d4319` | MIT |
| `debugging` | `debugging-wizard` | Jeffallan/claude-skills | `skills/debugging-wizard` | `e8be415bc94d8d6ebddc2fb50e5d03c6e27d4319` | MIT |

## MedLens-native skills (no upstream references)

`safety-privacy`, `project-delivery`, `parser-pipeline`, `devops`, `technical-seo`, `content-seo`, `answer-engine-optimization`, `web-performance`, `analytics-tagging`, `product-ux` (checklists in each skill's `references/`)

## Security note

Review any upstream `scripts/` before updating references. See [Snyk ToxicSkills guidance](https://snyk.io/articles/top-claude-skills-ui-ux-engineers/).
