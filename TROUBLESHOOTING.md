# Troubleshooting: "Failed to Fetch" Error

## 🔍 Quick Diagnosis

If you're getting "Failed to fetch" when trying to register, follow these steps:

### Step 1: Check if Backend is Running

Open a terminal and check:

```powershell
netstat -ano | findstr :8000
```

If nothing shows up, the backend is NOT running. Start it:

```powershell
cd backend
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

### Step 2: Test API Connection

1. Open: `frontend/test-api.html` in your browser
2. Click "Test Connection" button
3. Check the results

### Step 3: Check Browser Console

1. Press `F12` to open Developer Tools
2. Go to "Console" tab
3. Try registering again
4. Look for detailed error messages

### Step 4: Verify Ports

**Backend should be on:** `http://127.0.0.1:8000`
**Frontend should be on:** `http://127.0.0.1:8080` (or whatever port you're using)

### Step 5: Check API URL Configuration

Open `frontend/assets/js/api.js` and verify:

```javascript
const API_BASE = 'http://127.0.0.1:8000/api';
```

This should match where your backend is running.

## 🛠️ Common Issues & Solutions

### Issue 1: Backend Not Running

**Symptoms:**
- "Failed to fetch" error
- Connection refused error

**Solution:**
```powershell
cd backend
python manage.py runserver
```

Keep this terminal window open while using the site.

### Issue 2: Wrong API URL

**Symptoms:**
- Network error in browser console
- 404 errors

**Solution:**
- Check `frontend/assets/js/api.js`
- Verify `API_BASE` matches your backend URL
- If backend is on different port, update it

### Issue 3: CORS Error

**Symptoms:**
- "CORS policy" error in console
- "Access-Control-Allow-Origin" error

**Solution:**
Backend CORS is already configured. Make sure:
1. Backend is running
2. Settings.py has `CORS_ALLOW_ALL_ORIGINS = True`

### Issue 4: Frontend Running from File://

**Symptoms:**
- CORS errors
- "Failed to fetch" with file:// protocol

**Solution:**
Don't open HTML files directly. Use a web server:

```powershell
cd frontend
python -m http.server 8080
```

Then open: `http://127.0.0.1:8080`

### Issue 5: Port Already in Use

**Symptoms:**
- "Address already in use" error
- Server won't start

**Solution:**
```powershell
# Find what's using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use a different port
python manage.py runserver 8001
```

Then update `API_BASE` in `frontend/assets/js/api.js` to use port 8001.

## ✅ Step-by-Step Setup Checklist

- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Migrations run (`python manage.py migrate`)
- [ ] Backend server running (`python manage.py runserver`)
- [ ] Frontend server running (`python -m http.server 8080` in frontend folder)
- [ ] Backend accessible at `http://127.0.0.1:8000`
- [ ] Frontend accessible at `http://127.0.0.1:8080`
- [ ] API test page works (`frontend/test-api.html`)

## 🔧 Manual Test

Test the API directly in browser:

1. Open: `http://127.0.0.1:8000/api/settings/`
   - Should return JSON data
   - If you see an error, backend isn't running properly

2. Test registration endpoint with curl (if you have it):
```bash
curl -X POST http://127.0.0.1:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"test\",\"email\":\"test@test.com\",\"password\":\"test123\"}"
```

## 📞 Still Having Issues?

1. Check backend terminal for error messages
2. Check browser console (F12) for detailed errors
3. Verify both servers are running
4. Try the test page: `frontend/test-api.html`
5. Make sure you're using HTTP server, not opening files directly

---

**Most Common Issue:** Backend server is not running. Always start it first!

