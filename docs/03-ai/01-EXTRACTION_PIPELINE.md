# Extraction Pipeline

Authoritative deep-dive for Node 2 (Medical Parser) of
[../architecture/01-SYSTEM_ARCHITECTURE.md](../02-architecture/01-SYSTEM_ARCHITECTURE.md).
Vendor-agnostic: reports arrive from arbitrary labs with no fixed template,
so extraction keys off biomarker name/unit recognition, never fixed
row/column position.

This is **workload (a)** in the two-workload split (see
[../architecture/02-STACK_DECISIONS.md](../02-architecture/02-STACK_DECISIONS.md),
AI Pipeline): closed-world, single-document. The report's own text is the
full context. It is **not** a retrieval problem. The cross-report "ask your
health history" Q&A — workload (b), a genuine retrieval problem — lives in
[02-RAG_AND_RETRIEVAL.md](./02-RAG_AND_RETRIEVAL.md). Never conflate the two.

## Why No RAG (and No Raw-OCR Chunking) Here

A lab report's OCR text is typically 500–3000 tokens — trivially within any
free model's context window. Retrieval-style search answers "which
document," which is meaningless when there is exactly one document in scope.
So embeddings, vector search, and reranking play no role in this pipeline.

Chunking is likewise wrong here in its usual form: fixed-size /
recursive-character splitting on lab report text fragments the
value/unit/range triplets the extractor must see together to bind them
correctly. The **only** legitimate chunking inside extraction is the escape
hatch below, and even then it is layout-aware, not character-count-based:

- If a single report genuinely exceeds the extraction model's context (rare
  — multi-panel scanned bundles), split with Docling's layout-aware
  `HybridChunker`, which keeps each table row attached to its column
  headers and reference ranges. Never fixed-size or
  `RecursiveCharacterTextSplitter` on report text.

Do not reintroduce embeddings/retrieval into this pipeline. If a future
change seems to need it, it belongs in
[02-RAG_AND_RETRIEVAL.md](./02-RAG_AND_RETRIEVAL.md)'s subsystem instead.

## Extraction Strategy: LLM Structured Output First, Determinism After

The order is deliberate and is the reverse of a fuzzy-match-first pipeline.
The LLM (via constrained decoding) is the **primary semantic field
matcher** — it reads a whole panel's messy vendor text and emits typed
observations. Fuzzy matching is demoted to a **normalization** step in the
deterministic post-pass, which is the only place string similarity belongs
(mapping an already-extracted `test_name` into the controlled vocabulary),
never the primary extraction mechanism.

### Stage 1 — Docling Layout/OCR

Node 1 has already produced layout-aware text (table structure preserved).
See [../architecture/01-SYSTEM_ARCHITECTURE.md](../02-architecture/01-SYSTEM_ARCHITECTURE.md)
Node 1 and [../architecture/06-DEPLOYMENT_TOPOLOGY.md](../02-architecture/06-DEPLOYMENT_TOPOLOGY.md)
for the worker/OCR-engine boundary.

### Stage 2 — LLM Structured Output (Constrained Decoding)

The typed model call runs through **Pydantic-AI** inside the medical-parser
node — the LangGraph graph owns control flow, Pydantic-AI owns the typed
call (see [04-LANGGRAPH_MIGRATION.md](./04-LANGGRAPH_MIGRATION.md)). The output
schema is a JSON-schema-constrained / structured-output response, not
prompt-only "please return JSON": constrained decoding yields ~100%
schema-valid output versus the 80–95% typical of prompt-only JSON, which
matters because a malformed field on medical data is a safety event, not a
retry annoyance.

**Split by panel, not one mega-call.** Issue one focused extraction call per
panel (LFT, CBC, KFT, …) rather than a single call over the whole bundle.
Smaller, focused calls raise per-field accuracy, keep each call's schema
tight, and let one panel fail/route-to-review without poisoning the others.

Biomarkers outside the supported vocabulary are still captured (with
`loinc_code = NULL`, see below) rather than dropped — this is how new vendor
terminology surfaces for manual mapping, reviewed before promotion into the
synonym table.

Model selection per stage: [03-MODEL_PROVIDER_MATRIX.md](./03-MODEL_PROVIDER_MATRIX.md).
Env vars are defined once in
[../architecture/04-ADAPTER_FACTORY_GUIDE.md](../02-architecture/04-ADAPTER_FACTORY_GUIDE.md)
— do not redefine here.

### Stage 3 — Deterministic Post-Pass (No LLM)

Runs per extracted observation, in order:

1. **Canonicalize `test_name`** — fuzzy match (RapidFuzz
   `token_sort_ratio` / `partial_ratio`) the extracted name into the curated
   controlled vocabulary. This is normalization of an already-extracted
   field, not extraction. On a confident match, attach the canonical
   `biomarker_key` and its **LOINC code**; on no confident match, leave
   `loinc_code = NULL` and flag the field for manual mapping — never
   silently guess a code on medical data.
