# Project Structure

## 📁 Directory Layout

```
myshp/
├── frontend/                 # Frontend application (Vercel deployment)
│   ├── admin/                # Admin panel pages
│   │   ├── add_product.html
│   │   ├── banners.html
│   │   ├── dashboard.html
│   │   ├── login.html
│   │   ├── orders.html
│   │   └── products.html
│   ├── assets/               # Static assets
│   │   ├── css/
│   │   │   └── style.css     # Main stylesheet
│   │   ├── images/           # Images (logo, QR code, etc.)
│   │   ├── img/              # Placeholder images
│   │   └── js/               # JavaScript modules
│   │       ├── admin.js      # Admin functionality
│   │       ├── api.js        # API client
│   │       ├── auth.js       # Authentication
│   │       ├── cart.js       # Shopping cart
│   │       ├── checkout.js   # Checkout process
│   │       ├── components.js # Reusable components
│   │       ├── contact.js    # Contact form
│   │       ├── home.js       # Homepage logic
│   │       ├── orders.js     # Order management
│   │       ├── payment.js    # Payment handling
│   │       ├── product-detail.js
│   │       └── products.js   # Product listing
│   ├── pages/                # User-facing pages
│   │   ├── cart.html
│   │   ├── checkout.html
│   │   ├── contact.html
│   │   ├── index.html        # Homepage
│   │   ├── login.html
│   │   ├── men.html
│   │   ├── myorders.html
│   │   ├── order_success.html
│   │   ├── payment.html
│   │   ├── product_detail.html
│   │   ├── register.html
│   │   └── women.html
│   ├── index.html            # Landing page
│   ├── test-api.html         # API testing page
│   ├── vercel.json           # Vercel configuration
│   └── README.md             # Frontend documentation
│
├── backend/                  # Django backend (Render deployment)
│   ├── edithclothes/         # Django project
│   │   ├── settings.py       # Django settings
│   │   ├── urls.py           # URL routing
│   │   ├── wsgi.py           # WSGI config
│   │   └── asgi.py           # ASGI config
│   ├── shop/                 # Main Django app
│   │   ├── models.py         # Database models
│   │   ├── views.py          # API views
│   │   ├── serializers.py    # DRF serializers
│   │   ├── urls.py           # App URLs
│   │   ├── admin.py          # Admin configuration
│   │   ├── static/
│   │   │   └── admin/
│   │   │       └── css/
│   │   │           └── custom_admin.css  # Admin theme CSS
│   │   ├── migrations/       # Database migrations
│   │   └── management/
│   │       └── commands/     # Custom management commands
│   ├── templates/             # Django templates
│   │   ├── admin/
│   │   │   ├── base_site.html
│   │   │   └── dashboard.html
│   │   ├── registration/
│   │   │   └── login.html    # Admin login template
│   │   └── emails/           # Email templates
│   ├── media/                # User uploads (not in git)
│   ├── staticfiles/          # Collected static files (not in git)
│   ├── build.sh              # Build script for Render
│   ├── start.sh              # Startup script
│   ├── render.yaml           # Render configuration
│   ├── requirements.txt      # Python dependencies
│   ├── Procfile              # Process file
│   └── manage.py             # Django management script
│
├── docs/                     # Documentation files
│   └── [85+ markdown files]  # All documentation
│
├── .gitignore               # Git ignore rules
├── README.md                # Main project README
├── ALL_URLS.md              # Complete URL reference
├── DEPLOYMENT_CHECKLIST.md  # Deployment guide
└── DEPLOY_ADMIN_THEME.md    # Admin theme guide
```

## 🎯 Key Files

### Frontend
- **Entry Point**: `frontend/index.html`
- **Main CSS**: `frontend/assets/css/style.css`
- **API Config**: `frontend/assets/js/api.js`
- **Vercel Config**: `frontend/vercel.json`

### Backend
- **Django Settings**: `backend/edithclothes/settings.py`
- **URL Routing**: `backend/edithclothes/urls.py`
- **Main App**: `backend/shop/`
- **Admin CSS**: `backend/shop/static/admin/css/custom_admin.css`
- **Render Config**: `backend/render.yaml`

## 📦 Deployment Files

### Backend (Render)
- `render.yaml` - Service configuration
- `build.sh` - Build script
- `start.sh` - Startup script
- `Procfile` - Process definition
- `requirements.txt` - Python dependencies

### Frontend (Vercel)
- `vercel.json` - Vercel configuration
- `package.json` - Node dependencies (if any)

## 🗑️ Files Not in Git

- `backend/venv/` - Virtual environment
- `backend/db.sqlite3` - Local database
- `backend/media/` - User uploads
- `backend/staticfiles/` - Collected static files
- `__pycache__/` - Python cache
- `*.pyc` - Compiled Python files

## ✅ Organization Complete

All files are now properly organized:
- ✅ Frontend files in `frontend/`
- ✅ Backend files in `backend/`
- ✅ Documentation in `docs/`
- ✅ Duplicates removed
- ✅ Root directory clean








