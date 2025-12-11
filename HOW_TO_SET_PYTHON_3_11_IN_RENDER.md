# 📍 How to Set Python 3.11 in Render Settings - Step by Step

**Goal:** Force Render to use Python 3.11.9 instead of Python 3.13.4

---

## 🎯 METHOD 1: Through Service Settings (Most Common)

### Step 1: Go to Your Backend Service

1. **Open Render Dashboard:**
   - Go to: https://dashboard.render.com
   - Login to your account

2. **Click on your backend service:**
   - Find and click: **`myshp-backend`**

### Step 2: Open Settings Tab

1. **In the left sidebar:**
   - Look for **"Settings"** (under "MONITOR" or "MANAGE" section)
   - Click **"Settings"**

### Step 3: Find Python Version Setting

**Look for one of these sections:**

**Option A: "Python Version" Dropdown**
- You'll see a dropdown labeled **"Python Version"** or **"Python"**
- Current value might show: "3.13" or "Latest" or "Auto"
- **Change it to:** **"3.11"** or **"3.11.9"**
- Click **"Save Changes"**

**Option B: "Build Command" Field**
- You'll see a field labeled **"Build Command"**
- Current value: `bash build.sh` or similar
- **Change it to:**
  ```bash
  python3.11 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && bash build.sh
  ```
- Click **"Save Changes"**

**Option C: "Environment" Section**
- Scroll down to **"Environment"** section
- Look for **"PYTHON_VERSION"** environment variable
- If it exists, set value to: `3.11.9`
- If it doesn't exist, click **"Add Environment Variable"**
  - Key: `PYTHON_VERSION`
  - Value: `3.11.9`
- Click **"Save Changes"**

---

## 🎯 METHOD 2: Through Environment Variables

### Step 1: Go to Environment Tab

1. **Render Dashboard → `myshp-backend` service**
2. **Click "Environment" tab** (left sidebar)

### Step 2: Add PYTHON_VERSION Variable

1. **Click "Add Environment Variable"** button
2. **Fill in:**
   - **Key:** `PYTHON_VERSION`
   - **Value:** `3.11.9`
3. **Click "Save Changes"**

---

## 🎯 METHOD 3: Update render.yaml (If Using Blueprint)

**If you're deploying via `render.yaml`:**

1. **Edit `render.yaml` file:**
   ```yaml
   services:
     - type: web
       name: myshp-backend
       env: python
       plan: starter
       pythonVersion: "3.11.9"  # Add this line
       buildCommand: bash build.sh
       startCommand: bash start.sh
       # ... rest of config
   ```

2. **Commit and push to GitHub**
3. **Render will auto-deploy with Python 3.11**

---

## 🔍 WHERE TO LOOK - Visual Guide

### In Settings Tab:

```
Render Dashboard
└── myshp-backend Service
    └── Settings Tab
        ├── General Settings
        │   ├── Name: myshp-backend
        │   ├── Region: (dropdown)
        │   └── Python Version: [3.11 ▼] ← LOOK HERE
        │
        ├── Build & Deploy
        │   ├── Build Command: [bash build.sh]
        │   └── Start Command: [bash start.sh]
        │
        └── Environment Variables
            └── (list of variables)
```

### In Environment Tab:

```
Render Dashboard
└── myshp-backend Service
    └── Environment Tab
        ├── KEY                    VALUE
        ├── RENDER                 true
        ├── ENVIRONMENT             production
        ├── DEBUG                   False
        ├── DATABASE_URL            postgresql://...
        ├── PYTHON_VERSION          3.11.9 ← ADD THIS
        └── ...
```

---

## ⚠️ IF YOU CAN'T FIND PYTHON VERSION SETTING

**Render might be auto-detecting Python version. Try:**

### Option 1: Update Build Command

1. **Settings → Build Command**
2. **Change from:**
   ```bash
   bash build.sh
   ```
3. **Change to:**
   ```bash
   python3.11 -m venv .venv && source .venv/bin/activate && bash build.sh
   ```

### Option 2: Add to Environment Variables

1. **Environment tab → Add Environment Variable**
2. **Key:** `PYTHON_VERSION`
3. **Value:** `3.11.9`
4. **Save**

### Option 3: Contact Render Support

- If you can't find the setting, Render might need to set it manually
- Or check Render documentation for your plan type

---

## ✅ VERIFICATION

**After setting Python 3.11:**

1. **Save changes**
2. **Redeploy:**
   - Click "Manual Deploy" dropdown
   - Select "Deploy latest commit"
3. **Check Logs:**
   - Go to "Logs" tab
   - Look for: `Python version: 3.11.x` (not 3.13.x)
4. **Verify:**
   - Should see: "psycopg2-binary installed" (if we revert to psycopg2)
   - OR: "psycopg 3.1.18 installed" (if using psycopg3)

---

## 🔄 AFTER SETTING PYTHON 3.11

**Once Python 3.11 is set, we can revert to psycopg2-binary:**

1. **Update `requirements.txt`:**
   ```txt
   psycopg2-binary==2.9.9  # Works perfectly with Python 3.11
   ```

2. **Update `build.sh`** to verify psycopg2

3. **Push changes and redeploy**

---

## 📞 QUICK CHECKLIST

- [ ] Go to Render Dashboard → `myshp-backend`
- [ ] Click "Settings" tab
- [ ] Look for "Python Version" dropdown OR "Build Command" field
- [ ] Set to Python 3.11 or update build command
- [ ] Save changes
- [ ] Redeploy (Manual Deploy → Deploy latest commit)
- [ ] Check logs to verify Python 3.11 is being used

---

**Most Common Location:** Settings Tab → Python Version Dropdown

**If not there:** Environment Tab → Add `PYTHON_VERSION=3.11.9`



