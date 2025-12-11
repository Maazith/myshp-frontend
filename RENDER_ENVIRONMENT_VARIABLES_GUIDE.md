# Render Backend Environment Variables Guide

## Required Environment Variables

Set these in your Render dashboard under your backend service → Environment → Environment Variables.

### 🔴 **REQUIRED - Core Settings**

#### 1. **RENDER**
```
Key: RENDER
Value: true
```
**Purpose**: Tells Django it's running on Render (auto-detects production mode)

#### 2. **ENVIRONMENT**
```
Key: ENVIRONMENT
Value: production
```
**Purpose**: Sets production environment flag

#### 3. **DEBUG**
```
Key: DEBUG
Value: False
```
**Purpose**: Disables debug mode in production (security)

#### 4. **SECRET_KEY**
```
Key: SECRET_KEY
Value: [Generate a strong random key]
```
**Purpose**: Django secret key for cryptographic signing

**How to generate:**
```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Or use Render's "Generate Value" option in the dashboard.

---

### 🔴 **REQUIRED - Database**

#### 5. **DATABASE_URL**
```
Key: DATABASE_URL
Value: [Auto-set by Render when you link the database]
```
**Purpose**: PostgreSQL connection string

**Note**: This is automatically set when you link your PostgreSQL database to the web service in Render. You don't need to set it manually.

---

### 🔴 **REQUIRED - Cloudinary (Media Storage)**

**Why Cloudinary?** Render's filesystem is temporary - files are lost on redeploy. Cloudinary stores images permanently.

#### 6. **CLOUDINARY_CLOUD_NAME**
```
Key: CLOUDINARY_CLOUD_NAME
Value: [Your Cloudinary cloud name]
```
**Purpose**: Your Cloudinary account cloud name

**How to get:**
1. Sign up at https://cloudinary.com (free tier available)
2. Go to Dashboard
3. Copy "Cloud name" from Account Details

#### 7. **CLOUDINARY_API_KEY**
```
Key: CLOUDINARY_API_KEY
Value: [Your Cloudinary API key]
```
**Purpose**: Cloudinary API key for authentication

**How to get:**
1. Go to Cloudinary Dashboard
2. Copy "API Key" from Account Details

#### 8. **CLOUDINARY_API_SECRET**
```
Key: CLOUDINARY_API_SECRET
Value: [Your Cloudinary API secret]
```
**Purpose**: Cloudinary API secret for authentication

**How to get:**
1. Go to Cloudinary Dashboard
2. Copy "API Secret" from Account Details
3. **⚠️ Keep this secret!** Never commit to git.

---

### 🟡 **OPTIONAL - CORS & Frontend URLs**

These help with CORS configuration but are not strictly required since we set `CORS_ALLOW_ALL_ORIGINS = True`.

#### 9. **VERCEL_FRONTEND_URL** (Optional)
```
Key: VERCEL_FRONTEND_URL
Value: https://myshp-frontend.vercel.app
```
**Purpose**: Your Vercel frontend URL (for CORS)

#### 10. **CORS_ALLOWED_ORIGINS** (Optional)
```
Key: CORS_ALLOWED_ORIGINS
Value: https://edithcloths.com,https://www.edithcloths.com,https://myshp-frontend.vercel.app
```
**Purpose**: Additional CORS origins (comma-separated)

#### 11. **CSRF_TRUSTED_ORIGINS** (Optional)
```
Key: CSRF_TRUSTED_ORIGINS
Value: https://edithcloths.com,https://www.edithcloths.com,https://myshp-frontend.vercel.app
```
**Purpose**: CSRF trusted origins (comma-separated)

---

### 🟡 **OPTIONAL - Email Configuration**

Only needed if you want email notifications (order confirmations, admin alerts, etc.)

#### 12. **EMAIL_HOST** (Optional)
```
Key: EMAIL_HOST
Value: smtp.gmail.com
```
**Default**: `smtp.gmail.com`

#### 13. **EMAIL_PORT** (Optional)
```
Key: EMAIL_PORT
Value: 587
```
**Default**: `587`

#### 14. **EMAIL_USE_TLS** (Optional)
```
Key: EMAIL_USE_TLS
Value: True
```
**Default**: `True`

#### 15. **EMAIL_HOST_USER** (Optional)
```
Key: EMAIL_HOST_USER
Value: your-email@gmail.com
```
**Default**: `maazith.md@gmail.com`

#### 16. **EMAIL_HOST_PASSWORD** (Optional)
```
Key: EMAIL_HOST_PASSWORD
Value: [Your email app password]
```
**Purpose**: Email password or app-specific password

**For Gmail:**
1. Enable 2-factor authentication
2. Generate an "App Password" at https://myaccount.google.com/apppasswords
3. Use that password here

#### 17. **DEFAULT_FROM_EMAIL** (Optional)
```
Key: DEFAULT_FROM_EMAIL
Value: your-email@gmail.com
```
**Default**: Same as `EMAIL_HOST_USER`

#### 18. **ADMIN_EMAIL** (Optional)
```
Key: ADMIN_EMAIL
Value: admin@edithcloths.com
```
**Purpose**: Email address for admin notifications

---

### 🟡 **OPTIONAL - Admin User Creation**

These are used by the `ensure_admin_user` management command to create/reset the admin user.

#### 19. **DJANGO_SUPERUSER_USERNAME** (Optional)
```
Key: DJANGO_SUPERUSER_USERNAME
Value: admin
```
**Purpose**: Admin username (for auto-creation)

#### 20. **DJANGO_SUPERUSER_EMAIL** (Optional)
```
Key: DJANGO_SUPERUSER_EMAIL
Value: admin@edithcloths.com
```
**Purpose**: Admin email (for auto-creation)

#### 21. **DJANGO_SUPERUSER_PASSWORD** (Optional)
```
Key: DJANGO_SUPERUSER_PASSWORD
Value: [Strong password]
```
**Purpose**: Admin password (for auto-creation)

**⚠️ Security Note**: Use a strong password! This is your admin account.

---

## Quick Setup Checklist

### Minimum Required (Must Have):
- [ ] `RENDER` = `true`
- [ ] `ENVIRONMENT` = `production`
- [ ] `DEBUG` = `False`
- [ ] `SECRET_KEY` = [Generated key]
- [ ] `DATABASE_URL` = [Auto-set by Render]
- [ ] `CLOUDINARY_CLOUD_NAME` = [Your cloud name]
- [ ] `CLOUDINARY_API_KEY` = [Your API key]
- [ ] `CLOUDINARY_API_SECRET` = [Your API secret]

### Recommended (Should Have):
- [ ] `VERCEL_FRONTEND_URL` = `https://myshp-frontend.vercel.app`
- [ ] `DJANGO_SUPERUSER_USERNAME` = `admin`
- [ ] `DJANGO_SUPERUSER_EMAIL` = [Your email]
- [ ] `DJANGO_SUPERUSER_PASSWORD` = [Strong password]

