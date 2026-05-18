# Skill 03: Safety and Privacy Gate

## Goal
Prevent unsafe medical behavior and data leakage in every code change.

## Checks
1. Verify no diagnosis/prescription language is introduced
2. Ensure output references report-specific ranges
3. Ensure cross-lab comparison warning behavior remains intact
4. Verify PII redaction paths for logs/traces/errors
5. Confirm security-sensitive changes include tests/docs

## Required Evidence in PR
- Safety impact note
- Privacy/security note
- Test evidence for safety checks
