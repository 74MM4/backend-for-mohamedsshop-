# 🚀 PUSH BACKEND CHANGES TO RENDER

## You Have New Password Reset Features:

✅ Added: `POST /api/auth/request-password-reset`
✅ Added: `POST /api/auth/reset-password`

Now Render needs to redeploy the updated `server.js`

---

## Step 1: Push Changes to GitHub

Open **Command Prompt**:

```cmd
cd "C:\Users\ammab\OneDrive\Desktop\last version\ecomerce"

"C:\Program Files\Git\bin\git.exe" add server.js

"C:\Program Files\Git\bin\git.exe" commit -m "Add password reset endpoints"

"C:\Program Files\Git\bin\git.exe" push origin main
```

---

## Step 2: Render Auto-Deploys

Go to: https://dashboard.render.com

1. Click your service: `backend-for-mohamedsshop`
2. Watch the "Logs" tab
3. You should see it deploying automatically
4. Wait for 🟢 GREEN status (2-3 minutes)

---

## Step 3: Test Password Reset

Go to your app: https://mohamedsshop.vercel.app

1. Click "Forgot Password" 
2. Enter your email
3. Should receive reset code email
4. Enter code and new password
5. ✅ Password reset works!

---

## What if it doesn't auto-redeploy?

Render sometimes needs a manual push:
1. Go to Render Dashboard
2. Click your service
3. Click "Redeploy latest commit" button
4. Wait for build to finish

---

**Ready? Run the git commands above!** 👆
