# AGENTS.md

This repository is built to be understandable by humans and coding agents.

## Mission
Build MedLens+ as a safety-first, longitudinal medical report intelligence platform.

## Clinical Golden Rules (Non-Negotiable)
1. Never diagnose disease.
2. Never prescribe medication.
3. Never suggest dosage changes.
4. Never claim "you have X disease."
5. Never replace professional consultation.
6. Always use uploaded report reference ranges, not internet-generic ranges.
7. Always show caution when comparing reports from different labs.

## Engineering Standards
- Follow typed contracts and schema-first design.
- Keep frontend and backend decoupled by language/runtime.
- Share cross-language contracts via OpenAPI/JSON schema, not shared runtime code.
- Add tests for parser, normalization, trends, and safety filters.
- Any AI flow change must include prompt/version metadata.

## Branch Strategy (Main-First)
- Branch **from `main`** (production baseline)
- Open PRs to **`develop`** (features) or **`main`** (hotfixes)
- **Naming:** [`docs/open-source/NAMING_CONVENTIONS.md`](docs/open-source/NAMING_CONVENTIONS.md) — `feat/TKT-NNN-slug`, conventional commits (body ≤100 chars/line), semantic PR title
- Promotion: `develop` → `main` (maintainers)
- After `main` updates, manually backmerge into `develop` to keep integration in sync

## Ticket Source
- [GitHub Project #2](https://github.com/users/itxSaaad/projects/2) — not local `planning/tickets/`

## PR Requirements
- Link a GitHub issue (`Closes #NNN`) from the [Project Board](https://github.com/users/itxSaaad/projects/2)
- Mention user impact and safety impact
- Include test evidence
- Include privacy/security notes

## Done Criteria
- Functional acceptance criteria met
- Tests pass locally and in CI
- Docs updated
- Safety and privacy checklist complete

## Agent Work Order
1. Read ticket on [Project #2](https://github.com/users/itxSaaad/projects/2)
2. Branch with correct name (`feat/TKT-NNN-slug` or `chore/scope` per naming doc)
3. Validate architecture alignment
4. Implement with tests; commits must pass commitlint locally
5. Update docs and changelog
6. Open PR with template + `Closes #NNN`; run `pnpm lint` before push
