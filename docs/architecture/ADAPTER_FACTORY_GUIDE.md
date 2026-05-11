# Adapter and Factory Guide

## Goal
Allow replacing infrastructure services by adding new adapter classes, not rewriting core logic.

## Folder Conventions
- Interfaces: `apps/api/src/api/core/interfaces.py`
- Factories: `apps/api/src/api/core/factories.py`
- Providers: `apps/api/src/api/providers/<domain>/`
- Workflow orchestration: `apps/api/src/api/workflows/`
- Env + flags: `apps/api/src/api/core/settings.py`

## Current Provider Keys
- `AUTH_PROVIDER=supabase`
- `STORAGE_PROVIDER=supabase`
- `DB_PROVIDER=supabase_postgres`
- `OCR_PROVIDER=docling`
- `LLM_PROVIDER=openai`

## Add a New Storage Provider Example
1. Create `providers/storage/s3_storage.py` implementing `FileStorageProvider`.
2. Add factory branch in `get_storage_provider`.
3. Set `STORAGE_PROVIDER=s3` in environment.
4. Run unit + integration tests.

## Feature-Flagged Workflow Controls
- `FF_ENABLE_OCR_FALLBACK`
- `FF_ENABLE_SCHEMA_VALIDATION`
- `FF_ENABLE_HISTORICAL_COMPARISON`
- `FF_ENABLE_DOCTOR_PACKET_EXPORT`
- `FF_REQUIRE_MANUAL_REVIEW_ON_VALIDATION_ERRORS`

These are loaded via `Settings.from_env()` and injected into `ReportProcessingWorkflow`.

## Hard Rule
Business modules (workflow/services) must depend on interfaces only, never concrete providers.
