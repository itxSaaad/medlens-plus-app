#!/usr/bin/env bash
# GitHub REST API helper for workflows — curl only, no gh CLI.
# Requires GH_PAT (repository secret). See docs/ops/GITHUB_AUTOMATION_PAT.md.
set -euo pipefail

if [[ -z "${GH_PAT:-}" ]]; then
  echo "error: GH_PAT is not set. Add the repository secret (see docs/ops/GITHUB_AUTOMATION_PAT.md)." >&2
  exit 1
fi

REPO="${GITHUB_REPOSITORY:-${REPO:-}}"
if [[ -z "$REPO" ]]; then
  echo "error: GITHUB_REPOSITORY or REPO must be set" >&2
  exit 1
fi

API_ROOT="https://api.github.com"

github_api() {
  local method="$1"
  local path="$2"
  shift 2

  local url="${API_ROOT}${path}"
  if [[ "$path" != /* ]]; then
    url="${API_ROOT}/${path}"
  fi

  local response
  response="$(
    curl -sS -w "\n%{http_code}" \
      -X "$method" \
      -H "Authorization: Bearer ${GH_PAT}" \
      -H "Accept: application/vnd.github+json" \
      -H "X-GitHub-Api-Version: 2022-11-28" \
      "$url" \
      "$@"
  )"

  local status="${response##*$'\n'}"
  local body="${response%$'\n'*}"

  if [[ "$status" -lt 200 || "$status" -ge 300 ]]; then
    echo "GitHub API ${method} ${path} failed (HTTP ${status})" >&2
    if [[ -n "$body" ]]; then
      echo "$body" >&2
    fi
    return 1
  fi

  if [[ -n "$body" ]]; then
    echo "$body"
  fi
}

github_graphql() {
  local query="$1"
  local variables="${2:-"{}"}"

  local payload
  payload="$(jq -n --arg q "$query" --argjson v "$variables" '{query: $q, variables: $v}')"

  local response
  response="$(
    curl -sS -w "\n%{http_code}" \
      -X POST \
      -H "Authorization: Bearer ${GH_PAT}" \
      -H "Accept: application/vnd.github+json" \
      -H "Content-Type: application/json" \
      -H "X-GitHub-Api-Version: 2022-11-28" \
      "${API_ROOT}/graphql" \
      --data-binary "$payload"
  )"

  local status="${response##*$'\n'}"
  local body="${response%$'\n'*}"

  if [[ "$status" -lt 200 || "$status" -ge 300 ]]; then
    echo "GitHub GraphQL failed (HTTP ${status})" >&2
    echo "$body" >&2
    return 1
  fi

  if echo "$body" | jq -e '.errors | length > 0' >/dev/null 2>&1; then
    echo "GitHub GraphQL returned errors" >&2
    echo "$body" | jq '.errors' >&2
    return 1
  fi

  echo "$body"
}
