# Quick Start Commands

## ✅ Setup Complete!

Your EdithCloths e-commerce platform is now set up and ready to use!

### 🎯 Backend Status
- ✅ Dependencies installed
- ✅ Database migrated
- ✅ Superuser created: **Maazith** / **maazith2005**
- ✅ Demo data loaded (10 products, 4 categories)
- ✅ Server running on `http://127.0.0.1:8000`

### 🚀 Access Points

1. **Django Admin Panel**: 
   - URL: http://127.0.0.1:8000/admin/
   - Username: `Maazith`
   - Password: `maazith2005`

2. **Store Dashboard**: 
   - URL: http://127.0.0.1:8000/admin/dashboard/
   - (Accessible after logging into admin)

3. **API Endpoints**: 
   - Base URL: http://127.0.0.1:8000/api/
   - See README.md for full API documentation

### 📱 Frontend Setup (Next Steps)

Open a **new terminal** and run:

```powershell
# Navigate to frontend folder
cd frontend

# Start a simple HTTP server
python -m http.server 8080
```

Then open: **http://127.0.0.1:8080**

### 🔧 Common Commands

#### Backend Commands (run from `backend/` folder):

```powershell
# Start server
python manage.py runserver

# Stop server
Ctrl + C

# Create new migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser manually (if needed)
python manage.py createsuperuser

# Recreate demo data
python manage.py create_demo_data
```

#### Admin Tasks:

1. **Upload Logo & Images**:
   - Go to Admin → Site Settings
   - Upload logo, homepage banner, and QR code
   - Set UPI ID and contact information

2. **Manage Products**:
   - Admin → Products
   - Add/edit products and variants

3. **View Dashboard**:
   - Click "Store Dashboard" link in admin sidebar
   - View statistics and order analytics

### 🎨 First Steps

1. ✅ Backend is running
2. ⏭️ Start frontend server (see above)
3. ⏭️ Login to admin and upload logo/images
4. ⏭️ Test the frontend login

### 📝 Important Files

- **Backend Settings**: `backend/edithclothes/settings.py`
- **Models**: `backend/shop/models.py`
- **API Views**: `backend/shop/views.py`
- **Frontend API Client**: `frontend/assets/js/api.js`
- **Styles**: `frontend/assets/css/style.css`

### 🔑 Default Credentials

- **Username**: Maazith
- **Email**: maazith.md@gmail.com
- **Password**: maazith2005

### ❓ Troubleshooting

**Server won't start?**
- Make sure port 8000 is not in use
- Check if you're in the `backend/` directory

**Can't login?**
- Verify superuser exists: `python manage.py createsuperuser`
- Check database: `python manage.py migrate`

**API errors?**
- Verify backend is running on port 8000
- Check CORS settings in `settings.py`

---

**Your platform is ready! Happy coding! 🎉**

