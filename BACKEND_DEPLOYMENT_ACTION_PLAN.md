# Backend Deployment Action Plan

## 🔴 Current Status
**All connection tests are failing** - The backend at `https://myshp-backend.onrender.com/api` is not accessible.

## 🎯 What This Means

The backend service is either:
1. ❌ **Not deployed yet** on Render
2. ❌ **Has a different name/URL** than expected
3. ❌ **Sleeping** (free tier services sleep after 15 minutes)
4. ❌ **Failed to deploy** or crashed

## ✅ Action Steps

### Step 1: Check Render Dashboard (5 minutes)

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Log in with your account

2. **Look for Backend Service**
   - Check if you have a service named `myshp-backend`
   - Check if you have a service with a different name (like `edithcloths-backend`)

3. **Note the Service Status**
   - ✅ **Live** = Service is running
   - ⏸️ **Suspended** = Service is sleeping (free tier)
   - ❌ **Build Failed** = Deployment failed
   - ⏳ **In Progress** = Currently deploying
   - ❌ **Not Found** = Service doesn't exist

### Step 2A: If Service EXISTS but Has Different Name

**If you found a service with a different name (e.g., `edithcloths-backend`):**

1. **Get the actual service URL**
   - Click on the service in Render Dashboard
   - Copy the URL (it will be like `https://edithcloths-backend.onrender.com`)

2. **Update Frontend Configuration**
   
   Edit `frontend/assets/js/api.js` line 18:
   ```javascript
   return 'https://your-actual-service-name.onrender.com/api';
   ```
   
   Or update the test page URL in `frontend/test-connection.html` and test again.

3. **Redeploy or restart the service** if needed

### Step 2B: If Service EXISTS but is SUSPENDED (Sleeping)

**For free tier services that sleep:**

1. **Wake up the service**
   - Go to Render Dashboard → Your Service
   - Click "Manual Deploy" → "Deploy latest commit"
   - Wait 1-2 minutes for it to wake up

2. **Test the connection again**
   - Use the test page: `frontend/test-connection.html`
   - First request may take 30-60 seconds (waking up)

3. **Consider upgrading** to Starter plan ($7/month) to avoid sleeping

### Step 2C: If Service EXISTS but BUILD FAILED

**If deployment failed:**

1. **Check the logs**
   - Go to Render Dashboard → Your Service → **Logs**
   - Look for error messages

2. **Common issues:**
   - Missing environment variables
   - Database connection errors
   - Build script errors
   - Missing dependencies

3. **Fix the issue and redeploy**

### Step 2D: If Service DOES NOT EXIST (Need to Deploy)

**If you don't see the backend service at all:**

You need to deploy it. Choose one method:

#### Option 1: Deploy Using render.yaml (Recommended)

1. **Push code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Add backend configuration for Render"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to Render Dashboard: https://dashboard.render.com
   - Click "New +" → Select "Blueprint"
   - Connect your GitHub account (if not connected)
   - Select your repository: `myshp` (or whatever your repo is named)
   - Render should auto-detect `backend/render.yaml`
   - Click "Apply"
   - Render will create:
     - Web service: `myshp-backend`
     - Database: `myshp-db`

3. **Configure Environment Variables**
   - Go to the service → Environment
   - Set these manually (they're marked as `sync: false`):
     - `EMAIL_HOST_PASSWORD` (if you're using email)
     - `DJANGO_SUPERUSER_USERNAME` (e.g., `admin`)
     - `DJANGO_SUPERUSER_EMAIL` (your email)
     - `DJANGO_SUPERUSER_PASSWORD` (strong password)

4. **Wait for deployment** (5-10 minutes)

5. **Test the connection**
   - After deployment, use: `frontend/test-connection.html`
   - Test URL: `https://myshp-backend.onrender.com/api/`

#### Option 2: Manual Deployment (Alternative)

If Blueprint doesn't work, create service manually:

1. **Create Web Service**
   - Render Dashboard → "New +" → "Web Service"
   - Connect GitHub repo
   - Select repository and branch
   - Settings:
     - **Name**: `myshp-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Python 3`
     - **Build Command**: `bash build.sh`
     - **Start Command**: `bash start.sh`
     - **Plan**: Starter ($7/month) or Free

2. **Create Database**
   - Render Dashboard → "New +" → "PostgreSQL"
   - Name: `myshp-db`
   - Plan: Free

3. **Link Database to Service**
   - Go to web service → Settings → Environment
   - Add environment variable:
     - Key: `DATABASE_URL`
     - Value: Copy from database connection string

4. **Add Other Environment Variables**
   - `DEBUG`: `False`
   - `SECRET_KEY`: Generate a new one
   - `DJANGO_SUPERUSER_USERNAME`: Your admin username
   - `DJANGO_SUPERUSER_EMAIL`: Your email
   - `DJANGO_SUPERUSER_PASSWORD`: Strong password

5. **Deploy and wait**

## 🚀 Quick Fix: Use Local Backend for Testing

**While waiting for deployment, you can test locally:**

### 1. Start Local Backend

```bash
cd backend
python manage.py runserver
```

Backend will run at: `http://127.0.0.1:8000`

### 2. Configure Frontend for Local Backend

**Option A: Update test-connection.html**
- Open `frontend/test-connection.html`
- Change the URL input to: `http://127.0.0.1:8000/api`
- Click "Update URL" and test

**Option B: Update api.js temporarily**
- Edit `frontend/assets/js/api.js` line 18:
  ```javascript
  return 'http://127.0.0.1:8000/api';
  ```

### 3. Update CORS Settings (if needed)

Make sure `backend/edithclothes/settings.py` allows localhost:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8001",
    "http://127.0.0.1:8001",
    # ... other origins
]
```

### 4. Serve Frontend Locally

```bash
cd frontend
python -m http.server 8001
```

Open: `http://127.0.0.1:8001`

## ✅ Verification Checklist

After deployment, verify:

- [ ] Service shows "Live" status on Render
- [ ] Can access: `https://myshp-backend.onrender.com/api/`
- [ ] Test page shows all endpoints as ✅ SUCCESS
- [ ] Frontend can connect to backend
- [ ] Admin panel can load products/categories

## 🆘 Still Having Issues?

1. **Check Render Logs**
   - Render Dashboard → Service → Logs
   - Look for error messages

2. **Test Backend URL Directly**
   - Open: `https://myshp-backend.onrender.com/api/` in browser
   - Should show JSON response

3. **Verify Service Name**
   - Make sure service name matches exactly
   - Render URLs are case-sensitive

4. **Check Database Connection**
   - Service needs database to start
   - Verify DATABASE_URL is set correctly

5. **Review Build/Start Scripts**
   - Check `backend/build.sh`
   - Check `backend/start.sh`
   - Make sure they're executable

## 📝 Next Steps Summary

1. ✅ **Check Render Dashboard** - Find your backend service
2. ✅ **Identify the issue** - Not deployed? Wrong name? Sleeping?
3. ✅ **Fix the issue** - Deploy, rename, or wake up service
4. ✅ **Test connection** - Use test page to verify
5. ✅ **Update frontend** - If URL changed, update api.js

---

**Remember:** Free tier services sleep after 15 minutes of inactivity. First request may take 30-60 seconds to wake up!

