# Render Backend Troubleshooting Guide

## 🔍 Current Issue

Frontend is correctly trying to connect to `https://myshp-backend.onrender.com/api` but getting connection errors.

---

## ✅ Step-by-Step Troubleshooting

### Step 1: Verify Backend is Deployed on Render

1. **Go to Render Dashboard:**
   - Visit: https://dashboard.render.com
   - Log in with your account

2. **Check Service Status:**
   - Look for service named: `myshp-backend`
   - Check status:
     - ✅ **"Live"** = Service is running (good!)
     - ⚠️ **"Sleeping"** = Service is sleeping (free tier - needs wake up)
     - ❌ **"Stopped"** = Service is stopped (needs restart)
     - 🔴 **"Build Failed"** = Deployment failed (needs fix)

3. **If Service Doesn't Exist:**
   - You need to deploy the backend
   - See "Deploy Backend" section below

---

### Step 2: Wake Up Service (If Sleeping)

**Free Tier Services Sleep After Inactivity:**

1. **Manual Wake Up:**
   - Go to Render Dashboard → `myshp-backend` service
   - Click **"Manual Deploy"** → **"Deploy latest commit"**
   - Wait 1-2 minutes for service to wake up

2. **Automatic Wake Up:**
   - First request after sleep takes 30-60 seconds
   - Service wakes up automatically
   - Subsequent requests are faster

3. **Keep Service Awake (Optional):**
   - Use a service like UptimeRobot
   - Ping your backend every 10-14 minutes
   - Prevents sleeping

---

### Step 3: Verify Backend is Accessible

**Test Backend Directly:**

1. **Open Browser:**
   - Go to: `https://myshp-backend.onrender.com/api/`
   - Should see JSON response like:
     ```json
     {
       "message": "EdithCloths API",
       "version": "1.0"
     }
     ```

2. **Test Products Endpoint:**
   - Go to: `https://myshp-backend.onrender.com/api/products/`
   - Should see products list (or empty array `[]`)

3. **If You Get Errors:**
   - **404 Not Found** → Backend not deployed or wrong URL
   - **502 Bad Gateway** → Service is sleeping or crashed
   - **503 Service Unavailable** → Service is starting up
   - **CORS Error** → CORS configuration issue (unlikely)

---

### Step 4: Check Service Name

**Verify Service Name Matches:**

1. **In Render Dashboard:**
   - Service name should be: `myshp-backend`
   - URL will be: `https://myshp-backend.onrender.com`

2. **If Different Name:**
   - Update frontend API URL to match your service name
   - Or rename service in Render to `myshp-backend`

---

### Step 5: Check Backend Logs

**View Logs in Render:**

1. **Go to Service:**
   - Render Dashboard → `myshp-backend` → **"Logs"** tab

2. **Look for Errors:**
   - Database connection errors
   - Import errors
   - Configuration errors
   - Port binding errors

3. **Common Issues:**
   - Missing environment variables
   - Database not connected
   - Build failures

---

## 🚀 Deploy Backend (If Not Deployed)

### Option 1: Deploy from GitHub (Recommended)

1. **Connect Repository:**
   - Render Dashboard → **"New +"** → **"Blueprint"**
   - Select GitHub repository: `Maazith/myshp-backend`
   - Render will detect `render.yaml`

2. **Configure Service:**
   - Service name: `myshp-backend`
   - Environment: `Python 3`
   - Build command: `bash build.sh`
   - Start command: `bash start.sh`

3. **Set Environment Variables:**
   - `DEBUG=False`
   - `SECRET_KEY` (auto-generated)
   - `DATABASE_URL` (from PostgreSQL service)
   - `DJANGO_SUPERUSER_USERNAME` (your admin username)
   - `DJANGO_SUPERUSER_EMAIL` (your admin email)
   - `DJANGO_SUPERUSER_PASSWORD` (your admin password)

4. **Deploy:**
   - Click **"Apply"**
   - Wait 10-15 minutes for deployment
   - Check logs for success

