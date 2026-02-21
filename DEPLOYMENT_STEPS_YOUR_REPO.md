# 🚀 DEPLOYMENT STEPS - YOUR GITHUB REPO IS READY

## Your GitHub Repository:
```
https://github.com/74MM4/backend-for-mohamedsshop-.git
```

---

## Step 1: Initialize Git Locally & Connect to GitHub

Open **Command Prompt** and paste these commands one by one:

```cmd
cd "C:\Users\ammab\OneDrive\Desktop\last version\ecomerce"

"C:\Program Files\Git\bin\git.exe" init

"C:\Program Files\Git\bin\git.exe" config user.name "Your Name"

"C:\Program Files\Git\bin\git.exe" config user.email "your.email@gmail.com"

"C:\Program Files\Git\bin\git.exe" add .

"C:\Program Files\Git\bin\git.exe" commit -m "Backend deployment setup"

"C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/74MM4/backend-for-mohamedsshop-.git

"C:\Program Files\Git\bin\git.exe" branch -M main

"C:\Program Files\Git\bin\git.exe" push -u origin main
```

It will ask for your GitHub username and password - enter them.

---

## Step 2: Deploy to Railway

1. Go to: https://railway.app
2. Login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Find and select: `backend-for-mohamedsshop-`
6. Click "Deploy"

Wait 2-3 minutes for deployment to complete...

Once done, you'll see a URL like: `https://backend-for-mohamedsshop-.up.railway.app`

---

## Step 3: Update Vercel Environment Variable

1. Go to: https://vercel.com/dashboard
2. Click on your project: `mohamedsshop`
3. Go to: Settings → Environment Variables
4. Click "Add New"
5. Fill in:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://backend-for-mohamedsshop-.up.railway.app/api`
   - **Environments**: Check "Production"
6. Click "Save and Redeploy"

Wait 2-3 minutes for Vercel to redeploy...

---

## Step 4: Test Your Live App

1. Open: https://mohamedsshop.vercel.app
2. Try creating an order
3. Check if it saves successfully ✅

---

## Troubleshooting Commands

**Check git status:**
```cmd
"C:\Program Files\Git\bin\git.exe" status
```

**Check git log:**
```cmd
"C:\Program Files\Git\bin\git.exe" log --oneline -1
```

**Check remote:**
```cmd
"C:\Program Files\Git\bin\git.exe" remote -v
```

---

## API Endpoints (Once Deployed)

- Health Check: `https://backend-for-mohamedsshop-.up.railway.app/api/health`
- Get Orders: `https://backend-for-mohamedsshop-.up.railway.app/api/orders`
- Create Order: `https://backend-for-mohamedsshop-.up.railway.app/api/orders` (POST)

---

**Ready? Start with Step 1 above!** 👆
