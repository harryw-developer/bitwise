#!/bin/sh
# Build the site and publish public/ to the gh-pages branch (served by GitHub Pages).
set -e
cd "$(dirname "$0")/.."
sh build.sh
REMOTE=$(git remote get-url origin)
TMP=$(mktemp -d)
cp -R public/. "$TMP"
cd "$TMP"
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy Bitwise $(date -u +%Y-%m-%dT%H:%MZ)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push -q -f "$REMOTE" gh-pages
cd - >/dev/null && rm -rf "$TMP"
echo "Deployed public/ to the gh-pages branch."
