# 🚀 Deploy Frontend to Vercel

## ✅ Pre-Deployment Checklist

- [x] Backend deployed on Render: `https://myshp-backend.onrender.com`
- [x] API URL configured: `https://myshp-backend.onrender.com/api`
- [x] CORS configured on backend (allows all origins)
- [x] Vercel configuration files created

---

## 📋 Step-by-Step Deployment

### Step 1: Create Vercel Account

1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub (recommended) or email
3. Verify your email if needed

---

### Step 2: Install Vercel CLI (Optional - Can use Dashboard)

**Option A: Using Dashboard (Recommended)**
- Skip to Step 3

**Option B: Using CLI**
```bash
npm install -g vercel
vercel login
```

---

### Step 3: Deploy via Vercel Dashboard

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. **Import Git Repository**:
   - Connect your GitHub account if not connected
   - Find and select your repository (e.g., `Maazith/myshp` or your frontend repo)
   - Click **"Import"**

4. **Configure Project**:
   - **Framework Preset**: Select **"Other"** or **"Static Site"**
   - **Root Directory**: Set to `frontend` (if your repo has both frontend/backend)
   - **Build Command**: Leave empty (static site, no build needed)
   - **Output Directory**: Leave empty or set to `.`
   - **Install Command**: Leave empty

5. **Environment Variables** (if needed):
   - Usually not needed for static frontend
   - Can add later if required

6. Click **"Deploy"**

7. **Wait for Deployment** (1-2 minutes)

---

### Step 4: Get Your Vercel URL

After deployment:
- Vercel will provide a URL like: `https://your-project.vercel.app`
- You can also set a custom domain later

---

### Step 5: Update Backend CORS (If Needed)

Your backend already has `CORS_ALLOW_ALL_ORIGINS = True`, so it should work automatically.

**If you want to be more specific**, update `backend/edithclothes/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://localhost:5500',
    'https://your-project.vercel.app',  # Add your Vercel URL
    'https://*.vercel.app',  # Allow all Vercel preview deployments
]
```

**But this is optional** - `CORS_ALLOW_ALL_ORIGINS = True` already allows all origins.

---

## 🔧 Configuration Files Created

### `vercel.json`
- Configures routing for SPA
- Sets security headers
- Configures caching for static assets

### `package.json`
- Basic package.json for Vercel
- No dependencies needed (static site)

### `.vercelignore`
- Excludes documentation files from deployment

---

## ✅ Verify Deployment

### 1. Test Frontend:
- Open your Vercel URL: `https://your-project.vercel.app`
- Should see your landing page

### 2. Test API Connection:
- Try logging in
- Browse products
- Add to cart
- Should connect to Render backend

### 3. Check Browser Console:
- Open DevTools (F12)
- Check for any CORS errors
- Should see API calls to Render backend

---

## 🔍 Troubleshooting

### CORS Errors:
- **Issue**: Frontend can't connect to backend
- **Solution**: Backend already has `CORS_ALLOW_ALL_ORIGINS = True`
- **If still issues**: Add Vercel URL to `CORS_ALLOWED_ORIGINS` in backend settings

### 404 Errors on Routes:
- **Issue**: Direct URL access shows 404
- **Solution**: `vercel.json` already configured with rewrites
- **Check**: Verify `vercel.json` is in `frontend/` directory

### API Not Connecting:
- **Check**: `frontend/assets/js/api.js` has correct backend URL
- **Current**: `https://myshp-backend.onrender.com/api`
- **Verify**: Backend is running and accessible

---

## 🌐 Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Add your custom domain (e.g., `edithcloths.com`)
3. Follow DNS configuration instructions
4. Update backend CORS if using custom domain

---

## 📊 Deployment Summary

### Frontend:
- **Platform**: Vercel
- **URL**: `https://your-project.vercel.app`
- **Type**: Static Site
- **Build**: None (static HTML/CSS/JS)

### Backend:
- **Platform**: Render
- **URL**: `https://myshp-backend.onrender.com`
- **API**: `https://myshp-backend.onrender.com/api`

### Connection:
- ✅ Frontend → Backend API configured
- ✅ CORS configured
- ✅ Ready for production

---

## 🎯 Next Steps

1. ✅ Deploy to Vercel
2. ✅ Test frontend functionality
3. ✅ Verify API connection
4. ⏭️ Set up custom domain (optional)
5. ⏭️ Configure environment variables (if needed)

---

## 📝 Quick Reference

**Frontend URL**: `https://your-project.vercel.app`
**Backend URL**: `https://myshp-backend.onrender.com`
**API Base**: `https://myshp-backend.onrender.com/api`

---

**Ready to deploy! Follow Step 3 to deploy via Vercel Dashboard.** 🚀

