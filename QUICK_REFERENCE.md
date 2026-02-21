# 🚀 QUICK REFERENCE CARD

## Installation (Do Once)
```
1. Install Git: https://git-scm.com/download/win
2. Restart PowerShell
3. Verify: git --version
```

## Local Testing (Do First)
```powershell
# Terminal 1
cd "last version\ecomerce"
npm run backend

# Terminal 2
cd "last version\ecomerce"
npm run dev
```
✅ Test at: http://localhost:3000

## Deployment (Do Second)
```powershell
cd "last version\ecomerce"

# Initialize git
git init
git config user.name "Your Name"
git config user.email "your@email.com"
git add .
git commit -m "Ready to deploy"

# Connect to GitHub (get URL from github.com/new)
git remote add origin https://github.com/YOU/ecommerce-backend.git
git branch -M main
git push -u origin main

# Then go to https://railway.app
# Deploy from GitHub
# Copy URL and update Vercel env variable
```

## Environment Variables (Copy-Paste)
**In Vercel Dashboard:**
```
Name: NEXT_PUBLIC_API_URL
Value: https://YOUR-RAILWAY-URL.up.railway.app/api
```

## API Endpoints
```
GET    /api/health                    Check if alive
GET    /api/orders                    Get all orders
POST   /api/orders                    Create order
PATCH  /api/orders/:id                Update order
DELETE /api/orders/:id                Delete order
POST   /api/auth/register             Register user
POST   /api/auth/validate             Check email
POST   /api/send-order-confirmation   Send email
```

## File Locations
- **Backend Server**: `server.js`
- **Orders**: `orders.json`
- **Users**: `users.json`
- **Config**: `railway.json`, `vercel.json`
- **Env Vars**: `.env.local`

## Links
- Vercel: https://vercel.com/dashboard
- Railway: https://railway.app
- GitHub: https://github.com
- Your App: https://mohamedsshop.vercel.app
