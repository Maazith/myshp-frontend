# EdithCloths - Complete E-Commerce Platform

A full-stack e-commerce clothing website built with Django REST Framework and vanilla JavaScript, featuring a premium dark theme with gold accents.

## 🎨 UI Color Theme

- **Primary**: #0b0b0b (Black)
- **Secondary**: #ffd700 (Gold)
- **Accent/White**: #ffffff
- **Background**: #121212 (Dark Gray)
- **Text**: #f5f5f5 (Light Gray)
- **Success**: #4CAF50 (Green)
- **Danger**: #E53935 (Red)

## ✨ Features

### 1. Login-First System
- First page users see is the login page
- Automatic redirect to login if not authenticated
- After login, redirects to home page

### 2. Admin Controls
- **SiteSettings Model**: Admin can configure:
  - Website Logo
  - Homepage Banner
  - UPI ID
  - QR Code Image
  - Contact Info
  - About Text
- All settings dynamically load on frontend

### 3. Custom Admin Dashboard
- Accessible at `/admin/dashboard/`
- Shows:
  - Total Orders
  - Completed Orders
  - Pending Orders
  - Cancelled Orders
  - Total Users
  - Total Revenue
  - Recent Orders
  - Order Status Breakdown
  - Monthly Revenue Charts

### 4. Product System
- Categories with descriptions
- Products with variants (size, color, stock, price override)
- Banners for homepage
- Featured products support

### 5. Payment Flow
- User places order → sees QR code and UPI ID
- User uploads payment screenshot
- Order status: "Pending Verification"
- Admin can verify payment with one click

### 6. Auto-Create Superuser
- Automatically creates superuser on first migration:
  - Username: `Maazith`
  - Email: `maazith.md@gmail.com`
  - Password: `maazith2005`

### 7. Logo Visible Everywhere
- Logo appears in:
  - Login page
  - Navbar
  - Admin dashboard header
  - Home page
- Logo comes from SiteSettings model

### 8. Order Tracking System
- Status flow:
  - Placed
  - Payment Pending
  - Payment Verified
  - Shipped
  - Out for Delivery
  - Delivered
  - Cancelled

### 9. REST API Endpoints

#### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

#### Products
- `GET /api/products/` - List all products
- `GET /api/products/{slug}/` - Get product by slug
- `GET /api/categories/` - List all categories

#### Cart
- `GET /api/cart/` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PATCH /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/{id}` - Remove item from cart

#### Orders
- `GET /api/orders/my-orders` - Get user's orders
- `POST /api/orders/checkout` - Create order
- `POST /api/orders/confirm-payment` - Upload payment proof

#### Settings
- `GET /api/settings/` - Get site settings

## 🚀 Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment (if not already done):**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create demo data:**
   ```bash
   python manage.py create_demo_data
   ```

6. **Run development server:**
   ```bash
   python manage.py runserver
   ```

The backend will be running at `http://127.0.0.1:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Serve the frontend:**
   - Option 1: Use a simple HTTP server:
     ```bash
     # Python 3
     python -m http.server 8080
     
     # Node.js (if you have http-server installed)
     npx http-server -p 8080
     ```
   
   - Option 2: Use Live Server extension in VS Code
   
   - Option 3: Open `index.html` directly in browser (may have CORS issues with API calls)

3. **Update API URL if needed:**
   - Edit `frontend/assets/js/api.js`
   - Change `API_BASE` if your backend is running on a different URL

## 📁 Project Structure

```
backend/
  edithclothes/          # Django project settings
  shop/                  # Main Django app
    models.py           # All models (SiteSettings, Product, Order, etc.)
    views.py            # API views
    serializers.py      # DRF serializers
    admin.py            # Admin configuration + custom dashboard
    urls.py             # API routes
    signals.py          # Auto-create superuser signal
    management/
      commands/
        create_demo_data.py  # Demo data generator
  templates/
    admin/
      dashboard.html    # Custom admin dashboard template
  media/                # Uploaded files (images, etc.)
  static/               # Static files

frontend/
  pages/                # Frontend pages
    login.html          # Login page (first page)
    register.html       # Registration
    index.html          # Home page
    product_detail.html # Product details
    cart.html           # Shopping cart
    checkout.html       # Checkout
    payment.html        # Payment upload
    myorders.html       # Order history
  assets/
    css/
      style.css         # Main stylesheet with dark theme
    js/
      api.js            # API client
      auth.js           # Authentication logic
      components.js     # Reusable components
      home.js           # Home page logic
      cart.js           # Cart functionality
      checkout.js       # Checkout logic
      payment.js        # Payment upload
      orders.js         # Order management
      product-detail.js # Product details
      products.js       # Product listing
  index.html            # Root redirect (checks auth and redirects)
```

## 🔑 Default Admin Credentials

After running migrations, a superuser is automatically created:

- **Username**: `Maazith`
- **Email**: `maazith.md@gmail.com`
- **Password**: `maazith2005`

You can access the admin panel at: `http://127.0.0.1:8000/admin/`

## 📝 Admin Features

1. **Site Settings** (`/admin/shop/sitesettings/`)
   - Upload logo
   - Set homepage banner
   - Configure UPI ID and QR code
   - Update contact information

2. **Store Dashboard** (`/admin/dashboard/`)
   - View statistics
   - Monitor orders
   - Track revenue

3. **Product Management**
   - Create categories
   - Add products with variants
   - Manage banners
   - View and verify orders

## 🛒 User Flow

1. User visits site → Redirected to login
2. User logs in → Redirected to home page
3. User browses products → Adds to cart
4. User checks out → Enters shipping address
5. User sees payment page → Uploads payment screenshot
6. Admin verifies payment → Order status updates
7. Admin updates order status → User tracks order

## 🎯 Key Files

- `backend/shop/models.py` - All database models
- `backend/shop/views.py` - API endpoints
- `backend/shop/admin.py` - Admin customization + dashboard
- `frontend/assets/css/style.css` - Dark theme styles
- `frontend/assets/js/api.js` - API client with auth guard
- `frontend/index.html` - Root redirect with auth check

## 🔧 Configuration

### Backend Configuration
- Edit `backend/edithclothes/settings.py` for:
  - Database settings
  - Static/media file paths
  - CORS settings

### Frontend Configuration
- Edit `frontend/assets/js/api.js` to change:
  - API base URL
  - Token storage keys

## 📦 Dependencies

### Backend
- Django 4.2.10
- djangorestframework 3.15.1
- django-cors-headers 4.3.1
- djangorestframework-simplejwt 5.3.1
- Pillow 12.0.0

### Frontend
- Vanilla JavaScript (ES6 modules)
- No build tools required

## 🐛 Troubleshooting

1. **CORS errors**: Make sure `CORS_ALLOW_ALL_ORIGINS = True` in settings.py
2. **Static files not loading**: Run `python manage.py collectstatic`
3. **Media files not loading**: Check `MEDIA_URL` and `MEDIA_ROOT` in settings.py
4. **Login redirect loop**: Check that `frontend/index.html` auth check is working
5. **API calls failing**: Verify API_BASE URL in `frontend/assets/js/api.js`

## 📄 License

This project is built for EdithCloths e-commerce platform.

---

**Built with ❤️ for EdithCloths**

