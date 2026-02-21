@echo off
REM Deploy to Railway with YOUR GitHub Repository
REM Created for: https://github.com/74MM4/backend-for-mohamedsshop-.git

title Backend Deployment Setup - 74MM4

cd /d "C:\Users\ammab\OneDrive\Desktop\last version\ecomerce"

echo.
echo ====================================
echo   Backend Deployment Setup
echo   Repo: backend-for-mohamedsshop-
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

echo [5/5] Connecting to GitHub...
"C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/74MM4/backend-for-mohamedsshop-.git
"C:\Program Files\Git\bin\git.exe" branch -M main
"C:\Program Files\Git\bin\git.exe" push -u origin main

echo.
echo ====================================
echo   SETUP COMPLETE!
echo ====================================
echo.
echo Your code has been pushed to GitHub!
echo.
echo NEXT STEPS:
echo.
echo 1. Go to Railway: https://railway.app
echo    - Login with GitHub
echo    - New Project > Deploy from GitHub
echo    - Select: backend-for-mohamedsshop-
echo    - Wait 2-3 minutes for deployment
echo    - Copy the Railway URL
echo.
echo 2. Update Vercel Environment Variable:
echo    - Go to: https://vercel.com/dashboard
echo    - Project: mohamedsshop
echo    - Settings > Environment Variables
echo    - Add:
echo      Name: NEXT_PUBLIC_API_URL
echo      Value: https://[YOUR-RAILWAY-URL].up.railway.app/api
echo      Environments: Production
echo    - Click "Save and Redeploy"
echo.
echo 3. Test:
echo    - Visit: https://mohamedsshop.vercel.app
echo    - Create an order
echo    - Check if it saves!
echo.
echo ====================================
echo.
pause
