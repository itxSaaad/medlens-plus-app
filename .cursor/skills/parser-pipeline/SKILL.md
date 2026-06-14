---
name: parser-pipeline
description: OCR, lab extractors, normalization, and safety metadata for MedLens+ report parsing.
---

# Parser Pipeline

Use for `packages/parsers/`, OCR providers, and normalization logic.

## Stages
1. **OCR** — `providers/ocr/`; confidence thresholds
2. **Classification** — report type (CBC, lipid, HbA1c, etc.)
3. **Extraction** — panel-specific extractors
4. **Normalization** — units, identifiers (LOINC target), canonical fields

## Golden rules
- Persist **reference ranges from the report**, not web defaults
- Attach **comparison caution** metadata for cross-lab comparisons
- Never emit diagnostic conclusions — structured observations and flags only

## Testing
- Fixture PDFs/images per report type (sanitized)
- Contract tests on normalized schema output
- Edge cases: missing units, ambiguous labels, multi-page reports

Docs: `packages/parsers/`, `docs/architecture/SYSTEM_ARCHITECTURE.md`