---

### Option 2: Manual Deploy

1. **Create Web Service:**
   - Render Dashboard → **"New +"** → **"Web Service"**
   - Connect GitHub repository

2. **Configure:**
   - **Name:** `myshp-backend`
   - **Environment:** `Python 3`
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** `backend/backend/backend`
   - **Build Command:** `bash build.sh`
   - **Start Command:** `bash start.sh`

3. **Add PostgreSQL Database:**
   - Render Dashboard → **"New +"** → **"PostgreSQL"**
   - Name: `myshp-db`
   - Plan: Free (or paid)

4. **Set Environment Variables:**
   - `DEBUG=False`
   - `SECRET_KEY` (generate strong key)
   - `DATABASE_URL` (from PostgreSQL service)
   - `ALLOWED_HOSTS=myshp-backend.onrender.com,edithcloths.com,www.edithcloths.com`
   - `CORS_ALLOWED_ORIGINS=https://edithcloths.com,https://www.edithcloths.com,https://myshp-frontend.vercel.app`

5. **Deploy:**
   - Click **"Create Web Service"**
   - Wait for deployment

---

## 🔧 Quick Fixes

### Fix 1: Service Name Mismatch

**If your service has different name:**

Update frontend API URL:
```javascript
// In frontend/assets/js/api.js
const RENDER_BACKEND = 'https://YOUR-SERVICE-NAME.onrender.com/api';
```

### Fix 2: CORS Issues

**If you see CORS errors:**

Add your frontend domain to backend CORS:
```python
# In backend/backend/backend/edithclothes/settings.py
CORS_ALLOWED_ORIGINS = [
    'https://edithcloths.com',
    'https://www.edithcloths.com',
    'https://YOUR-FRONTEND-DOMAIN.vercel.app',
    'https://.vercel.app',  # All Vercel subdomains
]
```

### Fix 3: Database Connection

**If database errors:**

1. Check PostgreSQL service is running
2. Verify `DATABASE_URL` environment variable
3. Run migrations: `python manage.py migrate`

---

## 📋 Checklist

- [ ] Backend service exists in Render Dashboard
- [ ] Service status is "Live" (not sleeping/stopped)
- [ ] Service name is `myshp-backend`
- [ ] Backend URL accessible: `https://myshp-backend.onrender.com/api/`
- [ ] Products endpoint works: `https://myshp-backend.onrender.com/api/products/`
- [ ] No errors in Render logs
- [ ] Environment variables set correctly
- [ ] Database connected and migrated

---

## 🆘 Still Not Working?

### Test Backend Manually:

```bash
# Test API root
curl https://myshp-backend.onrender.com/api/

# Test products
curl https://myshp-backend.onrender.com/api/products/

# Check response headers
curl -I https://myshp-backend.onrender.com/api/
```

### Check Browser Console:

1. Open DevTools (F12)
2. Go to **Network** tab
3. Refresh products page
4. Look for failed requests
5. Check error details

### Common Error Messages:

- **"Failed to fetch"** → Backend not accessible (sleeping/down)
- **"CORS error"** → CORS configuration issue
- **"404 Not Found"** → Wrong URL or endpoint
- **"502 Bad Gateway"** → Service crashed or sleeping

---

## ✅ Success Indicators

When backend is working correctly:

1. ✅ `https://myshp-backend.onrender.com/api/` returns JSON
2. ✅ `https://myshp-backend.onrender.com/api/products/` returns products array
3. ✅ Frontend products page loads successfully
4. ✅ No errors in browser console
5. ✅ Render logs show successful requests

---

## 📞 Next Steps

1. **Check Render Dashboard** → Verify service status
2. **Test Backend URL** → Verify it's accessible
3. **Check Logs** → Look for errors
4. **Wake Service** → If sleeping, wake it up
5. **Test Frontend** → Refresh products page

---

**Status:** ⚠️ Backend connection issue - needs verification
**Action Required:** Check Render Dashboard and verify backend is deployed and running

