#!/usr/bin/env bash
# Suggest a semantic promotion PR title from develop commits since the last release tag.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

eval "$(OUTPUT_MODE=env bash scripts/compute-promotion-bump.sh origin/develop)"

case "$EXPECTED_BUMP" in
  major)
    SUGGESTED_TITLE="feat!: promote integration batch to main"
  ;;
  minor)
    SUGGESTED_TITLE="feat: promote integration batch to main"
  ;;
  patch)
    SUGGESTED_TITLE="fix: promote integration batch to main"
  ;;
  none)
    SUGGESTED_TITLE="chore: promote develop to main"
  ;;
esac

echo "Latest tag: ${LATEST_TAG:-none}"
echo "Commits analyzed: ${LOG_RANGE}"
echo "Expected release bump: ${EXPECTED_BUMP} (minimum PR type: ${MIN_TYPE})"
echo ""
echo "Suggested promotion PR title:"
echo "  ${SUGGESTED_TITLE}"
echo ""
echo "Open PR:"
echo "  gh pr create --head develop --base main --title \"${SUGGESTED_TITLE}\""
echo ""
echo "Use the PR body to list included PRs/issues. Do not use chore: when the batch contains feat/fix work."
