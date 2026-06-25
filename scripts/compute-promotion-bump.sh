#!/usr/bin/env bash
# Compute the semver bump required for a develop→main promotion batch.
# Rules mirror .releaserc.json @semantic-release/commit-analyzer releaseRules.
set -euo pipefail

REF="${1:-origin/develop}"
RANK_NONE=0
RANK_PATCH=1
RANK_MINOR=2
RANK_MAJOR=3

bump_rank_from_commit() {
  local subject="$1"
  local body="$2"
  local header type scope

  header="${subject%%$'\n'*}"
  if [[ "$body" =~ BREAKING[[:space:]-]CHANGE ]] || [[ "$header" == feat!* ]] || [[ "$header" =~ ^[a-zA-Z]+! ]]; then
    echo "$RANK_MAJOR"
    return
  fi

  type=""
  scope=""
  if [[ "$header" == *"("*"):"* ]]; then
    type="${header%%(*}"
    scope="${header#*(}"
    scope="${scope%%)*}"
  elif [[ "$header" == *":"* ]]; then
    type="${header%%:*}"
  else
    echo "$RANK_NONE"
    return
  fi

  case "$type" in
    feat)
      echo "$RANK_MINOR"
      ;;
    fix|perf|revert|release)
      echo "$RANK_PATCH"
      ;;
    chore)
      if [[ "$scope" == "deps" || "$scope" == "deps-dev" ]]; then
        echo "$RANK_PATCH"
      else
        echo "$RANK_NONE"
      fi
      ;;
    docs|refactor|test|ci|build)
      echo "$RANK_NONE"
      ;;
    *)
      echo "$RANK_NONE"
      ;;
  esac
}

bump_rank_from_pr_title() {
  local title="$1"
  local fake_body=""
  bump_rank_from_commit "$title" "$fake_body"
}

rank_to_bump() {
  case "$1" in
    "$RANK_MAJOR") echo "major" ;;
    "$RANK_MINOR") echo "minor" ;;
    "$RANK_PATCH") echo "patch" ;;
    *) echo "none" ;;
  esac
}

rank_to_min_type() {
  case "$1" in
    "$RANK_MAJOR") echo "feat!" ;;
    "$RANK_MINOR") echo "feat" ;;
    "$RANK_PATCH") echo "fix" ;;
    *) echo "chore" ;;
  esac
}

if [[ "${BASH_SOURCE[0]}" != "${0}" ]]; then
  return 0 2>/dev/null || exit 0
fi

git fetch --tags origin >/dev/null 2>&1 || true

LATEST_TAG="$(git tag -l 'v*' --sort=-v:refname | head -n 1 || true)"
if [[ -n "$LATEST_TAG" ]]; then
  LOG_RANGE="${LATEST_TAG}..${REF}"
else
  LOG_RANGE="${REF}"
fi

MAX_RANK=$RANK_NONE
if git rev-list --count "$LOG_RANGE" >/dev/null 2>&1; then
  while IFS= read -r -d '' entry; do
  subject="${entry%%$'\x1e'*}"
  body="${entry#*$'\x1e'}"
  rank="$(bump_rank_from_commit "$subject" "$body")"
  if (( rank > MAX_RANK )); then
    MAX_RANK=$rank
  fi
  done < <(git log "$LOG_RANGE" --format='%s%x1e%b%x00' 2>/dev/null || true)
fi

EXPECTED_BUMP="$(rank_to_bump "$MAX_RANK")"
MIN_TYPE="$(rank_to_min_type "$MAX_RANK")"

if [[ "${OUTPUT_MODE:-}" == "env" ]]; then
  echo "EXPECTED_BUMP=$EXPECTED_BUMP"
  echo "EXPECTED_RANK=$MAX_RANK"
  echo "MIN_TYPE=$MIN_TYPE"
  echo "LATEST_TAG=${LATEST_TAG:-none}"
  echo "LOG_RANGE=$LOG_RANGE"
else
  echo "$EXPECTED_BUMP"
fi
