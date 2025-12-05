# Frontend Testing Guide

## Quick Start

### 1. Update API Base URL

Before testing, update the API base URL in `assets/js/api.js`:

```javascript
const API_BASE = "http://your-django-backend-url.com";  // Replace with your backend URL
```

**For local development:**
```javascript
const API_BASE = "http://127.0.0.1:8000";  // Default Django dev server
```

### 2. Serve the Frontend

**Option A: Using Live Server (VS Code Extension)**
1. Right-click on `index.html`
2. Select "Open with Live Server"
3. Frontend will be available at `http://127.0.0.1:5500` (or similar)

**Option B: Using Python HTTP Server**
```bash
cd frontend
python -m http.server 8001
```
Access at: `http://127.0.0.1:8001`

**Option C: Using Node.js http-server**
```bash
npx http-server frontend -p 8001
```

### 3. Start Your Django Backend

Make sure your Django backend is running:
```bash
python manage.py runserver
```

## Testing Checklist

### User Side Testing

#### ✅ Authentication
- [ ] **Sign Up**: Go to `/signup.html`
  - Fill all fields
  - Submit form
  - Should redirect to homepage
  
- [ ] **Login**: Go to `/login.html`
  - Enter email and password
  - Should redirect to homepage
  - Check if user menu appears in header

- [ ] **Logout**: Click logout button
  - Should clear tokens and redirect

#### ✅ Products
- [ ] **Homepage** (`/index.html`):
  - Categories should load
  - Featured products should display
  - Product cards should be clickable

- [ ] **Product List** (`/product-list.html`):
  - All products should load
  - Search functionality works
  - Category filter works
  - Click product card → goes to detail page

- [ ] **Product Detail** (`/product-detail.html?id=1`):
  - Product images display
  - Variant selection works (if available)
  - Quantity selector works
  - "Add to Cart" button works

#### ✅ Cart
- [ ] **Cart Page** (`/cart.html`):
  - Added products appear
  - Quantity increase/decrease works
  - Remove item works
  - Total calculation is correct
  - "Proceed to Checkout" button works

#### ✅ Checkout
- [ ] **Checkout** (`/checkout.html`):
  - Shipping form displays
  - Apply coupon works
  - Order summary updates
  - Place order works → redirects to payment

#### ✅ Payment
- [ ] **Payment** (`/payment.html`):
  - UPI QR code displays (if endpoint returns it)
  - Payment reference input works
  - Submit payment → redirects to success page

#### ✅ Order Success
- [ ] **Order Success** (`/order-success.html`):
  - Success message displays
  - Order ID shows (if passed in URL)

### Admin Side Testing

#### ✅ Admin Authentication
- [ ] **Admin Login** (`/admin/login.html`):
  - Enter admin credentials
  - Should redirect to dashboard

#### ✅ Admin Dashboard
- [ ] **Dashboard** (`/admin/dashboard.html`):
  - Stats display (orders, products, sales)
  - Recent orders table shows

#### ✅ Product Management
- [ ] **Products List** (`/admin/products.html`):
  - All products display in table
  - Edit button works → goes to edit page
  - Delete button works (with confirmation)

- [ ] **Add Product** (`/admin/add-product.html`):
  - Form submission works
  - Image upload works
  - Variants can be added
  - Redirects to products list after success

- [ ] **Edit Product** (`/admin/edit-product.html?id=1`):
  - Product data loads in form
  - Updates work
  - New images can be added

#### ✅ Order Management
- [ ] **Orders List** (`/admin/orders.html`):
  - All orders display
  - "Mark as Paid" button works
  - Order status updates

## Common Issues & Solutions

### Issue: CORS Errors
**Solution**: Add CORS headers in Django settings:
```python
CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
]
```

### Issue: 401 Unauthorized
**Solution**: 
- Check if tokens are stored in localStorage
- Verify API_BASE URL is correct
- Check Django JWT authentication settings

### Issue: Images Not Loading
**Solution**: 
- Check image paths are correct
- Verify backend serves images correctly
- Check CORS for image requests

### Issue: API Endpoints Not Found (404)
**Solution**:
- Verify Django URLs match exactly
- Check Django server is running
- Verify API_BASE URL has correct port

## Testing with Browser DevTools

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Check API calls:
   - Should have correct headers (Authorization: Bearer token)
   - Should return 200 status codes
   - Check response data

### Check Console for Errors
1. Open DevTools Console
2. Look for JavaScript errors
3. Check for API errors

### Check localStorage
1. DevTools → Application tab → Local Storage
2. Verify `access` and `refresh` tokens are stored
3. Tokens should update after login

## Manual Test Flow

1. **User Journey**:
   - Sign up → Login → Browse products → Add to cart → Checkout → Payment → Success

2. **Admin Journey**:
   - Admin login → Dashboard → View products → Add product → View orders → Mark order as paid

## API Endpoint Verification

Make sure these endpoints exist in your Django backend:
- POST `/api/auth/register/`
- POST `/api/auth/login/`
- GET `/api/auth/me/`
- POST `/api/auth/admin/login/`
- GET `/api/auth/admin/me/`
- GET `/api/products/categories/`
- GET `/api/products/`
- GET `/api/products/<id>/`
- GET `/api/cart/`
- POST `/api/cart/`
- PATCH `/api/cart/<item_id>/`
- DELETE `/api/cart/<item_id>/`
- POST `/api/offers/apply-coupon/`
- POST `/api/orders/checkout/`
- POST `/api/orders/confirm-payment/`
- GET `/api/orders/my/`
- GET `/api/payments/upi/`

## Notes

- Replace `YOUR_BACKEND_URL` in `api.js` before testing
- Ensure Django backend is running and accessible
- Check browser console for any JavaScript errors
- Verify CORS settings allow frontend origin









