# Model Provider Matrix

Living table of which model backs each pipeline stage today. Intentionally
kept separate from
[../architecture/02-STACK_DECISIONS.md](../02-architecture/02-STACK_DECISIONS.md) —
free-model rosters and free-tier limits shift monthly and this table needs
edits far more often than the slower-moving architecture doc. Update this
file, not `02-STACK_DECISIONS.md`, when a free model is deprecated or a better
one appears.

## Provider Fallback Chain (policy, not just quota)

Provider order is **policy-driven and safety-motivated**, not "pick the
highest free quota." The deciding constraint: free-tier providers differ in
whether they **train on submitted prompts**, and this product's inputs are
health data (PHI).

1. **Groq (Llama 3.3 70B)** — **primary for any stage that sees report /
   PHI content** (extraction, explanation). Fast, generous free daily cap
   (~1,000–14,400 req/day depending on model), no training-on-prompts
   concern at the free tier.
2. **OpenRouter free models** (DeepSeek-R1 for extraction reasoning, Gemma
   for classification) — secondary/fallback for model diversity and when
   Groq is rate-limited or circuit-broken. **Free tier defaults to 50
   req/day (20 req/min)**; a one-time **$10 top-up raises it permanently to
   1,000/day** — call this out as the cheapest reliability upgrade
   available, budget for it early.
3. **Google Gemini (AI Studio free tier)** — **LAST RESORT, opt-in only,
   restricted to non-PHI stages** (generic marketing copy, non-health FAQ).
   Google's free tier permits training on submitted prompts — **never route
   report content or health data through it** without a paid key carrying a
   no-training guarantee.

Every provider sits behind the existing `LLMProvider` adapter/factory and is
selected per pipeline stage via `LLM_MODEL_*` env vars; the fallback _order_
is driven by circuit-breaker state, not a special code path (see
[../architecture/02-STACK_DECISIONS.md](../02-architecture/02-STACK_DECISIONS.md),
Multi-LLM Extensibility Rule).

## Stage Matrix

| Stage                               | Sees PHI? | Default Provider / Model                                                 | Why                                                                                                                                                                                                                                               | Paid Swap Option                                   | Env Var                                                      |
| ----------------------------------- | --------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------ |
| Report-type classification          | Yes       | Groq `llama-3.3-70b` (fallback: OpenRouter `google/gemma-3-27b-it:free`) | Low-stakes, short structured output; no reasoning model needed                                                                                                                                                                                    | `gpt-4o-mini` / `claude-haiku`                     | `LLM_MODEL_CLASSIFY`                                         |
| Structured field extraction         | Yes       | Groq `llama-3.3-70b` (fallback: OpenRouter `deepseek/deepseek-r1:free`)  | Groq-primary because it sees PHI; DeepSeek-R1 reasoning fallback self-checks unit/value mismatches, async processing absorbs its latency. Constrained decoding, one call per panel — see [01-EXTRACTION_PIPELINE.md](./01-EXTRACTION_PIPELINE.md) | `gpt-4o` / `claude-sonnet`                         | `LLM_MODEL_EXTRACT`                                          |
| Safety-filtered summary (Explainer) | Yes       | Groq `llama-3.3-70b` (fallback: OpenRouter Gemma)                        | Facts are already computed deterministically upstream; this stage is tone/phrasing only                                                                                                                                                           | `gpt-4o-mini` / `claude-haiku`                     | `LLM_MODEL_SUMMARY`                                          |
| Doctor-question generation          | Yes       | Same as summary                                                          | Same safety contract and stakes as Explainer                                                                                                                                                                                                      | Same as summary                                    | `LLM_MODEL_DOCTOR_QUESTIONS`                                 |
| Non-PHI copy (marketing/FAQ)        | No        | Gemini free tier (opt-in)                                                | Only stage where a training-on-prompts free tier is acceptable, because no PHI is submitted                                                                                                                                                       | Any paid model                                     | `LLM_MODEL_MARKETING`                                        |
| Embeddings (Phase 2, RAG only)      | Yes       | **Jina Embeddings v3, Matryoshka-truncated to 512 dims**                 | Free hosted embeddings (1M tokens/month — effectively unlimited at this corpus size); 512 dims balances pgvector storage/index memory vs quality, and MRL lets the truncation point be raised later without re-picking a model                    | Cohere Embed 4 / OpenAI `text-embedding-3-small`   | `EMBEDDING_PROVIDER` / `EMBEDDING_MODEL`                     |
| Embeddings fallback (self-host)     | Yes       | `bge-small-en-v1.5`, self-hosted                                         | Documented fallback adapter only — `bge-m3` is too large for free-tier worker RAM, so it is not the default                                                                                                                                       | —                                                  | `EMBEDDING_PROVIDER=bge_small`                               |
| Reranking (Phase 2, RAG only)       | Yes       | **No-op stub (`noop`)** — not wired up in MVP                            | A few hundred clean summary strings per user don't need cross-encoder reranking; a 568M-param reranker doesn't fit free-tier worker RAM anyway. See [02-RAG_AND_RETRIEVAL.md](./02-RAG_AND_RETRIEVAL.md)                                          | **BGE-Reranker v2-m3** (Apache-2.0) when justified | `RERANK_PROVIDER` (`noop` default, `bge_v2_m3` when enabled) |

## License Note

Jina **Reranker** v2 weights are **CC-BY-NC-4.0** — acceptable for a
portfolio demo, **not** safe if this product is monetized, which the user
has stated is a live possibility. When reranking is enabled, **BGE-Reranker
v2-m3 (Apache-2.0)** is the pinned choice specifically to avoid a licensing
trap later, not merely for quality. Note this applies to the _reranker_:
Jina _Embeddings_ v3 via the Jina API is used under its API terms and is the
embedding default.

## Swap Discipline

Every row swaps via an env var only — no workflow or graph-node code change
— per the adapter/factory pattern in
[../architecture/04-ADAPTER_FACTORY_GUIDE.md](../02-architecture/04-ADAPTER_FACTORY_GUIDE.md).
When a free roster or free-tier limit changes, update the model string /
provider default in this table and the corresponding env var default; never
hardcode model names or provider order inside provider implementations.