2. **Unit-sanity check** — the value's unit must be an accepted variant for
   that `biomarker_key` (rejects e.g. Hemoglobin reported in `U/L`). Unit
   conversions to the canonical unit use the dictionary's factors.
3. **Reference-range shape parser** — regex-normalizes `10-20`, `<5`,
   `>=100`, and qualitative values (`Negative`, `Non-reactive`) into
   `{low, high, operator, qualitative_value}`. Unparseable → the field's
   `requires_human_review` is set.
4. **Physiological-plausibility bounds** — per-biomarker sane min/max
   catches OCR digit errors (e.g. Hb of `1400` instead of `14.0`).

## Canonical Field Identity: LOINC

Canonical identity for a biomarker is a **LOINC code** (free for commercial
use in perpetuity — no licensing blocker), assigned via a **hand-curated
internal synonym→LOINC mapping table** scoped to the panels this product
supports (LFT, CBC, KFT, …). This is not runtime auto-mapping against the
full LOINC database — that would silently mis-map on ambiguous vendor names.

Persist **both** the raw extracted observation **and** the resolved
canonical LOINC code. When the synonym match fails, `loinc_code` stays
`NULL` and the observation is surfaced for manual mapping. Storing the raw
value regardless preserves the audit trail and lets a later mapping-table
update backfill the code without re-OCR.

## Synonym / Alias Dictionary

The curated table backing Stage 3.1. A canonical `biomarker_key` maps to
observed vendor aliases, accepted unit variants with conversion factors, and
the LOINC code:

```yaml
hemoglobin:
  loinc_code: "718-7"
  aliases: ["Hb", "Hgb", "Haemoglobin", "HAEMOGLOBIN (Hb)"]
  units:
    g/dL: 1.0
    gm/dl: 1.0
    g/L: 0.1 # conversion factor to canonical unit (g/dL)
```

Shipped as a generated cross-language contract: a JSON/YAML source of truth
in `packages/schemas`, generated into a Python module (consumed by the
worker) and a TS module (consumed by web/mobile for display). It is
maintained by hand and version-controlled as an idempotent data migration
(see [../architecture/02-STACK_DECISIONS.md](../02-architecture/02-STACK_DECISIONS.md),
Backend — seed/reference data), not a bespoke seed script.

## Per-Field Confidence Scoring

Confidence is computed **per observation, not per report** — one bad field
routes only that field to human review, leaving the rest of a report
extractable. Each observation carries a `requires_human_review: bool`.

Composite, weighted average. **The weights are heuristic and tunable**, to
be calibrated empirically against real extraction accuracy — they are not
fixed constants, and any confidence surfaced in-product must be **labeled as
heuristic**:

```text
confidence = 0.35 * name_canonicalization_score   # fuzzy score into vocab (Stage 3.1)
           + 0.25 * unit_match                     # 0 or 1 (Stage 3.2)
           + 0.25 * range_parse_success            # 0 or 1 (Stage 3.3)
           + 0.15 * llm_self_reported_confidence   # 0 if a non-reasoning model was used
```

An observation with `confidence` below threshold (starting point `0.75`, a
tunable config value) **or** any failed deterministic check gets
`requires_human_review = true`. Per Node 2's conditional edge
([../architecture/01-SYSTEM_ARCHITECTURE.md](../02-architecture/01-SYSTEM_ARCHITECTURE.md)),
any observation requiring review blocks progression to the Explainer node.

## What This Pipeline Must Never Do

Reinforcing the product-wide boundary (see
[../architecture/02-STACK_DECISIONS.md](../02-architecture/02-STACK_DECISIONS.md),
"Where RAG explicitly does not belong"):

- **Flag colors (green/yellow/red) are computed deterministically**, by
  rule-based comparison of the value against its parsed reference range. An
  LLM must never decide a flag color. The yellow (borderline) band width is
  a tunable config value, also labeled heuristic in-product.
- **Timeline/trend math is SQL aggregation** over `lab_observation` rows
  (Node 4), never LLM arithmetic.
- **Extraction is not retrieval.** No embeddings, no vector search here.

## Model Choices (current defaults)

| Stage                       | Provider / Model                                        | Why                                                                                                                                       |
| --------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Report-type classification  | Groq `llama-3.3-70b` (fallback: OpenRouter Gemma)       | Low-stakes, short structured output — no reasoning model needed                                                                           |
| Structured field extraction | Groq `llama-3.3-70b` (fallback: OpenRouter DeepSeek-R1) | Sees PHI, so Groq-primary (no training-on-prompts at free tier); DeepSeek-R1 is the reasoning fallback for hard unit/value disambiguation |

Full provider fallback chain, license/PHI rationale, and env vars: see
[03-MODEL_PROVIDER_MATRIX.md](./03-MODEL_PROVIDER_MATRIX.md).
