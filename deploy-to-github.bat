@echo off
REM FREE Backend Deployment to RENDER
REM Using: https://render.com (Completely Free!)

title FREE Backend Deployment - Render.com

cd /d "C:\Users\ammab\OneDrive\Desktop\last version\ecomerce"

echo.
echo ====================================
echo   FREE Backend Deployment
echo   Platform: Render.com
echo ====================================
echo.

REM Initialize git
echo [1/5] Initializing Git repository...
"C:\Program Files\Git\bin\git.exe" init

echo [2/5] Configuring Git...
"C:\Program Files\Git\bin\git.exe" config user.name "Developer"
"C:\Program Files\Git\bin\git.exe" config user.email "dev@app.com"

echo [3/5] Staging all files...
"C:\Program Files\Git\bin\git.exe" add .

echo [4/5] Creating commit...
"C:\Program Files\Git\bin\git.exe" commit -m "Backend ready for Render free deployment"

echo [5/5] Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/74MM4/backend-for-mohamedsshop-.git
"C:\Program Files\Git\bin\git.exe" branch -M main
"C:\Program Files\Git\bin\git.exe" push -u origin main

echo.
echo ====================================
echo   SUCCESS! Code pushed to GitHub!
echo ====================================
echo.
echo DEPLOYMENT STEPS (FREE):
echo.
echo 1. Go to: https://render.com
echo    Click "Sign up" with GitHub
echo.
echo 2. Click "New +" → "Web Service"
echo.
echo 3. Connect Repository:
echo    Select: backend-for-mohamedsshop-
echo.
echo 4. Configure:
echo    - Name: backend-for-mohamedsshop
echo    - Environment: Node
echo    - Build Command: npm install
echo    - Start Command: node server.js
echo    - Plan: Free (important!)
echo.
echo 5. Click "Create Web Service"
echo.
echo 6. Wait 3-5 minutes for deployment
echo.
echo 7. Copy your URL from Render dashboard
echo    (looks like: https://backend-xxx.onrender.com)
echo.
echo 8. Go to: https://vercel.com/dashboard
echo    Settings > Environment Variables
echo    Add:
echo      Name: NEXT_PUBLIC_API_URL
echo      Value: https://backend-xxx.onrender.com/api
echo    Redeploy
echo.
echo 9. Test: Visit https://mohamedsshop.vercel.app
echo    Create an order - should work!
echo.
echo ====================================
echo.
pause
