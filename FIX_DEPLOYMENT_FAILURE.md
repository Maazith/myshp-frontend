# 🚨 FIX DEPLOYMENT FAILURE - Step by Step

**Status:** Deployment failed - Need to fix and link database

---

## 🔍 STEP 1: Check Deployment Logs

**Why deployment failed:**
1. Go to Render Dashboard → `myshp-backend` service
2. Click **"Logs"** tab (left sidebar)
3. Scroll to the bottom to see the error
4. Look for error messages (usually red text)

**Common errors:**
- Missing dependencies
- Database connection error
- Build script error
- Missing environment variables

**Share the error message** so I can help fix it!

---

## 🔗 STEP 2: Link Database in Render

**In Render, databases are linked differently:**

### Method 1: Through Main Databases Section (Recommended)

1. **Go to Render Dashboard:**
   - https://dashboard.render.com

2. **Click "Databases" in the top navigation** (NOT in the service sidebar)
   - This is usually at the top of the page or in the main navigation

3. **Find your database:**
   - Look for `myshp-db`
   - Click on it

4. **Link to Service:**
   - In the database page, look for "Connected Services" or "Link Service"
   - Click "Link Service" or "Connect Service"
   - Select: `myshp-backend`
   - Click "Link"

### Method 2: Through Service Environment Variables

1. **Go to your backend service:**
   - Click `myshp-backend` service

2. **Go to "Environment" tab** (left sidebar)

3. **Add DATABASE_URL manually:**
   - Click "Add Environment Variable"
   - Key: `DATABASE_URL`
   - Value: Get this from your database page:
     - Go to Databases → `myshp-db`
     - Copy "Internal Database URL" or "Connection String"
     - Paste it as the value
   - Click "Save Changes"

### Method 3: Through render.yaml (Already Configured)

Your `render.yaml` already has:
```yaml
- key: DATABASE_URL
  fromDatabase:
    name: myshp-db
    property: connectionString
```

**But this only works if:**
- The database exists
- The database is in the same Render account
- The service is deployed via `render.yaml`

---

## 🔧 STEP 3: Check Database Status

1. **Go to Render Dashboard → Databases**
2. **Find `myshp-db`**
3. **Check Status:**
   - ✅ "Available" = Good
   - ⏳ "Provisioning" = Wait
   - ❌ "Failed" = Need to recreate

4. **If database doesn't exist:**
   - Click "New +" → "PostgreSQL"
   - Name: `myshp-db`
   - Plan: Free
   - Database Name: `myshp`
   - User: `myshp_user`
   - Click "Create Database"
   - Wait for provisioning (2-3 minutes)

---

## 📋 STEP 4: Verify Environment Variables

**Go to:** Backend Service → "Environment" tab

**Required Variables:**
```
RENDER=true
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=[Should be set - use Generate]
DATABASE_URL=[Should be set after linking database]
DJANGO_SUPERUSER_USERNAME=Edithcloths
DJANGO_SUPERUSER_EMAIL=edith0530s@gmail.com
DJANGO_SUPERUSER_PASSWORD=edithcloths0530@2025./
```

**If DATABASE_URL is missing:**
- Link database first (see Step 2)
- Or add manually (see Method 2 above)

---

## 🚀 STEP 5: Redeploy After Fixing

1. **After linking database:**
   - Go to service → "Manual Deploy"
   - Click "Deploy latest commit"
   - OR wait for auto-deploy (if enabled)

2. **Monitor deployment:**
   - Go to "Events" tab
   - Watch for "Deploy started" → "Deploy live"
   - If it fails again, check logs

---

## 🆘 TROUBLESHOOTING

### Database Not Found?

**Create it:**
1. Render Dashboard → "New +" → "PostgreSQL"
2. Name: `myshp-db`
3. Plan: Free
4. Database Name: `myshp`
5. User: `myshp_user`
6. Create

### Can't Find "Link Service" Button?

**Try:**
1. Go to Database → `myshp-db`
2. Look for "Connected Services" section
3. Click "Connect Service" or "Link Service"
4. Select `myshp-backend`

### DATABASE_URL Still Not Set?

**Manual method:**
1. Go to Database → `myshp-db`
2. Copy "Internal Database URL" (looks like `postgresql://...`)
3. Go to Service → Environment → Add Variable
4. Key: `DATABASE_URL`
5. Value: Paste the URL
6. Save

---

## ✅ VERIFICATION CHECKLIST

After fixing:

- [ ] Database `myshp-db` exists and is "Available"
- [ ] Database is linked to `myshp-backend` service
- [ ] `DATABASE_URL` is set in Environment variables
- [ ] All required environment variables are set
- [ ] Deployment logs show no errors
- [ ] Service status shows "Live"
- [ ] Health check works: `https://myshp-backend.onrender.com/api/products/`

---

## 📞 QUICK ACTIONS

1. **Check Logs:** Service → Logs tab → Scroll to bottom
2. **Link Database:** Databases → `myshp-db` → Link Service → Select `myshp-backend`
3. **Verify DATABASE_URL:** Service → Environment → Check `DATABASE_URL` exists
4. **Redeploy:** Service → Manual Deploy → Deploy latest commit

---

**Next:** Check the logs first, then link the database!










