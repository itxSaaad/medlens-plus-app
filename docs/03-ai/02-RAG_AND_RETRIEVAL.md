# RAG and Retrieval

Authoritative doc for the **cross-report "ask your health history" Q&A**
feature only — **workload (b)** in the two-workload split (see
[../architecture/02-STACK_DECISIONS.md](../02-architecture/02-STACK_DECISIONS.md),
AI Pipeline). This is a genuine retrieval problem: which of a user's many
reports/observations answer a given question. It is a **Phase 2** feature,
not MVP-blocking — schema and interfaces are scaffolded now so it lands as a
pure addition later, not a retrofit.

**Not used for per-report field extraction** (workload (a)). A single
report's text fits whole in any free LLM's context window; retrieval answers
"which document is relevant," meaningless with one document in scope. See
[01-EXTRACTION_PIPELINE.md](./01-EXTRACTION_PIPELINE.md)'s "Why No RAG" section for
the explicit boundary — if a change to extraction seems to need retrieval,
it belongs in this doc's subsystem, not evidence that extraction needs RAG.

## Retrieval Unit: Structured Summary Strings, Never Raw OCR

The indexed unit is a **synthetic per-observation / per-report summary
string** built from the already-extracted structured `lab_observation` rows
— never raw OCR text. Example:

```text
2026-03-11 · LFT · ALT/SGPT 78 U/L (ref 7-56) · HIGH
```

Building the retrieval unit from clean structured rows means chunking raw
OCR is never on the table here — chunking OCR would reintroduce exactly the
vendor-layout noise extraction exists to remove, and would bloat the vector
count. This keeps each user's corpus to a few hundred short, clean strings.

## Indexing

One row per summary string in the embedding table (see
[../architecture/03-DATA_MODEL.md](../02-architecture/03-DATA_MODEL.md)):

- **Dense** — a **512-dim** Jina Embeddings v3 vector (Matryoshka-truncated
  to 512; see [03-MODEL_PROVIDER_MATRIX.md](./03-MODEL_PROVIDER_MATRIX.md) for
  provider/dims rationale), stored in **pgvector** with an **HNSW index**.
  HNSW is chosen over IVFFlat: it needs no list/probe tuning and gives
  strong recall at this corpus size (hundreds-to-low-thousands of vectors
  per user); IVFFlat only wins on very large, mostly-static datasets this
  product will not reach for years.
- **Lexical** — a generated `tsvector` column (GIN-indexed) over the same
  summary text, for BM25-equivalent full-text search. No separate search
  service alongside Postgres + pgvector.

## Retrieval: Hybrid Search

Run both arms in parallel, each pre-filtered by `user_id` via the normal
RLS-respecting predicate **before** any ranking (never rank across users
then filter). **Over-fetch ~20 candidates per arm** before fusing down to
~10:

1. **Lexical** — Postgres `ts_rank_cd` over the `tsvector` column.
2. **Dense** — pgvector cosine similarity (HNSW) over the 512-dim column.

Fuse the two ranked lists with **Reciprocal Rank Fusion**:

```text
score(doc) = Σ 1 / (k + rank_i(doc))   across each ranked list i, k = 60
```

RRF is chosen over weighted sum deliberately: it needs no score
normalization between BM25 and cosine similarity (which are on incompatible
scales) — rank position alone determines the fused score.

## Reranking — Stubbed No-Op in MVP

Reranking is a **stubbed no-op `Reranker` adapter** in MVP,
**`RERANK_PROVIDER=noop`**, **not wired into the retrieval path**. Two
reasons, both concrete:

- A corpus of one user's few hundred clean summary strings, already
  hybrid-retrieved and RRF-fused, does not need a cross-encoder rerank pass
  to return the right answers.
- Self-hosting a 568M-param reranker does not fit free-tier worker RAM
  alongside Docling + the rest of the pipeline, so "self-hosted rerank" is
  not actually free at this stage.

When reranking is later justified (larger corpora, measured recall gaps),
the pinned choice is **BGE-Reranker v2-m3 (Apache-2.0)**, enabled by
`RERANK_PROVIDER=bge_v2_m3`. It is deliberately **not** Jina Reranker v2
(CC-BY-NC-4.0): this product may be commercialized later, and a
non-commercial-licensed model in the pipeline becomes a blocker at that
point. License rationale: [03-MODEL_PROVIDER_MATRIX.md](./03-MODEL_PROVIDER_MATRIX.md).

## Answer Composition — Retrieve, SQL Computes, LLM Only Phrases

Even in this RAG-justified feature, the LLM does **not** compute. It:

- answers **strictly** from the retrieved summary strings handed to it —
  never inventing values not present in the retrieved context;
- cites which report(s) (by date/lab) the answer draws from;
- honors the Explainer node's safety contract: no diagnosis, no
  prescriptions, no "you have X" framing (see
  [../product/03-GOLDEN_RULES.md](../01-product/03-GOLDEN_RULES.md)).

Any numeric trend or aggregation in the answer is computed by
**deterministic SQL** over `lab_observation` rows (as in Node 4), then
handed to the LLM to interpret and phrase — the LLM never does the math. See
[../architecture/02-STACK_DECISIONS.md](../02-architecture/02-STACK_DECISIONS.md),
"Where RAG explicitly does not belong."

## Interfaces

`EmbeddingProvider` and `RerankProvider` Protocols are defined in
[../architecture/04-ADAPTER_FACTORY_GUIDE.md](../02-architecture/04-ADAPTER_FACTORY_GUIDE.md)
(defaults `EMBEDDING_PROVIDER=jina`, `RERANK_PROVIDER=noop`). This doc
describes their role in the pipeline; it does not redefine their signatures.
Both are used only by this cross-report feature, never by per-report
extraction.
