#!/usr/bin/env sh
# Shared graphify refresh for Husky hooks.
# Skip: SKIP_GRAPHIFY_HOOK=1 git checkout ...
if [ "$SKIP_GRAPHIFY_HOOK" = "1" ]; then
  exit 0
fi

FORCE_FLAG=""
if [ "${GRAPHIFY_HOOK_FORCE:-0}" = "1" ]; then
  FORCE_FLAG="--force"
fi

if command -v graphify >/dev/null 2>&1; then
  graphify update . $FORCE_FLAG
elif command -v pnpm >/dev/null 2>&1; then
  pnpm graphify:update
fi
