## Ticket Reference
Link GitHub issue (e.g. `Closes #42` or `Relates to #15`):

## Problem Statement
What user/system problem does this PR solve?

## Solution Summary
What changed and why this approach?

> **PR size (recommended):** ≤150 changed files for AI review tools; ≤400 lines meaningful diff. Split or use modular commits on the feature branch if larger. AI reviews (CodeRabbit, Copilot) are **manual** — see [`docs/open-source/TOOLING_SETUP.md`](docs/open-source/TOOLING_SETUP.md).

## Architecture And Extensibility Checks
- [ ] No direct provider SDK usage in workflow/business logic
- [ ] Adapter/factory boundaries preserved
- [ ] Env-backed configuration used (no hardcoded secrets/endpoints)
- [ ] Feature flags considered for risky behavior

## Safety And Compliance Checklist
- [ ] No diagnosis/prescription language introduced
- [ ] Source-grounded behavior preserved
- [ ] Cross-lab warning behavior preserved where applicable
- [ ] PII-safe logging/tracing behavior preserved

## Quality Checklist
- [ ] Lint passes
- [ ] Typecheck passes
- [ ] Unit tests added/updated
- [ ] Integration tests updated if infra behavior changed
- [ ] Docs updated to match current code
- [ ] `pnpm graphify:update` run locally if you maintain graph artifacts (optional)

## Validation Evidence
Paste key command outputs used for validation.
