#!/usr/bin/env pwsh
# 🚀 FREE Backend Deployment - Via RENDER
# This automates pushing to GitHub for Render deployment

$gitPath = "C:\Program Files\Git\bin\git.exe"
$repoUrl = "https://github.com/74MM4/backend-for-mohamedsshop-.git"

Set-Location "C:\Users\ammab\OneDrive\Desktop\last version\ecomerce"

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  FREE Backend Deployment" -ForegroundColor Green
Write-Host "  Using Render.com (Free Tier)" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Step 1
Write-Host "[1/5] Initializing Git..." -ForegroundColor Yellow
& $gitPath init
& $gitPath config user.name "Ecommerce Developer"
& $gitPath config user.email "dev@ecommerce.app"

# Step 2
Write-Host "[2/5] Staging files..." -ForegroundColor Yellow
& $gitPath add .

# Step 3
Write-Host "[3/5] Creating commit..." -ForegroundColor Yellow
& $gitPath commit -m "Backend ready for Render - Free deployment"

# Step 4
Write-Host "[4/5] Connecting to GitHub..." -ForegroundColor Yellow
& $gitPath remote add origin $repoUrl
& $gitPath branch -M main

# Step 5
Write-Host "[5/5] Pushing to GitHub..." -ForegroundColor Yellow
& $gitPath push -u origin main

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ CODE PUSHED TO GITHUB!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 NEXT STEPS:" -ForegroundColor Green
Write-Host ""
Write-Host "1. Go to: https://render.com"
Write-Host "2. Sign up with GitHub"
Write-Host "3. New Web Service"
Write-Host "4. Connect: backend-for-mohamedsshop-"
Write-Host "5. Settings:"
Write-Host "   Build Command: npm install"
Write-Host "   Start Command: node server.js"
Write-Host "   Plan: Free"
Write-Host "6. Deploy (wait 3-5 min)"
Write-Host "7. Copy URL: https://backend-xxx.onrender.com"
Write-Host ""
Write-Host "8. Update Vercel:"
Write-Host "   https://vercel.com/dashboard"
Write-Host "   Environment Variable:"
Write-Host "   Name: NEXT_PUBLIC_API_URL"
Write-Host "   Value: https://backend-xxx.onrender.com/api"
Write-Host "   Redeploy"
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
