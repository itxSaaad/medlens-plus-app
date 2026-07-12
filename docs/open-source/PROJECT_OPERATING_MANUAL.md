# MedLens+ Project Operating Manual

This is the canonical "what everyone must keep in mind" document.

## Product Intent
MedLens+ is longitudinal medical report intelligence, not a generic chat-with-PDF app.

## Non-Negotiable Safety Rules
1. Never diagnose disease.
2. Never prescribe medication.
3. Never suggest dosage changes.
4. Never claim a user has a disease.
5. Never replace doctor consultation.
6. Always use report-owned reference ranges.
7. Always warn for cross-lab comparisons.

## MVP Scope (Lab Timeline Intelligence)
Supported first:
- CBC
- LFT
- KFT/RFT
- Lipid Profile
- HbA1c
- Thyroid Profile
- Vitamin D
- Vitamin B12

MVP outcomes:
- Structured extraction
- History comparison
- Safe summary
- Doctor-question generation
- Doctor-ready PDF packet

## Architecture Rules
- Use adapter/factory pattern for every external service.
- Swapability is mandatory: add class + factory mapping + env switch.
- Keep business workflow isolated from provider SDKs.
- All configuration must be env-backed.
- Behavioral rollout/risk control must be flag-backed.

## Enterprise Readiness Rules
- 1 long-lived branch: `main` (trunk-based).
- PRs must pass lint/typecheck/unit tests/build.
- Integration tests required pre-release.
- Use CI + release automation + semantic commit discipline.
- Keep Terraform structure ready for cloud migration.

## Local Runtime Expectations
Dev compose includes infra services:
- Postgres
- Redis
- S3-compatible object storage (MinIO)
- API + Web

Dev restart policy:
- auto restart (`unless-stopped`)

Prod restart policy:
- manual restart (`restart: "no"`)

## Contributor Expectations
- Start from the [GitHub Project Board](https://github.com/users/itxSaaad/projects/2) — filter **Status = Ready**.
- Link every PR to a GitHub issue (`Closes #NNN`).
- Update docs with code changes.
- Respect medical safety language and evidence grounding.

## What Makes This Portfolio-Grade
- Production-minded architecture from day one
- Real quality gates and release discipline
- Strong safety posture for health domain
- Clear roadmap from MVP to enterprise scale
