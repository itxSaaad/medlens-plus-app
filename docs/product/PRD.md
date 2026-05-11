# PRD: MedLens+

## Problem

Patients receive reports in disconnected PDFs/images and cannot track meaningful trends over time.

## Goals (Year 1)

- Accurate extraction of high-frequency lab panels
- Reliable change detection across report history
- Clinically safe, understandable summaries
- Open-source delivery velocity with contributor onboarding

## Non-Goals (Phase 1)

- Full diagnostic engine
- Hospital EMR integrations
- Real-time clinician workflow tooling

## Functional Requirements

1. Upload reports (PDF/image)
2. Extract structured values + units + ranges
3. Normalize biomarkers and maintain timeline
4. Compare current vs previous reports
5. Generate summaries with source references
6. Provide doctor-visit checklist and follow-up prompts

## Success Metrics

- Extraction precision on benchmark set
- User-reported clarity score
- Time-to-consultation-prep reduction
- Weekly active report comparisons
