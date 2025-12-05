# EdithCloths - E-Commerce Platform

A modern e-commerce platform with separate frontend and backend deployments.

## 📁 Project Structure

```
myshp/
├── frontend/          # Frontend application (Vercel)
│   ├── admin/         # Admin panel pages
│   ├── assets/         # CSS, JS, images
│   ├── pages/         # User-facing pages
│   └── index.html     # Landing page
│
├── backend/           # Django backend (Render)
│   ├── edithclothes/  # Django project settings
│   ├── shop/          # Main app
│   ├── templates/     # Django templates
│   ├── media/         # User uploads
│   └── staticfiles/   # Collected static files
│
└── docs/              # Documentation files
```

## 🚀 Quick Start

### Backend (Django)

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs on: `http://127.0.0.1:8000`

### Frontend

The frontend is a static site. Serve it using:
- Live Server (VS Code extension)
- Python: `python -m http.server 8001`
- Or any static file server

Frontend runs on: `http://127.0.0.1:5500` (Live Server) or `http://127.0.0.1:8001`

## 🌐 Deployment

### Backend (Render)
- **URL**: `https://myshp-backend.onrender.com`
- **Auto-deploys** from `main` branch
- Uses `render.yaml` for configuration

### Frontend (Vercel)
- **URL**: `https://myshp-frontend.vercel.app`
- **Auto-deploys** from `main` branch
- Uses `vercel.json` for configuration

## 📋 Key URLs

### Backend API
- API Root: `https://myshp-backend.onrender.com/`
- Admin: `https://myshp-backend.onrender.com/admin/`
- API: `https://myshp-backend.onrender.com/api/`

### Frontend
- Homepage: `https://myshp-frontend.vercel.app/`
- Admin Login: `https://myshp-frontend.vercel.app/admin/login.html`

## 🎨 Features

- **Admin Theme System**: Light, Dark, and Auto themes
- **Product Management**: Full CRUD operations
- **Shopping Cart**: Add, update, remove items
- **Order Management**: Complete order flow
- **Payment Integration**: UPI payment system
- **Responsive Design**: Works on all devices

## 📚 Documentation

See `docs/` directory for detailed documentation:
- `ALL_URLS.md` - Complete list of all URLs
- `DEPLOYMENT_CHECKLIST.md` - Deployment guide
- `DEPLOY_ADMIN_THEME.md` - Admin theme setup

## 🔧 Development

### Backend Setup
1. Install dependencies: `pip install -r requirements.txt`
2. Run migrations: `python manage.py migrate`
3. Create superuser: `python manage.py createsuperuser`
4. Start server: `python manage.py runserver`

### Frontend Setup
1. Update API URL in `frontend/assets/js/api.js`
2. Serve the frontend directory
3. Open in browser

## 📝 Environment Variables

### Backend (Render)
- `SECRET_KEY` - Django secret key
- `DEBUG` - Debug mode (False for production)
- `DATABASE_URL` - PostgreSQL connection string
- `DJANGO_SUPERUSER_USERNAME` - Admin username
- `DJANGO_SUPERUSER_EMAIL` - Admin email
- `DJANGO_SUPERUSER_PASSWORD` - Admin password

### Frontend (Vercel)
- `API_BASE_URL` - Backend API URL (optional)

## 🛠️ Tech Stack

- **Backend**: Django 4.2, Django REST Framework, PostgreSQL
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Deployment**: Render (Backend), Vercel (Frontend)

## 📄 License

Private project - All rights reserved
