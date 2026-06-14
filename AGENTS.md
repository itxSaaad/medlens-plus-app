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
- Promotion: `develop` → `staging` → `main` (maintainers)
- After `main` updates, backmerge keeps `staging` and `develop` in sync with production

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
1. Read ticket
2. Validate architecture alignment
3. Implement with tests
4. Update docs and changelog
5. Open PR with checklist evidence
