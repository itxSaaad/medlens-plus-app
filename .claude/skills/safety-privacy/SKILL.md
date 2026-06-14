---
name: safety-privacy
description: Medical safety and PII guardrails before merging any MedLens+ change touching parsing, summaries, AI, or logging.
---

# Safety and Privacy

**Authoritative** for clinical copy and PHI. Overrides all other skills when they conflict.

## Checks
1. No diagnosis, prescription, or dosage language
2. Use report-specific reference ranges only — never internet-generic ranges
3. Cross-lab comparison warnings intact
4. PII redacted in logs, traces, errors, and third-party tools
5. Safety filters tested when AI or parser output changes

## PR evidence
- Safety impact note
- Privacy/security note
- Test evidence for safety filters

Always-on: `.cursor/rules/medical-safety.mdc` · `docs/product/GOLDEN_RULES.md`
