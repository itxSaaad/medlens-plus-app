# MedLens+

[![CI - Quality And Governance](https://img.shields.io/github/actions/workflow/status/itxSaaad/medlens-plus-app/ci.yml?branch=main&label=CI)](./.github/workflows/ci.yml)
[![Release](https://img.shields.io/github/actions/workflow/status/itxSaaad/medlens-plus-app/release.yml?branch=main&label=Release)](./.github/workflows/release.yml)
[![codecov](https://codecov.io/gh/itxSaaad/medlens-plus-app/graph/badge.svg?token=)](https://codecov.io/gh/itxSaaad/medlens-plus-app)
[![CodeQL](https://github.com/itxSaaad/medlens-plus-app/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/itxSaaad/medlens-plus-app/actions/workflows/codeql.yml)
[![Project Board](https://img.shields.io/badge/project-MedLens%2B-blue)](https://github.com/users/itxSaaad/projects/2)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Conventional Commits](https://img.shields.io/badge/commits-conventional-brightgreen.svg)](https://www.conventionalcommits.org/)

MedLens+ is a safety-first, longitudinal medical report intelligence platform that turns fragmented lab reports into clear, doctor-ready timelines.

## Product Principles

- Never diagnose, prescribe, or replace a doctor.
- Always use reference ranges from the uploaded report.
- Always warn when comparing across labs.
- Keep all safety guardrails testable and auditable.

## Why This Is Not "Just Chat With PDF"

- Structured extraction for each report type
- Timeline intelligence across historical reports
- Safe trend summaries with explainable outputs
- Doctor-visit preparation packets and question generation

## Monorepo Structure

- `apps/web` Next.js 16 frontend (TypeScript, App Router)
- `apps/api` FastAPI backend (Python, Pydantic v2, async services)
- `packages/types` shared TypeScript workspace contracts
- `packages/agents` agent layer guidance and standards
- `packages/schemas` schema strategy and cross-language contracts
- `packages/security` privacy, redaction, and security docs
- `packages/parsers` extraction module guidance
- `packages/i18n` localization baseline
- `docs/` architecture, product, operations, and OSS governance
- `graphify-out/` local codebase knowledge graph (gitignored; run `pnpm graphify:update`)
- `CLAUDE.md`, `CODEX.md`, `.github/copilot-instructions.md` agent-specific instruction entrypoints

## Engineering Workflow

- Long-lived branches only: `main`, `develop`
- Feature branches merge by PR (squash merge) and are auto-deleted after merge
- `develop` and `main` are protected and never deleted
- Exactly three workflow files:
  - `CI - Quality And Governance`
  - `Release - Semantic Versioning And Tags`
  - `Deploy - Reserved Enterprise Pipeline` (skip gate for now)

Current deployment strategy is git-integrated platform deployment (Vercel/Render). The deploy workflow is intentionally a placeholder gate until managed environments are enabled.

## Prerequisites

Works on Windows, Linux, and macOS.

- **Node.js 22+** and **pnpm 10.25.0** (`corepack enable`)
- **Python 3.12+**
- **uv** — install once per machine:
  - macOS/Linux: `curl -LsSf https://astral.sh/uv/install.sh | sh`
  - Windows (PowerShell): `powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"`
- **Git for Windows** (includes Git Bash) — required for Husky hooks on Windows

## Quick Start

```bash
pnpm install   # installs Node deps + syncs apps/api Python dev deps via uv (if uv is on PATH)
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm graphify:update   # after structural code changes
```

Backend Python quality and tests are executed through workspace scripts and CI using `uv` + FastAPI tooling.

## Key Docs

- Product scope: `docs/product/MVP_V1_SPEC.md`
- Golden rules: `docs/product/GOLDEN_RULES.md`
- System architecture: `docs/architecture/SYSTEM_ARCHITECTURE.md`
- Adapter/factory strategy: `docs/architecture/ADAPTER_FACTORY_GUIDE.md`
- Config and feature flags: `docs/ops/CONFIGURATION_AND_FLAGS.md`
- Branching model: `docs/open-source/BRANCHING_STRATEGY.md`
- Release model: `docs/open-source/RELEASE_PROCESS.md`
- Quality gates: `docs/open-source/QUALITY_GATES.md`
- Commit standards: `docs/open-source/COMMIT_STRATEGY.md`
- OSS operating manual: `docs/open-source/PROJECT_OPERATING_MANUAL.md`
- Delivery board: `docs/open-source/GITHUB_PROJECTS.md`
- Tooling setup: `docs/open-source/TOOLING_SETUP.md`
- Agent baseline: `docs/agent-context/AGENT_SKILLS_BASELINE.md`
- Rules and skills map: `docs/agent-context/RULES_AND_SKILLS_MAP.md`
- Skills provenance: `docs/agent-context/SKILLS_PROVENANCE.md`
- Cursor rules: `.cursor/rules/README.md`
- Cursor skills: `.cursor/skills/README.md`

## Contributing

Read `CONTRIBUTING.md`, then pick a **Ready** issue from the [MedLens+ Project Board](https://github.com/users/itxSaaad/projects/2). Every PR must include safety impact, test evidence, and security/privacy notes.

## License

MIT License. See `LICENSE`.