### Optional (Nice to Have):
- [ ] Email configuration (if you need email notifications)
- [ ] `CORS_ALLOWED_ORIGINS` (if you have custom domains)
- [ ] `CSRF_TRUSTED_ORIGINS` (if you have custom domains)

---

## How to Set Environment Variables in Render

1. **Go to Render Dashboard**
   - Navigate to https://dashboard.render.com
   - Click on your backend service (`myshp-backend`)

2. **Open Environment Tab**
   - Click on "Environment" in the left sidebar
   - Or go to: Service → Environment → Environment Variables

3. **Add Variables**
   - Click "Add Environment Variable"
   - Enter Key and Value
   - Click "Save Changes"

4. **Redeploy**
   - After adding variables, Render will automatically redeploy
   - Or click "Manual Deploy" → "Deploy latest commit"

---

## Testing Your Configuration

After setting environment variables, check the logs:

1. **Check Build Logs**
   - Go to your service → Logs
   - Look for: "Cloudinary configured successfully" (if Cloudinary is set)
   - Look for: "Using local media storage" (if Cloudinary is NOT set)

2. **Check Runtime Logs**
   - After deployment, check logs for errors
   - Common issues:
     - Missing `SECRET_KEY` → Django won't start
     - Missing Cloudinary → Images won't upload (but site will work)
     - Missing `DATABASE_URL` → Database connection errors

3. **Test Admin Panel**
   - Try logging into admin panel
   - Try uploading a product image
   - Check if image appears (should be from Cloudinary URL)

---

## Troubleshooting

### "Cloudinary not configured" warning
- **Cause**: Missing Cloudinary environment variables
- **Fix**: Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **Impact**: Images will be stored locally (lost on redeploy)

### "Database connection failed"
- **Cause**: Missing or incorrect `DATABASE_URL`
- **Fix**: Link your PostgreSQL database to the web service in Render dashboard

### "CORS error" in browser
- **Cause**: Frontend URL not in CORS allowed origins
- **Fix**: Set `VERCEL_FRONTEND_URL` or `CORS_ALLOWED_ORIGINS`
- **Note**: With `CORS_ALLOW_ALL_ORIGINS = True`, this shouldn't happen

### "Admin user not found"
- **Cause**: Missing admin user creation variables
- **Fix**: Set `DJANGO_SUPERUSER_USERNAME`, `DJANGO_SUPERUSER_EMAIL`, `DJANGO_SUPERUSER_PASSWORD`
- **Or**: Create admin user manually via Django shell

---

## Security Best Practices

1. **Never commit secrets to git**
   - All sensitive values should be in Render environment variables only

2. **Use strong passwords**
   - Admin password should be at least 16 characters
   - Use a password manager

3. **Rotate secrets regularly**
   - Change `SECRET_KEY` periodically
   - Rotate Cloudinary API keys if compromised

4. **Limit access**
   - Only give Render dashboard access to trusted team members
   - Use environment variable sync carefully

---

## Example: Complete Environment Variables Setup

Here's what a complete setup might look like:

```
RENDER=true
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=django-insecure-[your-generated-key-here]
DATABASE_URL=postgresql://user:pass@host:5432/dbname
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
VERCEL_FRONTEND_URL=https://myshp-frontend.vercel.app
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@edithcloths.com
DJANGO_SUPERUSER_PASSWORD=YourStrongPassword123!
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

---

## Need Help?

If you encounter issues:
1. Check Render logs for error messages
2. Verify all required variables are set
3. Check variable names for typos
4. Ensure values don't have extra spaces
5. Redeploy after making changes




