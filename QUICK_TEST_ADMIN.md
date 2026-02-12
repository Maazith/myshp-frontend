# Quick Guide: Test Admin Login

## Admin URL
The Django admin is now accessible at: **`/edith-admin-login/`**

## Testing Steps

### 1. Access Admin Login Page

**Production (Render):**
```
https://myshp-backend.onrender.com/edith-admin-login/
```

**Local Development:**
```
http://127.0.0.1:8000/edith-admin-login/
```

### 2. Create Admin User (If Not Already Created)

**Option A: Using Django Command (Recommended)**
```bash
cd backend
python manage.py createsuperuser
```

You'll be prompted for:
- Username (e.g., `admin`)
- Email (optional, e.g., `admin@edithcloths.com`)
- Password (enter twice)

**Option B: Using Django Shell**
```bash
cd backend
python manage.py shell
```

Then in the shell:
```python
from django.contrib.auth.models import User
User.objects.create_superuser('admin', 'admin@example.com', 'your_password')
exit()
```

### 3. Login to Admin

1. Go to the admin URL (see step 1)
2. Enter your username and password
3. Click "Log in"
4. You should see the Django admin dashboard

### 4. Verify Admin Features

Once logged in, you should be able to:
- ✅ View and manage Products
- ✅ View and manage Orders
- ✅ View and manage Categories
- ✅ View and manage Banners
- ✅ View and manage Users
- ✅ Access Site Settings

## Quick Test Commands

### Check if admin URL is working:
```bash
# Should return 200 (login page) or 302 (redirect if already logged in)
curl -I https://myshp-backend.onrender.com/edith-admin-login/
```

### Verify admin URL in API response:
```bash
curl https://myshp-backend.onrender.com/
```

Should show:
```json
{
  "endpoints": {
    "admin": "/edith-admin-login/",
    ...
  }
}
```

## Troubleshooting

### Issue: 404 Not Found
**Solution:**
- Verify the URL is exactly `/edith-admin-login/` (with trailing slash)
- Check that backend is deployed and running
- Wait 2-5 minutes after pushing changes for Render to deploy

### Issue: Invalid Username/Password
**Solution:**
- Create a new superuser: `python manage.py createsuperuser`
- Or reset password: `python manage.py changepassword <username>`

### Issue: Permission Denied
**Solution:**
- Ensure user has `is_staff=True` and `is_superuser=True`
- Check in Django shell:
```python
from django.contrib.auth.models import User
user = User.objects.get(username='your_username')
user.is_staff = True
user.is_superuser = True
user.save()
```

## Bookmark the Admin URL

For easy access, bookmark:
- **Production:** `https://myshp-backend.onrender.com/edith-admin-login/`
- **Local:** `http://127.0.0.1:8000/edith-admin-login/`

## Security Note

⚠️ **Important:** The admin URL `/edith-admin-login/` is now a custom secret URL. Keep it private and don't share it publicly.














