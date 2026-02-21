#!/usr/bin/env pwsh
# 🚀 BACKEND DEPLOYMENT SETUP - PATH FIXED FOR GIT

Set-Location "C:\Users\ammab\OneDrive\Desktop\last version\ecomerce"

Write-Host "🚀 Backend Deployment Setup" -ForegroundColor Cyan
Write-Host ""

# Use full path to Git
$git = "C:\Program Files\Git\cmd\git.exe"

# Check if git exists
if (-not (Test-Path $git)) {
    Write-Host "❌ Git not found at: $git" -ForegroundColor Red
    Write-Host "Please install from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Step 1: Initialize Git
Write-Host "📦 Initializing git repository..." -ForegroundColor Yellow
& $git init
& $git config user.name "Ecommerce Developer"
& $git config user.email "dev@ecommerce.app"

# Step 2: Add all files
Write-Host "📝 Staging all files..." -ForegroundColor Yellow
& $git add .

# Step 3: Commit
Write-Host "💾 Creating initial commit..." -ForegroundColor Yellow
& $git commit -m "Backend deployment setup - Ready for Railway"

# Step 4: Summary
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ GIT INITIALIZED!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 NEXT STEPS:" -ForegroundColor Green
Write-Host ""
Write-Host "1️⃣  Create GitHub repository:"
Write-Host "   → https://github.com/new"
Write-Host "   → Name: ecommerce-backend"
Write-Host "   → Copy HTTPS URL"
Write-Host ""
Write-Host "2️⃣  Connect to GitHub:" -ForegroundColor Yellow
Write-Host "   & '$git' remote add origin https://github.com/YOUR-USERNAME/ecommerce-backend.git"
Write-Host "   & '$git' branch -M main"
Write-Host "   & '$git' push -u origin main"
Write-Host ""
Write-Host "3️⃣  Deploy to Railway:" -ForegroundColor Yellow
Write-Host "   → https://railway.app"
Write-Host "   → Login with GitHub"
Write-Host "   → New Project → Deploy from GitHub"
Write-Host "   → Select your repository"
Write-Host ""
Write-Host "4️⃣  Update Vercel:" -ForegroundColor Yellow
Write-Host "   → https://vercel.com/dashboard"
Write-Host "   → Settings > Environment Variables"
Write-Host "   → Add: NEXT_PUBLIC_API_URL = https://your-railway-url.up.railway.app/api"
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
