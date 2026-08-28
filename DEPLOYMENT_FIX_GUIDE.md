# 🔧 Fix Deployment Connection Error

## Problem
Frontend on Vercel can't connect to backend - showing "Network Error"

Your deployed URLs:
- ✅ Frontend: https://smart-internship-finder.vercel.app
- ✅ Backend: https://smart-internship-finder-qo8q.onrender.com

---

## 🎯 Solution: Update Environment Variables

### Step 1: Update Backend on Render

Go to: https://dashboard.render.com → Your backend service → Environment

**Add/Update these variables:**

```bash
CLIENT_URL=https://smart-internship-finder.vercel.app
ALLOWED_ORIGINS=https://smart-internship-finder.vercel.app
```

Then click **"Save Changes"** and it will auto-redeploy.

---

### Step 2: Update Frontend on Vercel

Go to: https://vercel.com/dashboard → Your project → Settings → Environment Variables

**Add/Update this variable:**

For **Production** environment:
```bash
VITE_API_URL=https://smart-internship-finder-qo8q.onrender.com/api
```

Then:
1. Click **"Save"**
2. Go to **Deployments** tab
3. Click the **three dots (...)** on latest deployment
4. Click **"Redeploy"**

---

## ✅ Verification

After redeploying both services:

### 1. Test Backend Health
Open: https://smart-internship-finder-qo8q.onrender.com/api/health

Should return:
```json
{
  "status": "ok",
  "service": "smart-internship-finder-api",
  "message": "Backend API is healthy"
}
```

### 2. Test Frontend
Open: https://smart-internship-finder.vercel.app

- Should load the page
- Try registering/logging in
- Should connect to backend successfully

---

## 🔍 If Still Not Working

### Check CORS in Backend

The backend `server.js` should have your Vercel URL in allowed origins.

Update `backend/server.js`:

```javascript
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'https://smart-internship-finder.vercel.app', // Add this
  'http://localhost:5173', // Keep for local dev
];
```

Then commit and push:
```bash
git add backend/server.js
git commit -m "Add Vercel URL to CORS"
git push origin main
```

Render will auto-deploy.

---

## 📝 Complete Environment Variables Reference

### Backend (Render)
```bash
# Required
DATABASE_URL=postgresql://neondb_owner:npg_roLIJ2wgVAz8@ep-dry-frog-a5ks8ibg-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=<your-generated-secret>
NODE_ENV=production
PORT=5000

# CORS - Your Vercel frontend URL
CLIENT_URL=https://smart-internship-finder.vercel.app
ALLOWED_ORIGINS=https://smart-internship-finder.vercel.app

# AI Service (if deployed)
AI_SERVICE_URL=https://your-ai-service.onrender.com

# Admin credentials
ADMIN_EMAIL=admin@smartintern.com
ADMIN_PASSWORD=Admin@2024
```

### Frontend (Vercel)
```bash
# Your Render backend URL
VITE_API_URL=https://smart-internship-finder-qo8q.onrender.com/api
```

---

## 🐛 Troubleshooting

### Error: "Network Error"
**Cause:** Frontend can't reach backend
**Fix:** 
1. Check `VITE_API_URL` in Vercel env vars
2. Make sure backend is running on Render
3. Test backend URL directly in browser

### Error: "CORS policy: No 'Access-Control-Allow-Origin'"
**Cause:** Backend not allowing Vercel URL
**Fix:**
1. Check `CLIENT_URL` in Render env vars
2. Update `allowedOrigins` in `server.js`
3. Redeploy backend

### Backend shows "Service is sleeping"
**Cause:** Render free tier auto-sleeps after 15min
**Fix:** 
- Wait 30 seconds for it to wake up
- Or upgrade to paid tier ($7/month always-on)

---

## 🚀 Quick Fix Commands

### Update and redeploy backend:
```bash
# Update server.js with Vercel URL
git add backend/server.js
git commit -m "Add Vercel URL to CORS"
git push origin main

# Render auto-deploys from GitHub
```

### Update frontend env on Vercel:
1. Vercel Dashboard → Project → Settings
2. Environment Variables
3. Add: `VITE_API_URL` = `https://smart-internship-finder-qo8q.onrender.com/api`
4. Deployments → Redeploy

---

## ✅ After Fixing

Your app should work:
- ✅ Register new account
- ✅ Login
- ✅ Browse internships
- ✅ Upload resume
- ✅ All features working!

---

## 💡 Pro Tips

### 1. Always use environment variables
Never hardcode URLs in your code.

### 2. Test backend directly
Always verify backend is working before testing frontend.

### 3. Check browser console
Press F12 to see exact error messages.

### 4. Monitor Render logs
Go to Render dashboard → Logs to see backend errors.

---

**Your URLs:**
- 🌐 Frontend: https://smart-internship-finder.vercel.app
- 🔧 Backend: https://smart-internship-finder-qo8q.onrender.com
- 🏥 Health Check: https://smart-internship-finder-qo8q.onrender.com/api/health

**Good luck! 🚀**
