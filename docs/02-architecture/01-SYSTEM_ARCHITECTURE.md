# System Architecture

## Core MVP Flow

1. User interacts with Next.js web app
2. Authentication via managed auth provider
3. Report upload to object storage provider
4. Document record creation in relational DB
5. FastAPI processing request triggers workflow orchestration
6. User review and doctor-ready packet generation
7. Export and sharing flows

## Deployment Framing

Vercel hosts **both** Next.js and a thin FastAPI (auth, upload, read APIs,
admin APIs — nothing that loads an ML model or blocks past a few hundred
milliseconds). The LangGraph pipeline below, Docling OCR, and every
LLM/embedding/rerank call run on a **separate always-on-ish worker** — a
Dockerized Hugging Face Space (CPU Basic: 16GB RAM/2 vCPU free), chosen over
Render free tier because Docling's default pipeline needs ~2-4GB RAM which
Render's 512MB free cap cannot reliably fit — never inside a Vercel
function. Upstash QStash is the durable queue between them: Vercel's upload
endpoint publishes a message, QStash retries and dead-letters on the
worker's behalf, and its 15-minute max response duration lets the worker
hold the connection open for the full OCR+LLM pipeline. Full request
lifecycle, infra diagram, and rationale live in
[06-DEPLOYMENT_TOPOLOGY.md](./06-DEPLOYMENT_TOPOLOGY.md) — this doc stays about
pipeline/node topology, not infra topology.

## Agentic Workflow Topology (LangGraph)

State flows node-by-node through an explicit `StateGraph`, runs entirely on
the worker. Every node can fail fast and return partial user-safe
output instead of silent failure. Migration detail from the current linear
implementation is in [../ai/04-LANGGRAPH_MIGRATION.md](../03-ai/04-LANGGRAPH_MIGRATION.md).

### State Schema

`WorkflowState` (Pydantic model / `TypedDict`, not a plain dataclass):

```python
class WorkflowState(BaseModel):
    document_id: str
    user_id: str
    text_content: str | None = None
    report_type: str | None = None
    observations: list[ExtractedObservation] = []
    validation_errors: list[str] = []
    historical_summary: dict[str, Any] = {}
    safe_summary: str | None = None
    review_status: str = "pending_review"
    confidence_scores: dict[str, float] = {}
    cross_lab_caution: bool = False
```

### Node 1: Intake and OCR

- `storage.get_bytes` → Docling extract: `SimplePipeline` fast-path (text
  layer only) for digitally-generated PDFs; full layout+table+OCR pipeline
  with Tesseract fallback for scanned/photographed reports.
- **Conditional edge**: empty text yield even after OCR fallback routes to
  a terminal `failed` node — never proceeds with nothing to parse.

### Node 2: Medical Parser

- Classify report type (LLM), synonym/alias-dictionary + fuzzy-match
  pre-pass, LLM fallback extraction for unmatched/unknown-vendor rows,
  deterministic validation (unit-sanity, reference-range-shape parse,
  physiological-plausibility bounds), composite confidence score.
- Full mechanics: [../ai/01-EXTRACTION_PIPELINE.md](../03-ai/01-EXTRACTION_PIPELINE.md).
- **Conditional edge (the key fix over the current linear class)**:
  confidence below threshold OR `validation_errors` non-empty routes to
  `needs_review` and **skips Node 3 entirely** — today's linear
  implementation only flips a status flag at the very end and always runs
  the Explainer regardless; the graph must stop unverified data before it
  reaches summary generation.

### Node 3: Explainer

- Generate patient-safe explanation: system prompt encodes
  [03-GOLDEN_RULES.md](../01-product/03-GOLDEN_RULES.md) verbatim, followed by a
  post-generation deny-list/regex filter (diagnostic phrasing, drug names,
  dosage units) with bounded retry, falling back to a template-only
  non-LLM summary if retries exhaust.
- Generate doctor-prep questions under the same safety contract.
- Never reached if Node 2 routed to `needs_review`.

### Node 4: Timeline

- Merge with historical observations (deterministic, no LLM): compute
  delta/velocity/direction per `biomarker_key`.
- Set `cross_lab_caution = true` whenever compared observations have
  different `source_lab_identifier` (Golden Rule #7).
- Persist immutable health events (`observation_trend` rows).

### Node 5: Alert and Care

- Trigger only with explicit consent and critical thresholds — an
  explicit conditional edge, not an unconditional call.
- Scoped caregiver access controls (`caregiver_access_grant`).
- Currently unimplemented; this is the designated extension point.

### Terminal Node

`mark_review_status` runs regardless of which branch was taken — every
path (including `failed` and `needs_review`) routes through this shared
cleanup node before `END`.

## Port-and-Adapter Rule

All external dependencies must go through interfaces and factories:

- auth
- storage
- db repository
- OCR
- LLM
- embedding (new — [04-ADAPTER_FACTORY_GUIDE.md](./04-ADAPTER_FACTORY_GUIDE.md))
- rerank (new — [04-ADAPTER_FACTORY_GUIDE.md](./04-ADAPTER_FACTORY_GUIDE.md))

This keeps swap cost low and supports fallback providers when one service
is degraded. Graph nodes call these interfaces identically to the current
linear workflow — LangGraph changes control flow, not the port/adapter
discipline.
