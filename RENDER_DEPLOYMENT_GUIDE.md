# 🚀 Render.com Deployment Guide - Smart Internship Finder

## 📋 Why Render?

- ✅ **Free Tier Available** (750 hours/month)
- ✅ **Easier than Vercel** for full-stack apps
- ✅ **Built-in PostgreSQL** support
- ✅ **Auto-deploy from GitHub**
- ✅ **Support for Python (AI service)**

---

## 🎯 Step 1: Deploy Backend to Render

### A. Prepare Your Code

Already done! ✅ The `package.json` now has a build script.

### B. Create New Web Service

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:

```
Name: smart-internship-backend
Root Directory: backend
Environment: Node
Region: Oregon (US West) or closest to you
Branch: main
Build Command: npm install
Start Command: npm start
```

### C. Add Environment Variables

In Render dashboard, go to **Environment** tab and add:

```bash
# Database (Use your Neon URL)
DATABASE_URL=postgresql://neondb_owner:npg_roLIJ2wgVAz8@ep-dry-frog-a5ks8ibg-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require

# Generate new JWT secret
JWT_SECRET=<your-generated-secret>

# URLs (update after deploying frontend)
CLIENT_URL=https://your-frontend.onrender.com
AI_SERVICE_URL=https://your-ai-service.onrender.com

# Other settings
NODE_ENV=production
PORT=5000
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### D. Deploy

Click **"Create Web Service"** - Render will automatically deploy!

Your backend will be available at:
```
https://your-backend-name.onrender.com
```

---

## 🎯 Step 2: Deploy AI Service to Render

### A. Create Python Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:

```
Name: smart-internship-ai
Root Directory: ai-service
Environment: Python 3
Region: Same as backend (Oregon)
Branch: main
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### B. Add Environment Variables

```bash
PYTHON_VERSION=3.11
```

### C. Deploy

Click **"Create Web Service"**

Your AI service will be available at:
```
https://your-ai-service.onrender.com
```

---

## 🎯 Step 3: Deploy Frontend to Render

### A. Update Frontend Environment

Create `frontend/.env.production`:

```bash
VITE_API_URL=https://your-backend-name.onrender.com/api
```

### B. Create Static Site

1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure:

```
Name: smart-internship-frontend
Root Directory: frontend
Branch: main
Build Command: npm install && npm run build
Publish Directory: dist
```

### C. Add Environment Variables

```bash
VITE_API_URL=https://your-backend-name.onrender.com/api
```

### D. Deploy

Click **"Create Static Site"**

Your frontend will be available at:
```
https://your-frontend-name.onrender.com
```

---

## 🎯 Step 4: Update Environment Variables

After all services are deployed:

### Backend Service

Update these variables:
```bash
CLIENT_URL=https://your-frontend-name.onrender.com
AI_SERVICE_URL=https://your-ai-service.onrender.com
```

Then click **"Manual Deploy"** → **"Deploy latest commit"**

---

## ✅ Verification Checklist

Test each service:

### 1. AI Service Health Check
```bash
curl https://your-ai-service.onrender.com/api/health
```
Should return: `{"status":"ok"}`

### 2. Backend Health Check
```bash
curl https://your-backend-name.onrender.com/api/health
```
Should return: `{"status":"ok","service":"smart-internship-finder-api"}`

### 3. Frontend
Open: `https://your-frontend-name.onrender.com`
- Should load login page
- Try logging in with: `student@test.com` / `Student@123`

---

## 🔒 Environment Variables Summary

### Backend (`smart-internship-backend`)
```bash
DATABASE_URL=postgresql://neondb_owner:npg_roLIJ2wgVAz8@ep-dry-frog-a5ks8ibg-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=<64-char-random-string>
CLIENT_URL=https://your-frontend-name.onrender.com
AI_SERVICE_URL=https://your-ai-service.onrender.com
NODE_ENV=production
PORT=5000
ADMIN_EMAIL=admin@smartintern.com
ADMIN_PASSWORD=Admin@2024
```

