# Backend Connection Troubleshooting Guide

## Problem
The frontend is showing: **"Failed to connect to server. Make sure the backend is running at https://myshp-backend.onrender.com/api"**

## Quick Checks

### 1. Test Backend URL Directly
Open your browser and visit:
- **API Root**: `https://myshp-backend.onrender.com/api/`
- **Health Check**: `https://myshp-backend.onrender.com/api/products/`

**Expected Results:**
- ✅ **200 OK**: Backend is running - Check CORS and frontend configuration
- ❌ **404 Not Found**: Service name might be wrong or not deployed
- ❌ **Timeout/Connection Error**: Service is sleeping (free tier) or not deployed
- ❌ **502/503 Error**: Service is starting up or crashed

### 2. Check Render Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Look for a service named **`myshp-backend`**
3. Check the status:
   - ✅ **Live**: Service is running
   - ⏸️ **Suspended**: Service is sleeping (free tier) - Click "Manual Deploy" to wake it
   - ❌ **Build Failed**: Check logs for errors
   - ⏳ **In Progress**: Wait for deployment to complete

### 3. Verify Service Name

The `render.yaml` file specifies the service name. Check:
- **Expected**: `myshp-backend`
- **Actual Service Name on Render**: Check your Render dashboard

If the service name is different, you have two options:

**Option A: Rename the service on Render**
1. Go to Render Dashboard → Your Service → Settings
2. Change service name to `myshp-backend`

**Option B: Update frontend to use existing service name**
1. Find your actual backend URL in Render Dashboard
2. Update `frontend/assets/js/api.js` line 18:
   ```javascript
   return 'https://your-actual-service-name.onrender.com/api';
   ```

### 4. Free Tier Services Sleep

Render's free tier services **sleep after 15 minutes of inactivity**. 

**Symptoms:**
- First request times out or takes 30-60 seconds
- Subsequent requests work fine

**Solutions:**
- Wait 30-60 seconds for the service to wake up
- Use a service ping (like UptimeRobot) to keep it awake
- Upgrade to a paid plan ($7/month) to avoid sleeping

### 5. Check Backend Logs

1. Go to Render Dashboard → Your Service → **Logs**
2. Look for errors during startup
3. Common issues:
   - Missing environment variables
   - Database connection errors
   - Build errors

## Solutions by Scenario

### Scenario 1: Backend Not Deployed

**If you haven't deployed the backend yet:**

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add backend configuration"
   git push origin main
   ```

2. **Deploy on Render:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Select the `backend/render.yaml` file
   - Render will automatically create services

3. **Wait for deployment** (5-10 minutes)

### Scenario 2: Service Name Mismatch

**If your service has a different name:**

1. **Check your Render Dashboard** for the actual service name
2. **Update frontend configuration:**

   Edit `frontend/assets/js/api.js`:
   ```javascript
   // Line 18 - Replace with your actual backend URL
   return 'https://your-actual-service-name.onrender.com/api';
   ```

   Or set it dynamically in `frontend/index.html`:
   ```javascript
   window.API_BASE_URL = 'https://your-actual-service-name.onrender.com/api';
   ```

### Scenario 3: Service is Sleeping

**If using free tier and service is sleeping:**

1. **Wake it up manually:**
   - Go to Render Dashboard → Your Service
   - Click "Manual Deploy" → "Deploy latest commit"
   - Wait 1-2 minutes for it to wake up

2. **For development, use local backend:**
   - See "Local Development Setup" below

### Scenario 4: CORS Errors

**If backend responds but frontend shows CORS errors:**

Check `backend/edithclothes/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "https://myshp-frontend.vercel.app",
    "http://localhost:8001",
    "http://127.0.0.1:8001",
    # Add your frontend URL here
]
```

Then redeploy the backend.

## Local Development Setup

**If you want to test locally while backend is being deployed:**

### 1. Start Local Backend

```bash
cd backend
python manage.py runserver
```

Backend will run at: `http://127.0.0.1:8000`

### 2. Configure Frontend for Local Backend

**Option A: Set in `frontend/index.html`** (before loading scripts):
```html
<script>
  window.API_BASE_URL = 'http://127.0.0.1:8000/api';
</script>
```

**Option B: Update `frontend/assets/js/api.js`** temporarily:
```javascript
// Line 18 - Change to:
return 'http://127.0.0.1:8000/api';
```

### 3. Update CORS Settings (if needed)

In `backend/edithclothes/settings.py`, make sure localhost is allowed:
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

## Testing Connection

### Browser Console Test

Open browser console (F12) and run:

```javascript
fetch('https://myshp-backend.onrender.com/api/')
  .then(r => r.json())
  .then(data => console.log('✅ Backend is running:', data))
  .catch(err => console.error('❌ Backend connection failed:', err));
```

### Using curl (Terminal)

```bash
curl https://myshp-backend.onrender.com/api/
```

**Expected response:**
```json
{"message": "EdithCloths Backend API", ...}
```

## Next Steps

1. **Test the backend URL** directly in your browser
2. **Check Render Dashboard** for service status
3. **Verify service name** matches configuration
4. **Check backend logs** for errors
5. **Try local development** if backend isn't ready

## Still Having Issues?

1. **Check browser console** (F12) for detailed error messages
2. **Check Network tab** to see the exact request/response
3. **Verify your Render account** has the service created
4. **Check email** from Render for deployment notifications

## Quick Fix: Use Local Backend for Testing

For immediate testing, you can run the backend locally:

```bash
# Terminal 1: Start backend
cd backend
python manage.py runserver

# Terminal 2: Serve frontend (after updating API_BASE_URL)
cd frontend
python -m http.server 8001
```

Then access frontend at: `http://127.0.0.1:8001`

