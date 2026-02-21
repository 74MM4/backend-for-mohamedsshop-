#!/bin/bash
# 🚀 ONE-COMMAND BACKEND DEPLOYMENT SETUP
# This script prepares your ecomerce app for Railway deployment

echo "🚀 Initializing Backend Deployment Setup..."

# Step 1: Initialize Git (if not already done)
if [ -d .git ]; then
  echo "✅ Git already initialized"
else
  echo "📦 Initializing git repository..."
  git init
  git config user.name "Ecommerce Developer"
  git config user.email "dev@ecommerce.app"
fi

# Step 2: Add all files
echo "📝 Staging all files..."
git add .

# Step 3: Initial commit
echo "💾 Creating initial commit..."
git commit -m "Backend deployment setup - Ready for Railway"

# Step 4: Create GitHub remote (user will need to provide this)
echo ""
echo "================================"
echo "✅ SETUP COMPLETE!"
echo "================================"
echo ""
echo "📍 NEXT STEPS:"
echo ""
echo "1️⃣  Create a GitHub repository at https://github.com/new"
echo "2️⃣  Add remote (replace USERNAME/REPO with your values):"
echo "   git remote add origin https://github.com/USERNAME/REPO.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3️⃣  Go to Railway.app and deploy:"
echo "   - Click 'New Project'"
echo "   - Select 'Deploy from GitHub'"
echo "   - Choose your repository"
echo "   - Railway auto-detects railway.json and deploys!"
echo ""
echo "4️⃣  Get your Railway URL and update Vercel env variables"
echo ""
echo "================================"
