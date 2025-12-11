# How to Test Edith Admin Login

## Overview
The Django admin panel is now accessible at the custom URL: `/edith-admin-login/`

## Step 1: Ensure Backend is Running

### Local Development:
```bash
cd backend
python manage.py runserver
```
The backend will be available at: `http://127.0.0.1:8000`

### Production:
The backend should be running at: `https://myshp-backend.onrender.com`

## Step 2: Create Admin Superuser (If Not Already Created)

You need a Django superuser account to access the admin panel.

### Create Superuser:
```bash
cd backend
python manage.py createsuperuser
```

You'll be prompted to enter:
- Username
- Email (optional)
- Password (twice for confirmation)

**Example:**
```
Username: admin
Email address: admin@edithcloths.com
Password: ********
Password (again): ********
Superuser created successfully.
```

## Step 3: Access Admin Login Page

### Local Development:
Open your browser and navigate to:
```
http://127.0.0.1:8000/edith-admin-login/
```

### Production:
Navigate to:
```
https://myshp-backend.onrender.com/edith-admin-login/
```

## Step 4: Test Login

1. **Enter Credentials:**
   - Username: (the username you created)
   - Password: (the password you set)

2. **Click "Log in"**

3. **Expected Result:**
   - You should be redirected to the Django admin dashboard
   - You'll see the admin interface with models you can manage (Products, Orders, Categories, etc.)

## Step 5: Verify Admin Features

Once logged in, you should be able to:
- ✅ View and manage Products
- ✅ View and manage Orders
- ✅ View and manage Categories
- ✅ View and manage Banners
- ✅ View and manage Users
- ✅ Access Site Settings (if configured)

## Troubleshooting

### Issue: "Page Not Found (404)"
**Solution:**
- Verify the URL is exactly `/edith-admin-login/` (with trailing slash)
- Check that the backend server is running
- Ensure `backend/edithclothes/urls.py` has the correct path configuration

### Issue: "Invalid Username/Password"
**Solution:**
- Double-check your credentials
- Create a new superuser if needed: `python manage.py createsuperuser`
- Reset password: `python manage.py changepassword <username>`

### Issue: "Permission Denied"
**Solution:**
- Ensure the user has `is_staff=True` and `is_superuser=True`
- You can check this in Django shell:
  ```python
  python manage.py shell
  >>> from django.contrib.auth.models import User
  >>> user = User.objects.get(username='your_username')
  >>> user.is_staff = True
  >>> user.is_superuser = True
  >>> user.save()
  ```

### Issue: "CSRF Token Missing or Incorrect"
**Solution:**
- Clear browser cookies for the site
- Try accessing in incognito/private mode
- Ensure `CSRF_TRUSTED_ORIGINS` in settings.py includes your domain

## Quick Test Commands

### Check if admin URL is configured correctly:
```bash
cd backend
python manage.py show_urls | grep admin
```

### List all superusers:
```bash
python manage.py shell
>>> from django.contrib.auth.models import User
>>> User.objects.filter(is_superuser=True).values('username', 'email')
```

### Create superuser non-interactively (for testing):
```bash
python manage.py shell
>>> from django.contrib.auth.models import User
>>> User.objects.create_superuser('testadmin', 'admin@test.com', 'testpass123')
```

## Security Notes

⚠️ **Important:**
- The admin URL `/edith-admin-login/` is now a custom secret URL
- Keep this URL private and don't share it publicly
- Use strong passwords for admin accounts
- Consider adding additional security measures (2FA, IP restrictions) for production

## Bookmark the Admin URL

For easy access, bookmark:
- **Local:** `http://127.0.0.1:8000/edith-admin-login/`
- **Production:** `https://myshp-backend.onrender.com/edith-admin-login/`

## Alternative: Frontend Admin Panel

There's also a frontend admin panel at:
- **Local:** `http://127.0.0.1:5500/admin/login.html` (or your frontend URL)
- This uses API authentication and is separate from Django admin

The Django admin (`/edith-admin-login/`) is the full-featured admin interface for managing all data directly.








