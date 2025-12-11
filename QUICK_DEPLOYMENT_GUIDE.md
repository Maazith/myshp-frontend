# 🚀 Quick Deployment Guide - EdithCloths

## ⚡ Quick Start

### Backend (Render) - 5 Minutes

1. **Link Database:**
   - Render Dashboard → Backend Service → Database → Link `myshp-db`

2. **Verify Environment Variables:**
   ```
   RENDER=true
   ENVIRONMENT=production
   DEBUG=False
   SECRET_KEY=[Auto-generated]
   DATABASE_URL=[Auto-set when database linked]
   DJANGO_SUPERUSER_USERNAME=Edithcloths
   DJANGO_SUPERUSER_EMAIL=edith0530s@gmail.com
   DJANGO_SUPERUSER_PASSWORD=edithcloths0530@2025./
   ```

3. **Deploy:**
   - Push to GitHub → Auto-deploys
   - Check logs for success

### Frontend (Vercel) - 3 Minutes

1. **Set Environment Variable:**
   ```
   NEXT_PUBLIC_API_URL=https://myshp-backend.onrender.com/api
   ```

2. **Deploy:**
   - Push to GitHub → Auto-deploys
   - Or trigger manual deployment

---

## 🔑 Admin Credentials

**Username:** `Edithcloths`  
**Password:** `edithcloths0530@2025./`  
**Email:** `edith0530s@gmail.com`

**Access:** Click footer copyright "© 2025 EdithCloths" or go to `/admin/login.html`

---

## ✅ Post-Deployment Checklist

- [ ] Backend health check: `https://myshp-backend.onrender.com/api/products/`
- [ ] Admin login works: `https://myshp-backend.onrender.com/edith-admin-login/`
- [ ] Frontend loads: `https://myshp-frontend.vercel.app`
- [ ] Admin panel accessible via footer click
- [ ] Products load on homepage
- [ ] Cart functionality works
- [ ] Checkout process works

---

## 🆘 Quick Troubleshooting

**Backend not responding?**
→ Check Render logs, verify environment variables

**Frontend not loading?**
→ Check Vercel logs, verify `NEXT_PUBLIC_API_URL`

**Admin login fails?**
→ Verify credentials, check JWT token in console

**Images not uploading?**
→ Set Cloudinary credentials in Render (optional)

---

**Full Documentation:** See `FINAL_QUALITY_CHECK_REPORT.md`