### AI Service (`smart-internship-ai`)
```bash
PYTHON_VERSION=3.11
```

### Frontend (`smart-internship-frontend`)
```bash
VITE_API_URL=https://your-backend-name.onrender.com/api
```

---

## ⚠️ Important Notes

### Free Tier Limitations

**Auto-Sleep:**
- Services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- Solution: Upgrade to $7/month for always-on

**Build Time:**
- Backend: ~2 minutes
- AI Service: ~3 minutes (Python packages)
- Frontend: ~1 minute

### CORS Configuration

Already configured in `server.js`:
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
```

### Database Connection

Your Neon database is already configured with SSL.
No additional setup needed!

---

## 🐛 Troubleshooting

### Error: "Application failed to respond"

**Solution:**
1. Check logs in Render dashboard
2. Verify `PORT` environment variable is set
3. Ensure server listens on `0.0.0.0`, not `localhost`

In `server.js`, use:
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Error: "Cannot connect to database"

**Solution:**
1. Check `DATABASE_URL` is correct
2. Verify Neon database is active
3. Check SSL mode: `?sslmode=require`

### Error: "CORS policy blocked"

**Solution:**
1. Check `CLIENT_URL` matches frontend URL exactly
2. Verify frontend URL has no trailing slash
3. Redeploy backend after updating `CLIENT_URL`

### AI Service Not Responding

**Solution:**
1. Check `AI_SERVICE_URL` in backend env
2. Verify AI service is running (check Render dashboard)
3. Test AI health endpoint: `/api/health`

---

## 💰 Cost Breakdown

### Free Tier
- **Backend:** $0/month (with auto-sleep)
- **AI Service:** $0/month (with auto-sleep)
- **Frontend:** $0/month (static site)
- **Neon DB:** $0/month (0.5GB free)
- **Total:** $0/month ✅

### Paid Tier (Recommended for Production)
- **Backend:** $7/month (always-on)
- **AI Service:** $7/month (always-on)
- **Frontend:** $0/month (static)
- **Neon DB:** $19/month (production tier)
- **Total:** $33/month

---

## 🔄 Auto-Deploy Setup

### Enable Auto-Deploy

1. Go to service settings
2. Scroll to **Auto-Deploy**
3. Enable **"Auto-Deploy from GitHub"**
4. Select branch: `main`

Now every push to `main` automatically deploys!

```bash
git add .
git commit -m "Update feature"
git push origin main
# Render deploys automatically!
```

---

## 📊 Monitoring

### View Logs

1. Go to Render dashboard
2. Select your service
3. Click **"Logs"** tab
4. Real-time logs appear here

### Metrics

1. Click **"Metrics"** tab
2. View:
   - CPU usage
   - Memory usage
   - Request rate
   - Response time

---

## 🎉 Success!

Your Smart Internship Finder is now deployed on Render!

**URLs:**
- 🌐 Frontend: `https://your-frontend-name.onrender.com`
- 🔧 Backend: `https://your-backend-name.onrender.com`
- 🤖 AI Service: `https://your-ai-service.onrender.com`
- 🗄️ Database: Neon PostgreSQL (cloud)

---

## 🔐 Security Checklist

- [ ] Changed JWT_SECRET from default
- [ ] Updated ADMIN_PASSWORD
- [ ] Enabled HTTPS (automatic on Render)
- [ ] CORS configured with frontend URL
- [ ] Database uses SSL connection
- [ ] Environment variables are encrypted
- [ ] No secrets in Git repository

---

## 📱 Share Your App

Your app is live! Share it with:
- Classmates
- Professors
- Potential employers
- LinkedIn network

Add to your resume/portfolio! 🎓

---

## 🆘 Need Help?

- **Render Docs:** https://render.com/docs
- **Render Discord:** https://discord.gg/render
- **GitHub Issues:** Create issue in your repo

---

**Happy Deploying! 🚀**
