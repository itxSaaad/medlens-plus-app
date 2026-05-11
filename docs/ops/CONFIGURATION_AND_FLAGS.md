# Configuration and Feature Flags

## Config Source of Truth
Backend runtime config is loaded from:
- `apps/api/src/api/core/settings.py`

Use:
- root `.env.example`
- `apps/api/.env.example`
- `apps/web/.env.example`

## Provider Selection (Factory-backed)
- `AUTH_PROVIDER`
- `STORAGE_PROVIDER`
- `DB_PROVIDER`
- `OCR_PROVIDER`
- `LLM_PROVIDER`

These map to factory methods in `apps/api/src/api/core/factories.py`.

## Feature Flags
- `FF_ENABLE_OCR_FALLBACK`
- `FF_ENABLE_SCHEMA_VALIDATION`
- `FF_ENABLE_HISTORICAL_COMPARISON`
- `FF_ENABLE_DOCTOR_PACKET_EXPORT`
- `FF_REQUIRE_MANUAL_REVIEW_ON_VALIDATION_ERRORS`

## Current Flag Effects in Code
- OCR fallback path in workflow: `FF_ENABLE_OCR_FALLBACK`
- Validation error insertion when no observations: `FF_ENABLE_SCHEMA_VALIDATION`
- Historical comparison step enable/disable: `FF_ENABLE_HISTORICAL_COMPARISON`
- Manual review gating for validation errors: `FF_REQUIRE_MANUAL_REVIEW_ON_VALIDATION_ERRORS`

## Enterprise Guidance
- Keep production flags in secret manager/config service (not git).
- Use staged rollouts by environment (`develop`, `staging`, `main`).
- Track all flag changes in release notes.
