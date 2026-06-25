#!/usr/bin/env bash
# Apply repository merge settings, rulesets (best-effort), and classic branch protection.
# Classic protection is authoritative on personal repos; rulesets may fail (Actions bypass).
# Uses PAT from git remote origin URL (no gh auth login required).
set -euo pipefail

REPO="${1:-itxSaaad/medlens-plus-app}"
GITHUB_ACTIONS_INTEGRATION_ID="${GITHUB_ACTIONS_INTEGRATION_ID:-15368}"

pat_from_git_remote() {
  local remote_url
  remote_url="$(git remote get-url origin 2>/dev/null || true)"
  if [[ -z "$remote_url" ]]; then
    echo "error: no git remote 'origin' found; set GITHUB_TOKEN or run from a clone" >&2
    exit 1
  fi
  if [[ "$remote_url" =~ https://([^@]+)@github.com/ ]]; then
    echo "${BASH_REMATCH[1]}"
    return 0
  fi
  if [[ -n "${GITHUB_TOKEN:-}" ]]; then
    echo "$GITHUB_TOKEN"
    return 0
  fi
  echo "error: origin URL has no embedded PAT and GITHUB_TOKEN is unset" >&2
  exit 1
}

PAT="$(pat_from_git_remote)"
API="https://api.github.com"
AUTH=(-H "Authorization: token ${PAT}" -H "Accept: application/vnd.github+json")

gh_api() {
  local method="$1"
  local path="$2"
  shift 2
  local response
  response="$(curl -sS -w "\n%{http_code}" "${AUTH[@]}" -X "$method" "${API}/${path}" "$@")"
  local status="${response##*$'\n'}"
  local body="${response%$'\n'*}"
  if [[ "$status" -lt 200 || "$status" -ge 300 ]]; then
    echo "$body" >&2
    return 1
  fi
  if [[ -n "$body" ]]; then
    echo "$body"
  fi
}

echo "Updating repository merge settings..."
gh_api PATCH "repos/${REPO}" \
  -H "Content-Type: application/json" \
  --data-binary '{"allow_squash_merge":true,"allow_merge_commit":false,"allow_rebase_merge":false,"allow_auto_merge":false,"delete_branch_on_merge":true}' \
  >/dev/null

protect_branch_classic() {
  local branch="$1"
  local linear_history="$2"
  echo "  Classic protection: ${branch} (linear_history=${linear_history})"

  local linear_block=""
  if [[ "$linear_history" == "true" ]]; then
    linear_block='"required_linear_history": true,'
  fi

  gh_api PUT "repos/${REPO}/branches/${branch}/protection" \
    -H "Content-Type: application/json" \
    --data-binary @- <<EOF
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "Branch Naming Validation",
      "JS Quality - Lint Typecheck Test Build",
      "Python Quality - Ruff Mypy Pytest",
      "Commit And PR Convention Checks"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "require_last_push_approval": true,
    "required_approving_review_count": 1
  },
  "required_conversation_resolution": true,
  ${linear_block}
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF
}

upsert_ruleset() {
  local name="$1"
  local include_refs="$2"
  local linear_history="$3"

  local rules='[
    {"type": "deletion"},
    {"type": "non_fast_forward"},
    {
      "type": "pull_request",
      "parameters": {
        "dismiss_stale_reviews_on_push": true,
        "require_code_owner_review": true,
        "require_last_push_approval": true,
        "required_approving_review_count": 1,
        "required_review_thread_resolution": true
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": true,
        "required_status_checks": [
          {"context": "Branch Naming Validation"},
          {"context": "JS Quality - Lint Typecheck Test Build"},
          {"context": "Python Quality - Ruff Mypy Pytest"},
          {"context": "Commit And PR Convention Checks"}
        ]
      }
    }
  ]'

  if [[ "$linear_history" == "true" ]]; then
    rules='[
      {"type": "deletion"},
      {"type": "non_fast_forward"},
      {"type": "required_linear_history"},
      {
        "type": "pull_request",
        "parameters": {
          "dismiss_stale_reviews_on_push": true,
          "require_code_owner_review": true,
          "require_last_push_approval": true,
          "required_approving_review_count": 1,
          "required_review_thread_resolution": true
        }
      },
      {
        "type": "required_status_checks",
        "parameters": {
          "strict_required_status_checks_policy": true,
          "required_status_checks": [
            {"context": "Branch Naming Validation"},
            {"context": "JS Quality - Lint Typecheck Test Build"},
            {"context": "Python Quality - Ruff Mypy Pytest"},
            {"context": "Commit And PR Convention Checks"}
          ]
        }
      }
    ]'
  fi

  local existing_id
  existing_id="$(gh_api GET "repos/${REPO}/rulesets" | python3 -c "
import json, sys
name = sys.argv[1]
for rs in json.load(sys.stdin):
    if rs.get('name') == name:
        print(rs['id'])
        break
" "$name" 2>/dev/null || true)"

  local payload
  payload="$(python3 -c "
import json, sys
rules = json.loads(sys.argv[1])
includes = json.loads(sys.argv[2])
actor_id = int(sys.argv[3])
print(json.dumps({
  'name': sys.argv[4],
  'target': 'branch',
  'enforcement': 'active',
  'conditions': {'ref_name': {'include': includes, 'exclude': []}},
  'rules': rules,
  'bypass_actors': [{
    'actor_id': actor_id,
    'actor_type': 'Integration',
    'bypass_mode': 'always'
  }]
}))
" "$rules" "$include_refs" "$GITHUB_ACTIONS_INTEGRATION_ID" "$name")"

  if [[ -n "$existing_id" ]]; then
    echo "  Updating ruleset '${name}' (id=${existing_id})"
    if ! gh_api PUT "repos/${REPO}/rulesets/${existing_id}" \
      -H "Content-Type: application/json" \
      --data-binary "$payload" >/dev/null; then
      echo "  warning: failed to update ruleset '${name}' (optional on personal repos)" >&2
    fi
  else
    echo "  Creating ruleset '${name}'"
    if ! gh_api POST "repos/${REPO}/rulesets" \
      -H "Content-Type: application/json" \
      --data-binary "$payload" >/dev/null; then
      echo "  warning: failed to create ruleset '${name}' — classic protection still applies" >&2
    fi
  fi
}

echo "Applying rulesets (optional; GitHub Actions bypass when supported)..."
upsert_ruleset "Protected branch main" '["refs/heads/main"]' true || true
upsert_ruleset "Protected branch develop" '["refs/heads/develop"]' false || true

echo "Applying classic branch protection..."
protect_branch_classic develop false
protect_branch_classic main true

echo "Done."
echo "- Squash merge only; auto-merge disabled; delete branch on merge enabled."
echo "- CODEOWNERS review required (1 approval) on main and develop."
echo "- Classic branch protection is authoritative (personal repos)."
echo "- Rulesets with github-actions bypass are best-effort (org repos)."
echo "- Add repo secret GH_PAT for sync-develop and project automation (docs/ops/GITHUB_AUTOMATION_PAT.md)."
