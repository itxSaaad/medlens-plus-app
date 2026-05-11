# System Architecture

## High-Level Components

1. Next.js Web App
2. Supabase Auth
3. Supabase Storage (MVP)
4. FastAPI API service
5. LangGraph processing workflow (modeled in current workflow class)
6. Postgres (Supabase Postgres in MVP)
7. Export/packet generation service

## MVP User Flow (Exact)

1. User logs in via Supabase Auth.
2. User uploads report to Supabase Storage.
3. Web app creates document record in Postgres.
4. FastAPI receives processing request.
5. Processing workflow runs:
   1. Load document
   2. Extract text
   3. OCR fallback (flag controlled)
   4. Classify report type
   5. Extract structured values
   6. Validate schema (flag controlled)
   7. Store extracted observations
   8. Compare with historical values (flag controlled)
   9. Generate safe summary
   10. Mark review status (flag controlled)
6. User reviews extracted values.
7. AI generates doctor-ready packet.
8. User exports PDF.

## Port-and-Adapter Architecture Rule

All external services are accessed through interfaces in `apps/api/src/api/core/interfaces.py`.
Provider selection is done by factories in `apps/api/src/api/core/factories.py`.

This keeps replacement cost low:
- Add new provider class
- Add one factory mapping
- Change env var (`*_PROVIDER`)

No business logic changes should be required for provider swaps.
