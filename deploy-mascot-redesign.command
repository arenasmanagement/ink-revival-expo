#!/bin/bash
# ── West TN Ink Revival — Deploy mascot redesign ──────────────────────────
set -e

REPO="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REMOTE="https://github.com/arenasmanagement/ink-revival-expo.git"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  West TN Ink Revival — Mascot Redesign Deployment   ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "📁  Working in: $REPO"
echo ""

cd "$REPO"

# ── Remove stale .git if it exists (fresh start) ──────────────────────────
if [ -d ".git" ]; then
  echo "🧹  Clearing previous git state..."
  rm -rf .git
fi

# ── Init, stage everything, commit ───────────────────────────────────────
echo "🔧  Initializing git and staging all project files..."
git init -b main

git config user.email "arenasmanagementco@gmail.com"
git config user.name "Arenas Management"

git remote add origin "$REMOTE"

# Stage everything (node_modules + .next excluded via .gitignore)
git add .

echo ""
echo "📋  Files to be committed:"
git status --short | head -30
echo "..."
echo ""

echo "🔀  Committing..."
git commit -m "feat: mascot integration + homepage redesign

- Add mascot-2027.jpg (Year 1 fishing frog illustration)
- Hero: cinematic sunset background, mascot centerpiece, Rye title
- MascotSection: dark ink bg, vintage frame, annual tradition tracker
- FlashCards: 5 American Traditional SVG icon cards linking all pages
- EmailSignup: parchment bg, mascot peeking left, dragonfly SVG
- Footer: 'See you at the pond!' mascot badge (lg screens)
- Navbar: crimson ticker announcement bar
- globals.css: warm color tokens, flash-card styles, animation keyframes
- 404: fishing-themed copy + mascot"

echo ""
echo "🚀  Pushing to GitHub (force push — enter credentials if prompted)..."
git push origin main --force

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  ✅  DONE! Vercel deploys in ~60 seconds.            ║"
echo "║      Check: https://www.westtninkrevival.com         ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
read -p "Press Enter to close..."
