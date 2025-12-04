# 🔍 Comprehensive Login Debugging Guide

## Step-by-Step Debugging

### Step 1: Verify Backend is Running

**Open a terminal and check:**

```bash
cd backend
python manage.py runserver
```

**Expected output:**
```
Starting development server at http://127.0.0.1:8000/
```

If you see errors, fix them first.

### Step 2: Verify Superuser Exists

**Create a new terminal window and run:**

```bash
cd backend
python manage.py shell
```

**Then in Python shell, run:**
```python
from django.contrib.auth.models import User
user = User.objects.filter(username='Maazith').first()
if user:
    print(f"✓ User exists: {user.username}")
    print(f"  Email: {user.email}")
    print(f"  Is staff: {user.is_staff}")
    print(f"  Is superuser: {user.is_superuser}")
    # Test password
    if user.check_password('maazith2005'):
        print("  ✓ Password is correct")
    else:
        print("  ✗ Password is WRONG")
else:
    print("✗ User 'Maazith' does not exist")
    print("Creating superuser...")
    User.objects.create_superuser('Maazith', 'maazith.md@gmail.com', 'maazith2005')
    print("✓ Superuser created!")
```

**Exit shell:** Type `exit()` and press Enter

### Step 3: Create Superuser Manually (If Needed)

```bash
cd backend
python manage.py createsuperuser
```

**Use these details:**
- Username: `Maazith`
- Email: `maazith.md@gmail.com`
- Password: `maazith2005`

### Step 4: Test API Endpoint Directly

**Open browser and go to:**
```
http://127.0.0.1:8000/api/auth/login
```

You should see a Django REST Framework page (not an error).

**Or use curl (in terminal):**
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"Maazith\",\"password\":\"maazith2005\"}"
```

**Expected response:** Should return tokens (access and refresh)

### Step 5: Check Browser Console

1. **Open Admin Login Page**: `http://127.0.0.1:5500/admin/login.html`
2. **Open Browser DevTools** (F12)
3. **Go to Console tab**
4. **Try to login**
5. **Look for errors** - take a screenshot or copy the error

**Common errors:**
- `Failed to fetch` = Backend not running or wrong URL
- `401 Unauthorized` = Wrong credentials
- `NetworkError` = Backend not accessible

### Step 6: Check Network Tab

1. **Open Browser DevTools** (F12)
2. **Go to Network tab**
3. **Clear network log** (right-click → Clear)
4. **Try to login**
5. **Find the `/auth/login` request**
6. **Click on it and check:**
   - **Request URL**: Should be `http://127.0.0.1:8000/api/auth/login`
   - **Request Method**: Should be `POST`
   - **Status Code**: 
     - `200` = Success (check response)
     - `401` = Wrong credentials
     - `404` = Wrong endpoint
     - `500` = Server error
   - **Request Payload**: Should have username and password
   - **Response**: Check what it returns

### Step 7: Verify API Base URL

**Check file**: `frontend/assets/js/api.js`

**Line 1 should be:**
```javascript
const API_BASE = 'http://127.0.0.1:8000/api';
```

If different, update it.

### Step 8: Clear Browser Cache

1. **Open DevTools** (F12)
2. **Right-click refresh button** → **Empty Cache and Hard Reload**
3. **Or clear localStorage:**
   - Go to **Application tab** → **Local Storage**
   - Delete all entries
   - Refresh page

## Quick Fix Checklist

- [ ] Backend server running on port 8000
- [ ] Superuser exists in database
- [ ] Password is correct
- [ ] API_BASE URL is correct in `api.js`
- [ ] No CORS errors in console
- [ ] Network request is being sent
- [ ] Browser cache cleared

## Common Issues & Solutions

### Issue: "Failed to connect to server"
**Solution**: Backend not running. Start it:
```bash
cd backend
python manage.py runserver
```

### Issue: "401 Unauthorized" or "No active account found"
**Solution**: Wrong username/password or user doesn't exist. Create superuser:
```bash
cd backend
python manage.py createsuperuser
```

### Issue: "NetworkError" or CORS error
**Solution**: Check CORS settings in `backend/edithclothes/settings.py`

### Issue: Page shows "Cannot GET"
**Solution**: Live Server root directory issue. Right-click `frontend` folder → "Open with Live Server"

## Next Steps

1. **Run Step 2** (check superuser exists) - This is most important!
2. **Check browser console** for specific error messages
3. **Share the error message** you see, and I'll help fix it

---

**Most Common Issue**: Superuser doesn't exist or password is wrong. Run Step 2 first!


