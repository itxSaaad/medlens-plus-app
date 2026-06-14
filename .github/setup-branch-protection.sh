#!/usr/bin/env bash
# Apply repository merge settings and classic branch protection for MedLens+.
set -euo pipefail

REPO="${1:-itxSaaad/medlens-plus-app}"

echo "Updating repository merge settings..."
gh api -X PATCH "repos/${REPO}" \
  -f allow_squash_merge=true \
  -f allow_merge_commit=false \
  -f allow_rebase_merge=false \
  -f allow_auto_merge=false \
  -f delete_branch_on_merge=true

protect_branch() {
  local branch="$1"
  local reviews="$2"
  echo "  Protecting ${branch} (reviews: ${reviews})"
  # TODO(solo-maintainer): set require_code_owner_reviews=true and reviews=1 when a second reviewer exists
  gh api -X PUT "repos/${REPO}/branches/${branch}/protection" --input - <<EOF
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
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "require_last_push_approval": false,
    "required_approving_review_count": ${reviews}
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF
}

echo "Applying classic branch protection..."
protect_branch develop 0
protect_branch main 0

echo "Done. Squash merge only at repo level; develop/main protected from deletion."
