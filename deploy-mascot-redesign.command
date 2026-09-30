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
git commit -m "feat: registration forms, admin dashboard, email integration

- VendorApplicationForm: single/double booth, submits to /api/register
- FoodTruckApplicationForm: cuisine type, space fee \$200
- vendors/page.tsx: replaced Jotform links with native forms
- admin/page.tsx: PIN-gated dashboard (default: studio45), capacity/pricing reference, system status
- api/register/route.ts: unified endpoint for all types, Resend email notifications, force-dynamic
- tickets/page.tsx: fix TypeScript union type error on featured property
- Fix: Resend instantiated inside POST handler (not at module level)"

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
