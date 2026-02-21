# 🚀 Backend Deployment Guide for Ecomerce

## Option 1: Deploy Backend to Railway (Recommended)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Create Railway Account & Deploy
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect `railway.json` and deploy automatically

### Step 3: Get Your Backend URL
- Go to Railway Dashboard → Your Project
- Copy the URL (looks like: `https://your-app.up.railway.app`)

### Step 4: Update Vercel Environment Variables
1. Go to Vercel Dashboard → Your Project (mohamedsshop)
2. Settings → Environment Variables
3. Add new variable:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-app.up.railway.app/api`
   - Environments: Production
4. Click "Save"
5. Redeploy from production (or push a new commit to main)

### Step 5: Test Connection
Visit your app: https://mohamedsshop.vercel.app
- Try creating an order
- Check Railways Dashboard → Logs to see API requests

---

## Testing Locally

```bash
# Terminal 1: Start Frontend
cd "last version/ecomerce"
npm install
npm run dev
# Opens http://localhost:3000

# Terminal 2: Start Backend
cd "last version/ecomerce"
npm install
npm run backend
# Runs on http://localhost:5000

# The app will auto-connect to http://localhost:5000/api
```

---

## API Endpoints Available

- `GET /api/health` - Health check
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `DELETE /api/orders/:id` - Delete order
- `PATCH /api/orders/:id` - Update order status
- `POST /api/send-order-confirmation` - Email confirmation
- `POST /api/auth/register` - User registration
- `POST /api/auth/validate` - Email validation

---

## Next Steps After Deployment
1. ✅ Deploy backend to Railway
2. ✅ Update Vercel environment variable with Railway URL
3. ✅ Redeploy on Vercel
4. ✅ Test your app at https://mohamedsshop.vercel.app
5. ✅ Check Railway logs for any errors
