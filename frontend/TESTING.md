# Quick Testing Guide

## 🚀 Quick Start (3 Steps)

### Step 1: Update API URL
Open `frontend/assets/js/api.js` and set your Django backend URL:
```javascript
const API_BASE = "http://127.0.0.1:8000"; // Your Django server URL
```

### Step 2: Start Your Django Backend
```bash
python manage.py runserver
```
Backend should run on `http://127.0.0.1:8000`

### Step 3: Open Frontend
Since you're using Live Server (port 5500), just open:
- `http://127.0.0.1:5500/index.html` in your browser

---

## ✅ Quick Test Checklist

### Test User Flow:
1. **Sign Up** → `/signup.html` → Create account
2. **Login** → `/login.html` → Should redirect to home
3. **Browse** → Click "Products" → View product list
4. **View Product** → Click any product → See product details
5. **Add to Cart** → Click "Add to Cart" → Check cart icon badge
6. **Cart** → Go to `/cart.html` → Verify items, change quantities
7. **Checkout** → Click "Proceed to Checkout" → Fill shipping form
8. **Payment** → Submit checkout → See UPI payment page
9. **Complete** → Enter payment reference → Order success

### Test Admin Flow:
1. **Admin Login** → `/admin/login.html` → Login as admin
2. **Dashboard** → View stats and recent orders
3. **Products** → `/admin/products.html` → View all products
4. **Add Product** → Click "Add New Product" → Fill form → Submit
5. **Orders** → `/admin/orders.html` → View orders → Mark as paid

---

## 🔍 Debugging Tips

### Open Browser DevTools (F12)

**Console Tab:**
- Check for JavaScript errors
- Look for API call errors

**Network Tab:**
- Check API requests are going to correct URL
- Verify Authorization headers include Bearer token
- Check response status codes (should be 200, not 401/404)

**Application Tab → Local Storage:**
- Verify `access` and `refresh` tokens are stored after login

---

## ⚠️ Common Issues

### CORS Error
If you see CORS errors, add to your Django `settings.py`:
```python
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    ...
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
]
```

### 401 Unauthorized
- Check if you're logged in (token in localStorage)
- Verify token hasn't expired
- Try logging in again

### Images Not Loading
- Check browser console for 404 errors
- Verify image URLs from backend are correct
- Images will show placeholder on error (this is normal)

---

## 📝 Testing Checklist

- [ ] Homepage loads with categories and products
- [ ] User can sign up
- [ ] User can login
- [ ] Products list loads
- [ ] Product detail page shows images and info
- [ ] Add to cart works
- [ ] Cart shows items correctly
- [ ] Quantity update works
- [ ] Checkout form submits
- [ ] Payment page shows UPI details
- [ ] Admin can login
- [ ] Admin dashboard shows stats
- [ ] Admin can view products
- [ ] Admin can add product
- [ ] Admin can edit product
- [ ] Admin can view orders
- [ ] Admin can mark order as paid

---

## 🎯 Test URLs

**User Pages:**
- Home: `http://127.0.0.1:5500/index.html`
- Login: `http://127.0.0.1:5500/login.html`
- Products: `http://127.0.0.1:5500/product-list.html`
- Cart: `http://127.0.0.1:5500/cart.html`

**Admin Pages:**
- Admin Login: `http://127.0.0.1:5500/admin/login.html`
- Dashboard: `http://127.0.0.1:5500/admin/dashboard.html`
- Products: `http://127.0.0.1:5500/admin/products.html`
- Orders: `http://127.0.0.1:5500/admin/orders.html`

---

**Ready to test!** Just make sure:
1. ✅ Django backend is running
2. ✅ API_BASE URL is set correctly
3. ✅ Frontend is served (Live Server is already running)
4. ✅ Open browser to `http://127.0.0.1:5500/index.html`





