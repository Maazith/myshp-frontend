# All Application URLs - Frontend, Backend & Admin

## 🌐 Backend API URLs

### Base URLs
- **Local Development**: `http://127.0.0.1:8000`
- **Production**: `https://myshp-backend.onrender.com`

### Root & Admin
- `GET /` - API root (JSON response with endpoint info)
- `GET /admin/` - Django Admin Panel
- `GET /admin/dashboard/` - Custom Admin Dashboard
- `GET /admin/login/` - Django Admin Login

### Authentication Endpoints (`/api/auth/`)
- `POST /api/auth/register` - User Registration
- `POST /api/auth/login` - User Login
- `POST /api/auth/refresh` - Refresh JWT Token
- `GET /api/auth/me` - Get Current User Info

### Products Endpoints (`/api/products/`)
- `GET /api/products/` - List All Products
- `GET /api/products/<slug>/` - Get Product by Slug
- `GET /api/products/id/<id>/` - Get Product by ID
- `POST /api/products/add` - Create Product (Admin)
- `PUT /api/products/<id>/edit` - Update Product (Admin)
- `DELETE /api/products/<id>/delete` - Delete Product (Admin)

### Categories Endpoints (`/api/categories/`)
- `GET /api/categories/` - List All Categories
- `POST /api/categories/add` - Create Category (Admin)
- `GET /api/categories/<id>/` - Get Category Details

### Banners Endpoints (`/api/banners/`)
- `GET /api/banners/` - List All Banners
- `POST /api/banners/upload` - Upload Banner (Admin)
- `DELETE /api/banners/<id>/` - Delete Banner (Admin)

### Cart Endpoints (`/api/cart/`)
- `GET /api/cart/` - Get User Cart
- `POST /api/cart/add` - Add Item to Cart
- `PUT /api/cart/update` - Update Cart Item
- `DELETE /api/cart/remove/<id>` - Remove Item from Cart

### Orders Endpoints (`/api/orders/`)
- `POST /api/orders/checkout` - Create Order (Checkout)
- `POST /api/orders/confirm-payment` - Confirm Payment
- `GET /api/orders/my-orders` - Get User Orders
- `GET /api/orders/` - Get All Orders (Admin)
- `POST /api/orders/<id>/mark-paid` - Mark Order as Paid (Admin)
- `PUT /api/orders/<id>/status` - Update Order Status (Admin)

### Settings Endpoints (`/api/settings/`)
- `GET /api/settings/` - Get Site Settings
- `PUT /api/settings/update` - Update Site Settings (Admin)

### Media Files
- `GET /media/<path>` - Serve Media Files (Images, etc.)

---

## 🎨 Frontend Pages

### Base URL
- **Local Development**: `http://127.0.0.1:5500` (Live Server) or `http://127.0.0.1:8001` (Python Server)
- **Production**: Your deployed frontend URL

### User Pages
- `GET /index.html` - Homepage
- `GET /pages/index.html` - Homepage (alternative)
- `GET /pages/login.html` - User Login Page
- `GET /pages/register.html` - User Registration Page
- `GET /pages/product-detail.html?id=<id>` - Product Detail Page
- `GET /pages/cart.html` - Shopping Cart
- `GET /pages/checkout.html` - Checkout Page
- `GET /pages/payment.html` - Payment Page
- `GET /pages/order_success.html` - Order Success Page
- `GET /pages/myorders.html` - My Orders Page
- `GET /pages/men.html` - Men's Products Page
- `GET /pages/women.html` - Women's Products Page
- `GET /pages/contact.html` - Contact Page

### Admin Pages
- `GET /admin/login.html` - Admin Login Page
- `GET /admin/dashboard.html` - Admin Dashboard
- `GET /admin/products.html` - Admin Products Management
- `GET /admin/add_product.html` - Add New Product
- `GET /admin/orders.html` - Admin Orders Management
- `GET /admin/banners.html` - Admin Banners Management

### Testing
- `GET /test-api.html` - API Testing Page

---

## 🔐 Admin Login URLs

