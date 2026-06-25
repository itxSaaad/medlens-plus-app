#!/usr/bin/env bash
# Validate promotion PR title semver against develop commits since last tag.
set -euo pipefail

PR_TITLE="${1:?PR title required}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# shellcheck disable=SC1091
source scripts/compute-promotion-bump.sh

git fetch --tags origin develop >/dev/null 2>&1 || true
eval "$(OUTPUT_MODE=env bash scripts/compute-promotion-bump.sh origin/develop)"

title_rank() {
  local title="$1"
  bump_rank_from_commit "$title" ""
}

TITLE_RANK="$(title_rank "$PR_TITLE")"

echo "Expected bump from develop batch: ${EXPECTED_BUMP} (rank ${EXPECTED_RANK})"
echo "PR title bump rank: ${TITLE_RANK}"
echo "Latest tag: ${LATEST_TAG:-none}"
echo "Analyzed range: ${LOG_RANGE}"

if (( TITLE_RANK < EXPECTED_RANK )); then
  echo ""
  echo "Promotion PR title under-releases the batch."
  echo "Minimum required type: ${MIN_TYPE}"
  echo "Run: bash scripts/suggest-promotion-title.sh"
  exit 1
fi

echo ""
echo "Promotion PR title satisfies release semver requirements."
