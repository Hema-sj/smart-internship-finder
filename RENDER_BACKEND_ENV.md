# 🔧 Render Backend Environment Variables

## Your Backend URL
```
https://smart-internship-finder-qo8q.onrender.com
```

## Required Environment Variables

Go to: **Render Dashboard → smart-internship-finder-qo8q → Environment**

Add these variables:

### 1. DATABASE_URL (Already set) ✅
```
postgresql://neondb_owner:npg_roLIJ2wgVAz8@ep-dry-frog-a5ks8ibg-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 2. JWT_SECRET
Generate a new secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Then add it as environment variable.

### 3. CLIENT_URL (IMPORTANT!)
After deploying frontend, update this:
```
https://your-frontend-name.onrender.com
```

### 4. AI_SERVICE_URL (If AI service deployed)
```
https://your-ai-service.onrender.com
```
Or leave as: `http://localhost:8000` for now

### 5. NODE_ENV
```
production
```

### 6. PORT
```
10000
```
(Render uses port 10000 internally)

---

## After Adding Variables

1. Click **"Save Changes"**
2. Render will automatically redeploy
3. Wait ~2 minutes for deployment

---

## Test Backend

Open in browser:
```
https://smart-internship-finder-qo8q.onrender.com/api/health
```

Should return:
```json
{
  "status": "ok",
  "service": "smart-internship-finder-api",
  "message": "Backend API is healthy"
}
```

---

## Next Steps

1. ✅ Backend deployed
2. ⏳ Deploy frontend (follow instructions below)
3. ⏳ Update CLIENT_URL with frontend URL
4. ⏳ Deploy AI service (optional)

---

## Deploy Frontend Now

Follow the instructions in the terminal output above! 👆
