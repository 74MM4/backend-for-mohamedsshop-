# 🔧 RENDER BACKEND TROUBLESHOOTING

## Step 1: Check if Render Backend is Running

Go to: https://dashboard.render.com

1. Click on your service: `backend-for-mohamedsshop`
2. Look at the status:
   - 🟢 **Green** = Running (should be working)
   - 🔴 **Red** = Failed (needs investigation)
   - 🟡 **Yellow** = Building

---

## Step 2: Check the Logs

In Render Dashboard:
1. Click your service
2. Click "Logs" tab
3. Look for errors

Common errors:

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find module` | Missing dependency | Install in package.json |
| `ENOENT: no such file` | File missing | Check files uploaded |
| `PORT not available` | Port conflict | Should auto-use PORT env var |
| `EACCES: permission denied` | File permissions | Usually auto-fixed by Render |

---

## Step 3: Test the Backend URL

Your Render URL should be something like:
```
https://backend-for-mohamedsshop.onrender.com
```

**Test it works:**
```
https://backend-for-mohamedsshop.onrender.com/api/health
```

Open this in your browser:
- ✅ If you see JSON response → Backend is working
- ❌ If you see error → Backend has issues

---

## Step 4: Check Vercel Env Variable

1. Go to: https://vercel.com/dashboard
2. Project: `mohamedsshop`
3. Settings → Environment Variables
4. Check `NEXT_PUBLIC_API_URL`

Should be exactly:
```
https://backend-for-mohamedsshop.onrender.com/api
```

(ends with `/api`)

If wrong, update it and redeploy.

---

## Common Render Issues & Fixes

### Issue 1: "Application failed to start"
**Check:**
- Do you have `server.js` in your repo?
- Is `Start Command` set to: `node server.js`?
- Does `package.json` have all dependencies?

**Fix:**
Redeploy in Render:
1. Go to your service
2. Click "Deploy" button
3. Select "Clear build cache" 
4. Deploy again

### Issue 2: "Cannot POST /api/orders"
**Check:**
- Is the endpoint in `server.js`?
- Is it exactly `app.post('/api/orders')`?

**Fix:**
Verify endpoint exists in server.js (lines 41-62)

### Issue 3: "Service unavailable"
**Check:**
- Is Render service still running?
- Check the Logs tab for crashes

**Fix:**
Restart service:
1. Go to service settings
2. Click "Restart" button
3. Wait 2-3 minutes

### Issue 4: "Cannot find /api/health"
**This means:** Backend URL is wrong in Vercel

**Fix:**
1. Check Render service URL
2. Update Vercel `NEXT_PUBLIC_API_URL` to match
3. Add `/api` at the end
4. Redeploy Vercel

---

## Debug Checklist

- [ ] Render service shows 🟢 green status
- [ ] `https://backend-for-mohamedsshop.onrender.com/api/health` returns JSON
- [ ] Vercel env variable `NEXT_PUBLIC_API_URL` is correct
- [ ] `server.js` is in your GitHub repo
- [ ] `package.json` has all dependencies
- [ ] Start command is: `node server.js`

---

## Quick Check: Is It Render or Vercel?

**Test locally first:**
```cmd
cd "C:\Users\ammab\OneDrive\Desktop\last version\ecomerce"

# Terminal 1
npm run backend

# Terminal 2  
npm run dev
```

Try at http://localhost:3000

- ✅ Works locally but not live → **Render problem**
- ❌ Doesn't work locally → **Code problem**

---

**Tell me:**
1. What's the status (🟢 green or 🔴 red) on your Render service?
2. What do you see when you visit: `https://backend-for-mohamedsshop.onrender.com/api/health` ?
3. What errors are in the Render Logs?
