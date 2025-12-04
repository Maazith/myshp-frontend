# ⚡ Quick Login Fix - Step by Step

## 🔴 IMPORTANT: What error are you seeing?

Please tell me **exactly** what happens when you try to login:
1. Does the login page load? (Yes/No)
2. What error message appears? (copy/paste it)
3. Any errors in browser console? (Press F12 → Console tab)

---

## Step-by-Step Fix

### Step 1: Check Backend is Running ⚠️ CRITICAL

**Open a NEW terminal window** (keep it open):

```bash
cd C:\Users\maazi\OneDrive\Desktop\myshp\backend
python manage.py runserver
```

**Expected output:**
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

✅ **Keep this terminal open** - backend must be running!

---

### Step 2: Create/Verify Superuser

**Open ANOTHER terminal window** and run:

```bash
cd C:\Users\maazi\OneDrive\Desktop\myshp\backend
python check_login.py
```

**OR manually:**

```bash
cd C:\Users\maazi\OneDrive\Desktop\myshp\backend
python manage.py shell
```

Then in Python shell:
```python
from django.contrib.auth.models import User

# Check if user exists
user = User.objects.filter(username='Maazith').first()
if user:
    print("User exists!")
    user.set_password('maazith2005')
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print("Password reset!")
else:
    User.objects.create_superuser('Maazith', 'maazith.md@gmail.com', 'maazith2005')
    print("Superuser created!")

exit()
```

---

### Step 3: Check Browser Console

1. **Open Admin Login Page**: `http://127.0.0.1:5500/admin/login.html`
2. **Press F12** to open DevTools
3. **Go to Console tab**
4. **Try to login**
5. **Screenshot or copy the error** you see

---

### Step 4: Test API Directly

**In browser**, go to:
```
http://127.0.0.1:8000/api/auth/login
```

Should show Django REST Framework page (not error).

---

### Step 5: Check Network Request

1. **Open DevTools** (F12)
2. **Network tab**
3. **Clear** (right-click → Clear)
4. **Try login**
5. **Find** `/auth/login` request
6. **Check**:
   - Status code
   - Response message
   - Request URL

---

## Quick Test Commands

### Option A: Run the script I created
```bash
cd C:\Users\maazi\OneDrive\Desktop\myshp\backend
python check_login.py
```

### Option B: Double-click the batch file
1. Double-click `CREATE_SUPERUSER.bat` in the project root
2. It will create/fix the superuser automatically

---

## Most Common Issues

### ❌ "Failed to connect to server"
**Cause**: Backend not running  
**Fix**: Run Step 1 (start backend server)

### ❌ "No active account found" or "401 Unauthorized"
**Cause**: Wrong username/password or user doesn't exist  
**Fix**: Run Step 2 (create/verify superuser)

### ❌ "Cannot GET /admin/login.html"
**Cause**: Live Server path issue  
**Fix**: Right-click `frontend` folder → "Open with Live Server"

---

## Next Steps

1. **Make sure backend is running** (Step 1) - MOST IMPORTANT!
2. **Run the superuser check script** (Step 2)
3. **Try login again**
4. **Tell me what error you see** - then I can help fix it specifically!

---

**Need immediate help?** Please share:
- Screenshot of the error message
- Browser console errors (F12 → Console)
- Whether backend is running (yes/no)


