#!/usr/bin/env bash
# Update GitHub Project #2 Status for a linked issue number.
# Requires GH_PAT, GITHUB_REPOSITORY, ISSUE_NUMBER, STATUS (In Review|Done).
set -euo pipefail

ISSUE_NUMBER="${ISSUE_NUMBER:?ISSUE_NUMBER required}"
STATUS="${STATUS:?STATUS required}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# shellcheck source=/dev/null
source "$ROOT/.github/scripts/github-api.sh"

read -r -d '' PROJECT_QUERY <<'GRAPHQL' || true
query($owner: String!, $number: Int!) {
  user(login: $owner) {
    projectV2(number: $number) {
      id
      field(name: "Status") {
        ... on ProjectV2SingleSelectField {
          id
          options { id name }
        }
      }
    }
  }
}
GRAPHQL

PROJECT_RESULT=$(github_graphql "$PROJECT_QUERY" '{"owner":"itxSaaad","number":2}') || {
  echo "Failed to query Project #2 — verify GH_PAT has Projects read/write (docs/ops/GITHUB_AUTOMATION_PAT.md)" >&2
  exit 1
}

PROJECT_ID=$(echo "$PROJECT_RESULT" | jq -r '.data.user.projectV2.id')
STATUS_FIELD=$(echo "$PROJECT_RESULT" | jq -r '.data.user.projectV2.field.id')
OPTION_ID=$(echo "$PROJECT_RESULT" | jq -r --arg s "$STATUS" '.data.user.projectV2.field.options[] | select(.name == $s) | .id')

if [ -z "$OPTION_ID" ] || [ "$OPTION_ID" = "null" ]; then
  echo "Status option not found: ${STATUS}"
  exit 1
fi

ITEM_ID=""
CURSOR=""
read -r -d '' ITEMS_QUERY <<'GRAPHQL' || true
query($owner: String!, $number: Int!, $cursor: String) {
  user(login: $owner) {
    projectV2(number: $number) {
      items(first: 100, after: $cursor) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id
          content { ... on Issue { number } }
        }
      }
    }
  }
}
GRAPHQL

while true; do
  if [ -n "$CURSOR" ]; then
    VARS=$(jq -n --arg cursor "$CURSOR" '{owner: "itxSaaad", number: 2, cursor: $cursor}')
  else
    VARS='{"owner":"itxSaaad","number":2,"cursor":null}'
  fi

  PAGE=$(github_graphql "$ITEMS_QUERY" "$VARS")
  ITEM_ID=$(echo "$PAGE" | jq -r --argjson n "$ISSUE_NUMBER" \
    '.data.user.projectV2.items.nodes[] | select(.content.number == $n) | .id' | head -1)

  if [ -n "$ITEM_ID" ] && [ "$ITEM_ID" != "null" ]; then
    break
  fi

  HAS_NEXT=$(echo "$PAGE" | jq -r '.data.user.projectV2.items.pageInfo.hasNextPage')
  if [ "$HAS_NEXT" != "true" ]; then
    break
  fi
  CURSOR=$(echo "$PAGE" | jq -r '.data.user.projectV2.items.pageInfo.endCursor')
done

if [ -z "$ITEM_ID" ] || [ "$ITEM_ID" = "null" ]; then
  echo "No project item for issue #${ISSUE_NUMBER} on Project #2"
  exit 0
fi

read -r -d '' MUTATION <<'GRAPHQL' || true
mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
  updateProjectV2ItemFieldValue(
    input: {
      projectId: $projectId
      itemId: $itemId
      fieldId: $fieldId
      value: { singleSelectOptionId: $optionId }
    }
  ) {
    projectV2Item { id }
  }
}
GRAPHQL

MUTATION_VARS=$(jq -n \
  --arg projectId "$PROJECT_ID" \
  --arg itemId "$ITEM_ID" \
  --arg fieldId "$STATUS_FIELD" \
  --arg optionId "$OPTION_ID" \
  '{projectId: $projectId, itemId: $itemId, fieldId: $fieldId, optionId: $optionId}')

github_graphql "$MUTATION" "$MUTATION_VARS"
echo "Set issue #${ISSUE_NUMBER} project Status to ${STATUS}"
