# 🔗 Frontend-Backend Connection Verification

## ✅ Current Configuration

### Frontend (Vercel)
- **URL**: `https://myshp-frontend.vercel.app`
- **API Base**: `https://myshp-backend.onrender.com/api`
- **Config File**: `frontend/assets/js/api.js`

### Backend (Render)
- **URL**: `https://myshp-backend.onrender.com`
- **API Endpoint**: `https://myshp-backend.onrender.com/api`
- **CORS**: Enabled for Vercel frontend
- **Config File**: `backend/edithclothes/settings.py`

---

## 🔍 Verification Steps

### Step 1: Check Backend is Running
Visit: `https://myshp-backend.onrender.com/api/`

**Expected Response:**
```json
{
  "message": "EdithCloths API",
  "version": "1.0",
  "endpoints": {...},
  "status": "online"
}
```

### Step 2: Check Frontend API Configuration
Open browser console on frontend and check:
```javascript
// Should show: "https://myshp-backend.onrender.com/api"
console.log(API_BASE);
```

### Step 3: Test API Connection
Open browser console on frontend and run:
```javascript
fetch('https://myshp-backend.onrender.com/api/products/')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

**Expected**: Should return products array or empty array `[]`

---

## 🛠️ Troubleshooting

### Issue: CORS Error
**Symptoms**: `Access-Control-Allow-Origin` error in console

**Fix**: 
1. Check `backend/edithclothes/settings.py`:
   - `CORS_ALLOW_ALL_ORIGINS = True` (should be True)
   - `CORS_ALLOWED_ORIGINS` includes Vercel URL
   - `CSRF_TRUSTED_ORIGINS` includes Vercel URL

2. Redeploy backend after changes

### Issue: 404 Not Found
**Symptoms**: API calls return 404

**Fix**:
1. Verify backend URL is correct: `https://myshp-backend.onrender.com/api`
2. Check API endpoint exists: `/api/products/`, `/api/auth/login`, etc.
3. Verify backend is deployed and running

### Issue: 401 Unauthorized
**Symptoms**: Login works but other requests fail

**Fix**:
1. Check token is stored: `localStorage.getItem('edithcloths_token')`
2. Verify token format: Should start with `eyJ...`
3. Check token expiration (tokens expire after 60 minutes)

### Issue: Network Error
**Symptoms**: `Failed to fetch` or `Network request failed`

**Fix**:
1. Check backend is running: Visit `https://myshp-backend.onrender.com/api/`
2. Check internet connection
3. Verify no firewall blocking requests
4. Check Render deployment status

---

## 📝 Quick Fixes

### Update API URL in Frontend
Edit `frontend/assets/js/api.js`:
```javascript
const API_BASE = 'https://myshp-backend.onrender.com/api';
```

### Update CORS in Backend
Edit `backend/edithclothes/settings.py`:
```python
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = [
    'https://myshp-frontend.vercel.app',
    # ... other origins
]
CSRF_TRUSTED_ORIGINS = [
    'https://myshp-frontend.vercel.app',
    # ... other origins
]
```

### Verify Connection
1. Open frontend: `https://myshp-frontend.vercel.app`
2. Open browser console (F12)
3. Check Network tab for API calls
4. Verify requests go to: `https://myshp-backend.onrender.com/api/...`

---

## ✅ Checklist

- [ ] Backend is deployed and running
- [ ] Frontend is deployed and running
- [ ] API_BASE URL is correct in `frontend/assets/js/api.js`
- [ ] CORS settings include Vercel URL in backend
- [ ] CSRF_TRUSTED_ORIGINS includes Vercel URL
- [ ] ALLOWED_HOSTS includes Render domain
- [ ] Test API connection works
- [ ] Login functionality works
- [ ] Products load correctly
- [ ] Images load correctly

---

## 🔄 After Making Changes

1. **Backend Changes**: 
   - Commit and push to GitHub
   - Render will auto-deploy
   - Wait 2-5 minutes for deployment

2. **Frontend Changes**:
   - Commit and push to GitHub
   - Vercel will auto-deploy
   - Wait 1-2 minutes for deployment

3. **Clear Browser Cache**:
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or clear cache in browser settings

---

**Need Help?** Check browser console and Render/Vercel logs for detailed error messages.

