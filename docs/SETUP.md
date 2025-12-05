# Quick Setup Guide

## Prerequisites

1. Python 3.8+ installed
2. Virtual environment (optional but recommended)

## Backend Setup

1. **Activate virtual environment:**
   ```bash
   cd backend
   # Windows
   venv\Scripts\activate
   # Linux/Mac  
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
   
   This will install:
   - Django 4.2.10
   - Django REST Framework
   - Pillow (for image uploads)
   - And other required packages

3. **Create migrations:**
   ```bash
   python manage.py makemigrations
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Create demo data (optional but recommended):**
   ```bash
   python manage.py create_demo_data
   ```

6. **Run server:**
   ```bash
   python manage.py runserver
   ```

   Backend will be at: `http://127.0.0.1:8000`

## Frontend Setup

1. **Serve the frontend:**
   
   Option A - Python HTTP Server:
   ```bash
   cd frontend
   python -m http.server 8080
   ```
   
   Option B - Node.js http-server:
   ```bash
   cd frontend
   npx http-server -p 8080
   ```
   
   Option C - VS Code Live Server extension

2. **Access the site:**
   - Frontend: `http://127.0.0.1:8080`
   - Admin: `http://127.0.0.1:8000/admin/`

## Default Admin Login

After migrations run, auto-created superuser:
- Username: `Maazith`
- Password: `maazith2005`

## First Steps

1. Login to admin panel
2. Go to Site Settings and upload:
   - Logo image
   - Homepage banner
   - QR code image
   - Set UPI ID
3. View Store Dashboard at `/admin/dashboard/`
4. Create products and categories
5. Test the frontend by logging in

## Troubleshooting

**Pillow not installed error:**
- Make sure virtual environment is activated
- Run: `pip install -r requirements.txt`

**CORS errors:**
- Backend CORS is already configured to allow all origins
- Make sure backend is running on port 8000

**Static files not loading:**
- Run: `python manage.py collectstatic`

**Media files not showing:**
- Check that `backend/media/` folder exists
- Verify `MEDIA_URL` and `MEDIA_ROOT` in settings.py

## Project Structure

- `backend/` - Django backend with API
- `frontend/` - Static HTML/CSS/JS frontend
- `backend/shop/models.py` - All database models
- `backend/shop/admin.py` - Admin configuration
- `frontend/assets/css/style.css` - Dark theme styles
- `frontend/assets/js/api.js` - API client

---

For detailed documentation, see `README.md`

