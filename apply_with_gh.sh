#!/usr/bin/env bash
set -euo pipefail
REPO_URL=${1:-"https://github.com/cortega26/LastWar"}
BRANCH=${2:-"chore/ai-first-workflow-v4"}

tmpdir=$(mktemp -d)
echo "Using temp dir: $tmpdir"
git clone "$REPO_URL" "$tmpdir/repo"
cd "$tmpdir/repo"

git checkout -b "$BRANCH"
rsync -av "/mnt/data/lastwar_pr_kit_v4"/ "./"

git add .github docs CONTRIBUTING.md PR_BODY.md
git commit -m "chore(process): add AI-first docs & templates (non-destructive)"
git push -u origin "$BRANCH"

if command -v gh >/dev/null 2>&1; then
  gh pr create --title "chore(process): add AI-first docs & templates (non-destructive)" --body-file "PR_BODY.md" --fill --base main ||   gh pr create --title "chore(process): add AI-first docs & templates (non-destructive)" --body-file "PR_BODY.md" --fill --base master
else
  echo "Branch pushed. Open a PR in GitHub UI."
fi
