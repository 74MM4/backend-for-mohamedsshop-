@echo off
REM Deploy to Railway - Complete Automation Script
REM Double-click this file to run!

title Backend Deployment Setup

cd /d "C:\Users\ammab\OneDrive\Desktop\last version\ecomerce"

echo.
echo ====================================
echo   Backend Deployment - Git Setup
echo ====================================
echo.

REM Initialize git
echo [1/5] Initializing Git repository...
"C:\Program Files\Git\bin\git.exe" init

echo [2/5] Configuring Git...
"C:\Program Files\Git\bin\git.exe" config user.name "Ecommerce Developer"
"C:\Program Files\Git\bin\git.exe" config user.email "dev@ecommerce.app"

echo [3/5] Staging all files...
"C:\Program Files\Git\bin\git.exe" add .

echo [4/5] Creating initial commit...
"C:\Program Files\Git\bin\git.exe" commit -m "Backend deployment - Ready for Railway"

echo [5/5] Checking git status...
"C:\Program Files\Git\bin\git.exe" status

echo.
echo ====================================
echo   SETUP COMPLETE!
echo ====================================
echo.
echo NEXT STEPS:
echo.
echo 1. Create GitHub repository:
echo    - Go to: https://github.com/new
echo    - Name it: ecommerce-backend
echo    - Click Create
echo    - Copy the HTTPS URL
echo.
echo 2. Connect to GitHub (replace YOUR-USERNAME):
echo    Open Command Prompt and run:
echo.
echo    cd "C:\Users\ammab\OneDrive\Desktop\last version\ecomerce"
echo.
echo    "C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/YOUR-USERNAME/ecommerce-backend.git
echo    "C:\Program Files\Git\bin\git.exe" branch -M main
echo    "C:\Program Files\Git\bin\git.exe" push -u origin main
echo.
echo 3. Deploy to Railway:
echo    - Go to https://railway.app
echo    - Login with GitHub
echo    - Click "New Project"
echo    - Select "Deploy from GitHub"
echo    - Choose your ecommerce-backend repo
echo    - Wait for deployment (2-3 minutes)
echo.
echo 4. Get Railway URL and update Vercel:
echo    - Copy URL from Railway dashboard
echo    - Go to https://vercel.com/dashboard
echo    - Click on your project (mohamedsshop)
echo    - Settings > Environment Variables
echo    - Add: NEXT_PUBLIC_API_URL = https://your-railway-url.up.railway.app/api
echo    - Redeploy
echo.
echo ====================================
echo.
pause

