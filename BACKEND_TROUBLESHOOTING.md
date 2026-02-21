# 🔧 BACKEND TROUBLESHOOTING GUIDE

## Check 1: Is Backend Running Locally?

Open Command Prompt and test:

```cmd
curl http://localhost:5000/api/health
```

If it works, you'll see: `{"status":"Backend is running"}`

If it fails:
```cmd
cd "C:\Users\ammab\OneDrive\Desktop\last version\ecomerce"
npm run backend
```

Then test again. **The backend MUST be running first before the frontend works!**

---

## Check 2: Is Frontend Connected to Backend?

Check your `.env.local` file in the `ecomerce` folder:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

✅ This should be set correctly for local testing.

---

## Check 3: Does Password Reset Endpoint Exist?

Your backend currently has these endpoints:
- ✅ POST `/api/send-confirmation-code`
- ✅ POST `/api/send-order-confirmation`
- ✅ POST `/api/auth/login`
- ✅ POST `/api/auth/register`
- ❌ **NO** `/api/password-reset` endpoint

---

## The Fix: Add Password Reset Endpoint

Your backend is missing the password reset functionality. Here's what to do:

### Option A: Quick Test (Skip Password Reset)
Just test other features first. Make sure:
1. Backend is running: `npm run backend`
2. Frontend is running: `npm run dev`
3. Test an order (not password reset)

### Option B: Add Password Reset Feature
I can add the password reset endpoint to your backend. It will:
- Accept email
- Generate reset code
- Send email with reset link
- Update password

Would you like me to add this feature?

---

## Checklist Before Testing:

- [ ] Git installed locally
- [ ] Backend running (`npm run backend`)
- [ ] Frontend running (`npm run dev`)
- [ ] Test: http://localhost:3000
- [ ] Try creating an order (not password reset)
- [ ] If order works, then it's just the password reset feature missing

---

## Current Status:

Your issue is likely **ONE** of these:

| Issue | Sign | Fix |
|-------|------|-----|
| Backend not running | Can't connect to API | Run `npm run backend` |
| Wrong API URL | API URL is empty/wrong | Check `.env.local` |
| Password reset missing | Feature doesn't exist | Need to add endpoint |

---

**What happens when you open https://mohamedsshop.vercel.app right now?**
- Can you create orders? 
- Where exactly do you see "Failed to send password reset email"?