### Django Admin Panel
- **URL**: `http://127.0.0.1:8000/admin/` (Local)
- **URL**: `https://myshp-backend.onrender.com/admin/` (Production)
- **Login Required**: Django superuser credentials

### Custom Admin Login (Frontend)
- **URL**: `http://127.0.0.1:5500/admin/login.html` (Local)
- **URL**: `[Your Frontend URL]/admin/login.html` (Production)
- **Login Required**: Admin user credentials (via API)

### Custom Admin Dashboard
- **URL**: `http://127.0.0.1:8000/admin/dashboard/` (Backend)
- **URL**: `http://127.0.0.1:5500/admin/dashboard.html` (Frontend)

---

## 📋 Quick Access Links

### Local Development

#### Backend
```
http://127.0.0.1:8000/                    # API Root
http://127.0.0.1:8000/admin/              # Django Admin
http://127.0.0.1:8000/admin/dashboard/    # Custom Admin Dashboard
http://127.0.0.1:8000/api/                # API Root
http://127.0.0.1:8000/api/products/       # Products List
http://127.0.0.1:8000/api/categories/     # Categories List
```

#### Frontend
```
http://127.0.0.1:5500/index.html              # Homepage
http://127.0.0.1:5500/pages/login.html         # User Login
http://127.0.0.1:5500/pages/register.html      # User Registration
http://127.0.0.1:5500/pages/cart.html          # Shopping Cart
http://127.0.0.1:5500/admin/login.html         # Admin Login
http://127.0.0.1:5500/admin/dashboard.html     # Admin Dashboard
http://127.0.0.1:5500/admin/products.html      # Admin Products
http://127.0.0.1:5500/admin/orders.html        # Admin Orders
```

### Production

#### Backend
```
https://myshp-backend.onrender.com/                    # API Root
https://myshp-backend.onrender.com/admin/              # Django Admin
https://myshp-backend.onrender.com/admin/dashboard/    # Custom Admin Dashboard
https://myshp-backend.onrender.com/api/                # API Root
https://myshp-backend.onrender.com/api/products/       # Products List
https://myshp-backend.onrender.com/api/categories/     # Categories List
```

#### Frontend
```
[Your Frontend URL]/index.html              # Homepage
[Your Frontend URL]/pages/login.html         # User Login
[Your Frontend URL]/pages/register.html      # User Registration
[Your Frontend URL]/pages/cart.html          # Shopping Cart
[Your Frontend URL]/admin/login.html         # Admin Login
[Your Frontend URL]/admin/dashboard.html     # Admin Dashboard
[Your Frontend URL]/admin/products.html      # Admin Products
[Your Frontend URL]/admin/orders.html        # Admin Orders
```

---

## 🔑 Authentication Notes

### User Authentication
- Uses JWT (JSON Web Tokens)
- Tokens stored in localStorage: `edithcloths_token` (access), `edithcloths_refresh` (refresh)
- Login endpoint: `POST /api/auth/login`
- Register endpoint: `POST /api/auth/register`

### Admin Authentication
- Django Admin: Uses Django's built-in authentication
- Custom Admin: Uses JWT authentication via `/api/auth/login` with admin credentials

---

## 📝 Notes

1. **CORS**: Make sure CORS is configured in Django settings for frontend-backend communication
2. **Media Files**: Media files are served at `/media/<path>` in both development and production
3. **Static Files**: Static files are served via WhiteNoise in production
4. **API Base URL**: Configured in `frontend/assets/js/api.js` - defaults to production URL
5. **Ports**: 
   - Backend: 8000 (default Django)
   - Frontend: 5500 (Live Server) or 8001 (Python HTTP Server)

---

## 🚀 Getting Started

1. **Start Backend**: 
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Start Frontend**: 
   - Use Live Server extension in VS Code, or
   ```bash
   cd frontend
   python -m http.server 8001
   ```

3. **Access Admin**:
   - Django Admin: `http://127.0.0.1:8000/admin/`
   - Custom Admin: `http://127.0.0.1:5500/admin/login.html`











