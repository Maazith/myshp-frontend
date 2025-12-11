# 🔗 How to Link Database in Render - Visual Guide

**Problem:** No "Database" section in service sidebar

**Solution:** Databases are linked through the main Databases section, not the service sidebar.

---

## 📍 WHERE TO FIND DATABASE LINKING

### Option 1: Main Navigation (Easiest)

1. **At the top of Render Dashboard:**
   - Look for navigation tabs: "Services", "Databases", "Static Sites", etc.
   - Click **"Databases"**

2. **Find your database:**
   - Look for `myshp-db`
   - Click on it

3. **Link to service:**
   - In the database page, scroll down
   - Look for "Connected Services" or "Link Service" section
   - Click "Link Service" or "Connect Service"
   - Select: `myshp-backend`
   - Click "Link" or "Connect"

### Option 2: Service Settings

1. **Go to your service:**
   - Click `myshp-backend` service

2. **Go to "Settings" tab** (left sidebar)

3. **Look for "Database" section:**
   - Should show "Link Database" or "Connect Database"
   - Click it
   - Select `myshp-db`
   - Click "Link"

### Option 3: Environment Tab (Manual)

1. **Go to service → "Environment" tab**

2. **Get Database URL:**
   - Go to Databases → `myshp-db`
   - Copy "Internal Database URL"
   - Format: `postgresql://user:pass@host:5432/dbname`

3. **Add Environment Variable:**
   - In Environment tab, click "Add Environment Variable"
   - Key: `DATABASE_URL`
   - Value: Paste the URL you copied
   - Click "Save Changes"

---

## 🎯 STEP-BY-STEP (RECOMMENDED)

### Step 1: Verify Database Exists

1. **Render Dashboard → Click "Databases"** (top navigation)
2. **Look for `myshp-db`**
3. **Status should be "Available"**

**If database doesn't exist:**
- Click "New +" → "PostgreSQL"
- Name: `myshp-db`
- Plan: Free
- Database Name: `myshp`
- User: `myshp_user`
- Click "Create Database"
- Wait 2-3 minutes for provisioning

### Step 2: Link Database to Service

**Method A: From Database Page**
1. Click on `myshp-db` database
2. Scroll to "Connected Services" section
3. Click "Link Service" or "Connect Service"
4. Select `myshp-backend`
5. Click "Link"

**Method B: From Service Page**
1. Click on `myshp-backend` service
2. Go to "Settings" tab
3. Look for "Database" section
4. Click "Link Database"
5. Select `myshp-db`
6. Click "Link"

### Step 3: Verify Connection

1. **Go to service → "Environment" tab**
2. **Look for `DATABASE_URL`**
3. **Should show:** `postgresql://...` (click "Reveal" to see full URL)
4. **If missing:** Link database again or add manually

---

## 🔍 VISUAL LOCATIONS

### Where to Find Databases:

```
Render Dashboard
├── Top Navigation Bar
│   ├── Services
│   ├── Databases ← CLICK HERE
│   ├── Static Sites
│   └── ...
└── Main Content Area
    └── Your Databases List
        └── myshp-db ← CLICK THIS
```

### Where to Find Link Option:

```
Database Page (myshp-db)
├── Database Info
├── Connection Info
├── Connected Services ← LOOK HERE
│   └── [Link Service Button]
└── Settings
```

---

## ⚠️ COMMON ISSUES

### Issue 1: "No Databases Section"

**Solution:**
- Databases are in the **top navigation**, not the service sidebar
- Look for "Databases" tab at the top of the page
- If you don't see it, you might need to create a database first

### Issue 2: "Database Not Found"

**Solution:**
- Create database first:
  - Click "New +" → "PostgreSQL"
  - Name: `myshp-db`
  - Plan: Free
  - Create

### Issue 3: "Link Service Button Not Visible"

**Solution:**
- Try from service page instead:
  - Service → Settings → Database section
  - OR Service → Environment → Add `DATABASE_URL` manually

### Issue 4: "DATABASE_URL Not Set After Linking"

**Solution:**
- Wait 1-2 minutes (Render needs time to sync)
- Refresh the page
- Check Environment tab again
- If still missing, add manually (see Option 3 above)

---

## ✅ VERIFICATION

**After linking, verify:**

1. **Database Status:**
   - Databases → `myshp-db` → Status = "Available"

2. **Service Connection:**
   - Service → Environment → `DATABASE_URL` exists
   - OR Service → Settings → Database shows "Connected to myshp-db"

3. **Deployment:**
   - Service → Events → Latest deploy should succeed
   - Service → Logs → Should see "Migrations complete!"

---

## 🚀 AFTER LINKING

1. **Redeploy service:**
   - Service → Manual Deploy → Deploy latest commit
   - OR wait for auto-deploy

2. **Check logs:**
   - Service → Logs
   - Should see: "Migrations complete!"
   - Should see: "Created superuser: Edithcloths"

3. **Test:**
   - Open: `https://myshp-backend.onrender.com/api/products/`
   - Should return JSON

---

**Remember:** Databases are in the **top navigation**, not the service sidebar!




