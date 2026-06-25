#!/usr/bin/env bash
# Evaluate sync state between main and develop refs (pure git, no API).
# Usage: evaluate-branch-sync.sh <main-ref> <develop-ref>
# Prints key=value lines suitable for GITHUB_OUTPUT.
set -euo pipefail

MAIN_REF="${1:?main ref required}"
DEVELOP_REF="${2:?develop ref required}"

MAIN_SHA=$(git rev-parse "$MAIN_REF")
DEVELOP_SHA=$(git rev-parse "$DEVELOP_REF")

if git diff --quiet "$MAIN_REF" "$DEVELOP_REF"; then
  TREES_MATCH=true
else
  TREES_MATCH=false
fi

DEV_AHEAD=$(git rev-list --count "${MAIN_REF}..${DEVELOP_REF}")
MAIN_AHEAD=$(git rev-list --count "${DEVELOP_REF}..${MAIN_REF}")

if [ "$MAIN_SHA" = "$DEVELOP_SHA" ]; then
  ACTION=none
elif [ "$TREES_MATCH" = true ]; then
  ACTION=fast_forward
elif [ "$MAIN_AHEAD" -gt 0 ]; then
  ACTION=hotfix_pr
else
  ACTION=promotion_needed
fi

if [ "$MAIN_SHA" = "$DEVELOP_SHA" ]; then
  DRIFT_STATE=aligned
  ALIGNED=true
  DRIFT=false
elif [ "$TREES_MATCH" = true ]; then
  DRIFT_STATE=graph_only
  ALIGNED=false
  DRIFT=true
elif [ "$DEV_AHEAD" -gt 0 ] && [ "$MAIN_AHEAD" -eq 0 ]; then
  DRIFT_STATE=promotion_needed
  ALIGNED=false
  DRIFT=true
elif [ "$MAIN_AHEAD" -gt 0 ]; then
  DRIFT_STATE=hotfix_needed
  ALIGNED=false
  DRIFT=true
else
  DRIFT_STATE=mixed
  ALIGNED=false
  DRIFT=true
fi

printf 'main_sha=%s\n' "$MAIN_SHA"
printf 'develop_sha=%s\n' "$DEVELOP_SHA"
printf 'trees_match=%s\n' "$TREES_MATCH"
printf 'dev_ahead=%s\n' "$DEV_AHEAD"
printf 'main_ahead=%s\n' "$MAIN_AHEAD"
printf 'action=%s\n' "$ACTION"
printf 'drift_state=%s\n' "$DRIFT_STATE"
printf 'aligned=%s\n' "$ALIGNED"
printf 'drift=%s\n' "$DRIFT"
