# ✅ Login Error Checklist

## Before You Try Login, Check These:

### 1. ✅ Backend Server Running?
- [ ] Open terminal
- [ ] Run: `cd backend && python manage.py runserver`
- [ ] See: "Starting development server at http://127.0.0.1:8000/"
- [ ] **Keep terminal open!**

### 2. ✅ Superuser Exists?
Run this command:
```bash
cd backend
python check_login.py
```
Or double-click: `CREATE_SUPERUSER.bat`

### 3. ✅ Admin Login Page Loads?
- [ ] Go to: `http://127.0.0.1:5500/admin/login.html`
- [ ] Page shows login form (not error)
- [ ] If error, right-click `frontend` folder → "Open with Live Server"

### 4. ✅ Browser Console Clear?
- [ ] Press F12
- [ ] Go to Console tab
- [ ] Clear console (right-click → Clear console)
- [ ] Try login
- [ ] Check for errors

### 5. ✅ Credentials Correct?
- Username: `Maazith` (exact, case-sensitive)
- Password: `maazith2005`

---

## When You Try to Login, Note:

1. **What error appears on the page?**
   - Copy/paste the exact error message

2. **What's in browser console?** (F12 → Console)
   - Any red error messages?

3. **What's in Network tab?** (F12 → Network)
   - Find `/auth/login` request
   - Status code?
   - Response message?

4. **Does backend terminal show any errors?**
   - Check the terminal running `python manage.py runserver`

---

## Quick Fix Commands

### Create/Fix Superuser:
```bash
cd C:\Users\maazi\OneDrive\Desktop\myshp\backend
python check_login.py
```

### Start Backend:
```bash
cd C:\Users\maazi\OneDrive\Desktop\myshp\backend
python manage.py runserver
```

---

**Most Important**: Make sure backend is running! ⚠️


