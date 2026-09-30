#!/usr/bin/env bash
# ==============================================================================
# Niteesh AI Sales & Marketing Command Center - GitHub Sync Script
# Author: Niteesh Pandey <niteeshpandey9555@gmail.com>
# Repository: https://github.com/Niteesh-Pandey/sales-marketing_agent
# ==============================================================================

set -e

echo "🚀 Preparing Niteesh AI Command Center for GitHub Sync..."

# Check git status
git status

# Stage all changes
echo "📦 Staging files..."
git add .

# Prompt for commit message or use default
COMMIT_MSG="${1:-feat: enterprise update - real estate inventory desk, quick filter presets & CI}"

echo "✍️  Committing with message: '$COMMIT_MSG'"
git commit -m "$COMMIT_MSG" || echo "Nothing new to commit."

# Ensure main branch
git branch -M main

# Set remote origin
git remote set-url origin https://github.com/Niteesh-Pandey/sales-marketing_agent.git 2>/dev/null || git remote add origin https://github.com/Niteesh-Pandey/sales-marketing_agent.git

echo ""
echo "===================================================================="
echo "✅ Local commit complete! To push to GitHub, run:"
echo "   git push -u origin main"
echo ""
echo "If using a GitHub Personal Access Token (PAT):"
echo "   git push https://<YOUR_TOKEN>@github.com/Niteesh-Pandey/sales-marketing_agent.git main"
echo "===================================================================="
