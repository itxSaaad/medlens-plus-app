---
name: ai-workflows
description: LangGraph LLM workflows, prompts, RAG grounding, and auditable AI pipelines with medical safety guardrails.
---

# AI Workflows

Use for `packages/agents/`, `apps/api/src/api/workflows/`, prompts, and model selection.

## Non-negotiable (read `safety-privacy` first)
- Post-process all LLM output through safety filters before user display
- No diagnosis, prescription, or dosage language
- Ground in uploaded report data only — no internet-generic reference ranges
- Cross-lab comparisons require explicit caution copy
- Record `prompt_id`, model, and change note on every AI workflow change

## Topology
Intake/OCR → Parser → Explainer → Timeline → Alert — see `docs/architecture/SYSTEM_ARCHITECTURE.md`

## Failure handling
- Fail fast with `job_id` / `request_id` in logs
- Partial user-safe state over empty 500s where possible

## Load on demand
| Task | Reference |
|------|-----------|
| Prompt design | `references/prompt-engineer/` |
| RAG / grounding architecture | `references/rag-architect/` |

Rule: `.cursor/rules/langgraph-ai-workflows.mdc`
