# 🔧 Login Troubleshooting Guide

## Admin Login Credentials

According to the auto-creation signal, the superuser credentials are:
- **Username**: `Maazith`
- **Password**: `maazith2005`

## Common Issues & Solutions

### 1. Backend Server Not Running
**Symptom**: "Failed to connect to server" error

**Solution**:
```bash
cd backend
python manage.py runserver
```
The backend should run on `http://127.0.0.1:8000`

### 2. Wrong API URL
**Check**: Open `frontend/assets/js/api.js` and verify:
```javascript
const API_BASE = 'http://127.0.0.1:8000/api';
```

### 3. Superuser Not Created
**Check**: The superuser should be auto-created, but you can manually create it:
```bash
cd backend
python manage.py createsuperuser
```
Or use Django shell:
```bash
python manage.py shell
```
```python
from django.contrib.auth.models import User
User.objects.create_superuser('Maazith', 'maazith.md@gmail.com', 'maazith2005')
```

### 4. Check Browser Console
**Steps**:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try to login
4. Check for error messages

### 5. Check Network Requests
**Steps**:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login
4. Look for the `/api/auth/login` request
5. Check:
   - Status code (should be 200, not 401/404/500)
   - Request payload (should include username and password)
   - Response data

### 6. Clear Local Storage
Sometimes old tokens can cause issues:
1. Open DevTools (F12)
2. Go to Application tab → Local Storage
3. Clear all items
4. Try logging in again

### 7. User vs Admin Login

**User Login** (`pages/login.html`):
- Use the same endpoint: `/api/auth/login`
- Any registered user can login
- Redirects to `pages/index.html`

**Admin Login** (`admin/login.html`):
- Use the same endpoint: `/api/auth/login`
- Must have `is_staff = True` (superuser)
- Redirects to `admin/dashboard.html`
- Username: `Maazith`, Password: `maazith2005`

## Testing Steps

1. **Check Backend is Running**:
   ```bash
   curl http://127.0.0.1:8000/api/auth/login -X POST -H "Content-Type: application/json" -d '{"username":"test","password":"test"}'
   ```

2. **Check Superuser Exists**:
   ```bash
   cd backend
   python manage.py shell
   ```
   ```python
   from django.contrib.auth.models import User
   user = User.objects.filter(username='Maazith').first()
   print(f"User exists: {user is not None}")
   print(f"Is staff: {user.is_staff if user else 'N/A'}")
   print(f"Is superuser: {user.is_superuser if user else 'N/A'}")
   ```

3. **Manual Login Test**:
   - Open browser
   - Go to `http://127.0.0.1:5500/admin/login.html`
   - Enter:
     - Username: `Maazith`
     - Password: `maazith2005`
   - Check console for errors

## Quick Fix Commands

```bash
# 1. Navigate to backend
cd backend

# 2. Create/verify superuser
python manage.py createsuperuser
# Use: Maazith / maazith.md@gmail.com / maazith2005

# 3. Start server
python manage.py runserver

# 4. In another terminal, check if user exists
python manage.py shell
# Then run:
# from django.contrib.auth.models import User
# print(User.objects.filter(username='Maazith').exists())
```

## Error Messages & Meanings

- **"Failed to connect to server"**: Backend not running or wrong API_BASE URL
- **"No active account found"**: Wrong username or user doesn't exist
- **"Unable to log in with provided credentials"**: Wrong password
- **"Not authorized as admin"**: User exists but `is_staff = False`
- **"HTTP 404"**: Wrong API endpoint URL
- **"HTTP 500"**: Backend server error (check Django logs)



