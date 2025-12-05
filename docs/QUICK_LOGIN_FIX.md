# ⚡ Quick Fix: Cannot GET /admin/login.html

## The Issue
Live Server can't find the file because it's running from the wrong root directory.

## ✅ Quick Solutions

### Solution 1: Right-Click on `frontend` Folder (EASIEST)
1. In VS Code Explorer, **right-click** on the `frontend` folder
2. Select **"Open with Live Server"**
3. This will set `frontend` as the root directory
4. Now access: `http://127.0.0.1:5500/admin/login.html`

### Solution 2: Use Full Path
If Live Server is running from project root, use:
- **URL**: `http://127.0.0.1:5500/frontend/admin/login.html`

### Solution 3: Start from Landing Page
1. Go to: `http://127.0.0.1:5500/index.html` (or `/frontend/index.html`)
2. Click the **"Admin Login"** card
3. It will navigate to the correct admin login page

## ✅ Correct Setup

**Live Server Root**: Should be the `frontend` folder

**File Structure**:
```
myshp/
  └── frontend/          ← Live Server root here
      ├── index.html
      ├── admin/
      │   └── login.html  ← Access as /admin/login.html
      └── assets/
```

## 🎯 Admin Login Credentials

Once you can access the login page:
- **Username**: `Maazith`
- **Password**: `maazith2005`

## 🔍 Verify It's Working

1. Open: `http://127.0.0.1:5500/index.html`
2. Click "Admin Login" button
3. Should navigate to admin login page
4. Enter credentials and login

---

**Most likely fix**: Right-click `frontend` folder → "Open with Live Server" ✅



