# 🚀 Vercel Deployment Guide - Smart Internship Finder

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account** - Push your code to GitHub
3. **Neon Database** - Already set up ✅
4. **AI Service Deployed** - Deploy to Render/Railway first

---

## 🎯 Step 1: Prepare Backend for Vercel

### Create `vercel.json` in backend folder:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Update `package.json` (backend):

Ensure you have:
```json
{
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

---

## 🎯 Step 2: Environment Variables for Vercel

Go to your Vercel project → Settings → Environment Variables

Add these variables:

### **Database (Required)**
```
DATABASE_URL=postgresql://neondb_owner:npg_roLIJ2wgVAz8@ep-dry-frog-a5ks8ibg-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### **Security (Required)**
```
JWT_SECRET=<generate-secure-random-string>
NODE_ENV=production
PORT=5000
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### **URLs (Required)**
```
CLIENT_URL=https://your-frontend.vercel.app
AI_SERVICE_URL=https://your-ai-service.onrender.com
```

### **CORS (Required)**
```
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### **Optional**
```
ADMIN_EMAIL=admin@smartintern.com
ADMIN_PASSWORD=Admin@2024
MAX_FILE_SIZE=5242880
UPLOAD_DIR=/tmp/uploads
```

---

## 🎯 Step 3: Deploy Backend to Vercel

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to backend folder
cd backend

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option B: Using Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Set **Root Directory** to `backend`
4. Click **Deploy**

---

## 🎯 Step 4: Deploy Frontend to Vercel

### Update Frontend `.env`:

Create `frontend/.env.production`:
```
VITE_API_URL=https://your-backend.vercel.app/api
```

### Create `vercel.json` in frontend folder:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Deploy Frontend:

```bash
cd frontend
vercel --prod
```

Or use Vercel Dashboard:
1. Import repository
2. Set Root Directory to `frontend`
3. Framework Preset: Vite
4. Add Environment Variable: `VITE_API_URL`
5. Deploy

---

## 🎯 Step 5: Deploy AI Service (Render)

Since Vercel doesn't support Python well, deploy AI service to Render:

### Create `render.yaml` in ai-service folder:

```yaml
services:
  - type: web
    name: smart-internship-ai
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.11
```

### Deploy to Render:

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Root Directory: `ai-service`
5. Build Command: `pip install -r requirements.txt`
6. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. Deploy

---

## 🎯 Step 6: Update Environment Variables

After deploying all services:

1. **Backend Vercel**: Update `CLIENT_URL` with frontend URL
2. **Backend Vercel**: Update `AI_SERVICE_URL` with Render URL
3. **Frontend Vercel**: Update `VITE_API_URL` with backend URL
4. Redeploy if needed

---

## ✅ Final Checklist

- [ ] Neon Database accessible
- [ ] Backend deployed to Vercel
- [ ] Frontend deployed to Vercel
- [ ] AI Service deployed to Render
- [ ] All environment variables set
- [ ] CORS configured correctly
- [ ] Test login functionality
- [ ] Test resume upload
- [ ] Test internship browsing

---

## 🔒 Security Best Practices

### 1. Secure JWT Secret
```bash
# Generate strong secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Environment Variables
- Never commit `.env` files
- Use Vercel's encrypted environment variables
- Different secrets for dev/staging/production

### 3. CORS Configuration
```javascript
// In server.js
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

### 4. Rate Limiting
Already configured in your backend with:
- 100 requests per 15 minutes per IP
- Prevents brute force attacks

### 5. Database Security
- Use connection pooling (already configured)
- Never expose database credentials in frontend
- Use parameterized queries (Sequelize does this)

---

## 🐛 Troubleshooting

### Backend Error: "Cannot connect to database"
- Check DATABASE_URL is correct
- Verify Neon database is active
- Check SSL mode is set to `require`

### Frontend Error: "Network Error"
- Check VITE_API_URL is correct
- Verify CORS is configured with frontend URL
- Check backend is deployed and running

### AI Service Error: "Service Unavailable"
- Check AI_SERVICE_URL in backend env
- Verify Render service is running
- Check AI service logs on Render dashboard

### File Upload Error
- Vercel has 5MB limit for serverless functions
- Consider using Cloudinary/S3 for large files
- Check UPLOAD_DIR is set to `/tmp`

---

## 📊 Monitoring & Logs

### Vercel Dashboard
- View deployment logs
- Monitor function execution
- Check error rates

### Render Dashboard
- View AI service logs
- Monitor resource usage
- Check uptime

### Neon Dashboard
- Monitor database queries
- Check connection pool
- View query performance

---

## 🔄 Continuous Deployment

### Auto-deploy on Git Push:

1. Connect GitHub repo to Vercel
2. Enable auto-deploy on main branch
3. Push to GitHub
4. Vercel automatically deploys

```bash
git add .
git commit -m "Update feature"
git push origin main
# Vercel deploys automatically!
```

---

## 💰 Cost Estimation

### Vercel (Free Tier)
- 100 GB bandwidth/month
- Unlimited deployments
- Free SSL certificates
- **Cost: $0/month**

### Render (Free Tier)
- 750 hours/month
- Auto-sleep after 15min inactivity
- **Cost: $0/month**
- Upgrade to $7/month for always-on

### Neon (Free Tier)
- 0.5 GB storage
- Unlimited queries
- Auto-suspend after 5min inactivity
- **Cost: $0/month**
- Upgrade to $19/month for production

**Total Free Tier: $0/month** ✅

---

## 🎉 You're Done!

Your Smart Internship Finder is now deployed!

**URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.vercel.app`
- AI Service: `https://your-ai-service.onrender.com`

Share your app with the world! 🚀
