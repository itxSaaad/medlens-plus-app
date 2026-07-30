# LangGraph Migration

Concrete migration plan from the current linear `ReportProcessingWorkflow`
(`apps/api/src/api/workflows/report_processing.py`) to the `StateGraph`
described in
[../architecture/01-SYSTEM_ARCHITECTURE.md](../02-architecture/01-SYSTEM_ARCHITECTURE.md).
This is a **control-flow refactor**, not an interface change — every graph
node calls `FileStorageProvider` / `DocumentRepository` / `OCRProvider` /
`LLMProvider` exactly as the linear class does today.

## Decision: Keep LangGraph (Re-Confirmed)

LangGraph reached v1.0 and matured through 2026; keeping it is **confirmed,
not reversed** (see
[../architecture/02-STACK_DECISIONS.md](../02-architecture/02-STACK_DECISIONS.md),
Backend + AI Pipeline). The pipeline's actual shape — conditional
low-confidence → human-review routing and checkpointed resume — is exactly
LangGraph's fit, not a fashion choice. Proceed with the migration below.

**Division of labor: graph orchestrates, Pydantic-AI does the typed call.**
LangGraph owns control flow (nodes, conditional edges, checkpointing).
**Pydantic-AI is used _inside_ the medical-parser node** (not as the
orchestrator) for the type-safe, structured LLM extraction call — see
[01-EXTRACTION_PIPELINE.md](./01-EXTRACTION_PIPELINE.md). Do not let Pydantic-AI
own control flow, and do not push graph concerns into the typed call.

## State Schema Promotion

`WorkflowState` (`apps/api/src/api/domain/models.py`) is currently a plain
`@dataclass(slots=True)`. Promote it to a Pydantic `BaseModel` (or a
`TypedDict` if the team prefers LangGraph's native reducer-based state
merging) so it satisfies `langgraph.graph.StateGraph`'s state-schema
requirement, and add two fields the linear version has no way to express:

```python
confidence_scores: dict[str, float] = {}   # keyed by observation, not by report
cross_lab_caution: bool = False
```

Confidence is scored **per observation, not per report** (see
[01-EXTRACTION_PIPELINE.md](./01-EXTRACTION_PIPELINE.md), Per-Field Confidence) —
`confidence_scores` maps an observation identity to its heuristic score, and
`ExtractedObservation` additionally carries its own `requires_human_review:
bool` and canonical `loinc_code: str | None`. `ExtractedObservation` stays a
value object, not graph state; only the aggregate scores live in
`WorkflowState`.

## Step → Node Mapping

| Current linear step (comment number in `report_processing.py`) | Target graph node                 | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1–3: load document, get bytes, OCR + fallback                  | `intake_ocr_node`                 | Adds a conditional edge to a terminal `failed` node on empty text yield — today this case isn't distinguished from "proceed anyway"                                                                                                                                                                                                                                                                                                                    |
| 4: classify report type                                        | `medical_parser_node` (start)     | No behavior change                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 5–6: extract structured values, schema validation              | `medical_parser_node` (continued) | Replaces the single `extract_structured_values` call with the [01-EXTRACTION_PIPELINE.md](./01-EXTRACTION_PIPELINE.md) flow: Pydantic-AI constrained-decoding call **split one-per-panel** → deterministic post-pass (LOINC canonicalization, unit/range/plausibility checks) → **per-field** confidence + `requires_human_review`. Today's call has no constrained decoding, no LOINC mapping, and validation only checks "no observations extracted" |
| 7: store observations                                          | `medical_parser_node` (end)       | Now persists raw observation **and** canonical `loinc_code` (NULL when the synonym match fails, surfaced for manual mapping)                                                                                                                                                                                                                                                                                                                           |
| —                                                              | **new conditional edge**          | Any observation with `requires_human_review` (below-threshold confidence or a failed deterministic check) or non-empty `validation_errors` → `needs_review`, **skip `explainer_node`** entirely. This does not exist today: the linear class always calls `generate_safe_summary` (step 9) regardless of validation errors, and only downgrades `review_status` afterward (step 10)                                                                    |
| 8: historical comparison                                       | `timeline_node`                   | Runs before or in parallel with `explainer_node`; sets `cross_lab_caution` (new)                                                                                                                                                                                                                                                                                                                                                                       |
| 9: generate safe summary                                       | `explainer_node`                  | Adds the post-generation safety-filter deny-list check with bounded retry and template fallback — not present in the current stub                                                                                                                                                                                                                                                                                                                      |
| —                                                              | `alert_care_node`                 | New — currently unimplemented in the linear class entirely                                                                                                                                                                                                                                                                                                                                                                                             |
| 10: mark review status                                         | terminal cleanup node             | Runs for every branch (including `failed` and `needs_review`), not just the success path                                                                                                                                                                                                                                                                                                                                                               |

## New Conditional Edges

The linear class has exactly one branch point today (the OCR-fallback `if`
in step 2) and one status decision (step 10, which never stops execution,
only labels it). The graph introduces two more:

1. **Intake failure** — empty OCR yield after fallback → `failed`, skip
   everything downstream.
2. **Low-confidence/validation-error early exit** — routes straight to
   the terminal node with `review_status = "needs_review"`, skipping
   `explainer_node` and `timeline_node`. This is the primary reason for
   the migration: a safety-first product must not generate a patient-facing
   summary from unverified extraction.

## What Does Not Change

- Provider interfaces (`FileStorageProvider`, `DocumentRepository`,
  `OCRProvider`, `LLMProvider`) — unchanged signatures, unchanged factory
  wiring.
- Feature flag names (`FF_ENABLE_OCR_FALLBACK`,
  `FF_ENABLE_SCHEMA_VALIDATION`, `FF_ENABLE_HISTORICAL_COMPARISON`,
  `FF_REQUIRE_MANUAL_REVIEW_ON_VALIDATION_ERRORS`) — same semantics,
  now expressed as edge conditions instead of `if` statements inside one
  method body.
- Where this runs — the graph executes entirely on the Render worker, per
  [../architecture/01-SYSTEM_ARCHITECTURE.md](../02-architecture/01-SYSTEM_ARCHITECTURE.md)'s
  deployment framing, never inside a Vercel function.
