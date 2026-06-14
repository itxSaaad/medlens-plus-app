---
name: debugging
description: Structured logging, tracing, Sentry, and systematic debugging without leaking PHI.
---

# Debugging

Use when adding logs, traces, error paths, or investigating failures.

## Logging
- Structured logs with `request_id`, `job_id`, `ticket_id`
- Never log raw report text, patient IDs, or API keys

## Tracing
- Span per pipeline stage: ingest, OCR, normalize, trend, summarize

## Errors
- User-safe messages; technical detail in logs only
- Scrub PII before Sentry; tag releases with version

## Load on demand
| Task | Reference |
|------|-----------|
| Systematic debugging | `references/debugging-wizard/` |
