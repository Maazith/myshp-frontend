# ✅ DEPLOYMENT CHECKLIST - Render & Vercel

**Deployment Initiated:** December 10, 2025

---

## 🎯 IMMEDIATE ACTIONS REQUIRED

### 1. Verify Render Backend Deployment

**Go to:** https://dashboard.render.com

**Steps:**
1. Click on service: `myshp-backend`
2. Check "Latest Deploy" status:
   - ✅ "Live" = Deployed successfully
   - ⏳ "Building" = Wait for completion
   - ❌ "Failed" = Check logs

3. **Link Database (CRITICAL):**
   - Go to "Database" section (left sidebar)
   - Click "Link Database"
   - Select: `myshp-db`
   - Click "Link"
   - **This sets `DATABASE_URL` automatically**

4. **Verify Environment Variables:**
   - Go to "Environment" tab
   - Verify these are set:
     ```
     RENDER=true
     ENVIRONMENT=production
     DEBUG=False
     SECRET_KEY=[Should be set]
     DATABASE_URL=[Should be set after linking database]
     DJANGO_SUPERUSER_USERNAME=Edithcloths
     DJANGO_SUPERUSER_EMAIL=edith0530s@gmail.com
     DJANGO_SUPERUSER_PASSWORD=edithcloths0530@2025./
     ```

5. **Check Logs:**
   - Go to "Logs" tab
   - Look for:
     - ✅ "Migrations complete!"
     - ✅ "Created superuser: Edithcloths"
     - ✅ "Starting Gunicorn server..."

6. **Test Backend:**
   - Open: `https://myshp-backend.onrender.com/api/products/`
   - Should return JSON (even if empty `[]`)

### 2. Verify Vercel Frontend Deployment

**Go to:** https://vercel.com/dashboard

**Steps:**
1. Click on your frontend project
2. Check latest deployment status:
   - ✅ "Ready" = Deployed successfully
   - ⏳ "Building" = Wait for completion

3. **Set Environment Variable (CRITICAL):**
   - Go to "Settings" → "Environment Variables"
   - Add:
     ```
     Name: NEXT_PUBLIC_API_URL
     Value: https://myshp-backend.onrender.com/api
     ```
   - Save
   - **Redeploy** (if deployment already completed)

4. **Test Frontend:**
   - Open: `https://myshp-frontend.vercel.app`
   - Should load homepage
   - Check browser console (F12) for errors

---

## 🔗 DATABASE CONNECTION SETUP

### Critical: Link Database in Render

**Why:** Render needs to know which database your backend should use.

**Steps:**
1. Render Dashboard → Backend Service (`myshp-backend`)
2. Go to "Database" section (or "Environment" → "Database")
3. Click "Link Database" or "Connect Database"
4. Select: `myshp-db`
5. Click "Link" or "Connect"

**What Happens:**
- Render automatically sets `DATABASE_URL` environment variable
- Format: `postgresql://user:pass@host:5432/dbname`
- Your Django app will use this automatically

**Verify:**
- Go to "Environment" tab
- Look for `DATABASE_URL`
- Should show: `postgresql://...` (click "Reveal" to see full URL)

---

## ✅ VERIFICATION STEPS

### Backend Verification:

1. **Health Check:**
   ```
   https://myshp-backend.onrender.com/api/products/
   ```
   - Should return: `[]` or JSON array

2. **Admin Login (Django):**
   ```
   https://myshp-backend.onrender.com/edith-admin-login/
   ```
   - Should load login page
   - Login: `Edithcloths` / `edithcloths0530@2025./`

3. **Check Logs:**
   - Render Dashboard → Service → Logs
   - Should see: "Migrations complete!"
   - Should see: "Created superuser: Edithcloths"

### Frontend Verification:

1. **Homepage:**
   ```
   https://myshp-frontend.vercel.app
   ```
   - Should load correctly
   - No console errors

2. **Admin Entry:**
   - Scroll to footer
   - Click "© 2025 EdithCloths"
   - Should redirect to `/admin/login.html`

3. **Admin Login:**
   - Login: `Edithcloths` / `edithcloths0530@2025./`
   - Should redirect to dashboard

---

## 🆘 TROUBLESHOOTING

### Backend Shows "Failed" Deployment:

1. **Check Build Logs:**
   - Go to Render → Service → Logs
   - Look for error messages
   - Common issues:
     - Missing dependencies → Check `requirements.txt`
     - Build script error → Check `build.sh`
     - Database not linked → Link database first

2. **Manual Deploy:**
   - Go to "Manual Deploy"
   - Click "Deploy latest commit"

### Database Not Connected:

1. **Link Database:**
   - Go to backend service → "Database"
   - Click "Link Database"
   - Select `myshp-db`

2. **Verify Database Exists:**
   - Go to "Databases" section
   - Should see `myshp-db`
   - Status should be "Available"

3. **Check Environment Variables:**
   - Go to "Environment" tab
   - `DATABASE_URL` should exist
   - If missing, link database again

### Frontend Shows Errors:

1. **Check Environment Variable:**
   - Vercel → Settings → Environment Variables
   - `NEXT_PUBLIC_API_URL` should be set
   - Value: `https://myshp-backend.onrender.com/api`

2. **Redeploy:**
   - Go to "Deployments"
   - Click "Redeploy" on latest deployment

3. **Check Browser Console:**
   - Open frontend URL
   - Press F12 → Console tab
   - Look for API connection errors

---

## 📋 COMPLETE CHECKLIST

### Render (Backend):
- [ ] Service is "Live"
- [ ] Database `myshp-db` exists and is "Available"
- [ ] Database is linked to backend service
- [ ] `DATABASE_URL` environment variable is set
- [ ] All environment variables are set (see list above)
- [ ] Migrations ran successfully (check logs)
- [ ] Admin user created (check logs)
- [ ] Health endpoint works: `/api/products/`
- [ ] Admin login works: `/edith-admin-login/`

### Vercel (Frontend):
- [ ] Deployment is "Ready"
- [ ] `NEXT_PUBLIC_API_URL` environment variable is set
- [ ] Homepage loads correctly
- [ ] No console errors
- [ ] Admin entry works (footer click)
- [ ] Admin login works

### Database:
- [ ] Database is "Available" in Render
- [ ] Database is linked to backend service
- [ ] `DATABASE_URL` is set automatically
- [ ] Migrations applied successfully
- [ ] Can create products (test in admin)

---

## 🎉 SUCCESS CRITERIA

**Deployment is successful when:**

1. ✅ Backend health check returns JSON
2. ✅ Frontend homepage loads
3. ✅ Admin login works (both Django and JWT)
4. ✅ Database is connected
5. ✅ Can create products in admin panel
6. ✅ Products appear on homepage

---

## 📞 QUICK LINKS

- **Render Dashboard:** https://dashboard.render.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Backend URL:** https://myshp-backend.onrender.com
- **Frontend URL:** https://myshp-frontend.vercel.app
- **Backend Admin:** https://myshp-backend.onrender.com/edith-admin-login/
- **Frontend Admin:** https://myshp-frontend.vercel.app/admin/login.html

---

**Status:** ✅ **CODE PUSHED - MONITOR DEPLOYMENTS**

Check both dashboards to verify deployment completes successfully!
