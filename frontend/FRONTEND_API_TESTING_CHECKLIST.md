# Frontend API Testing Checklist

## 🎯 Overview

This checklist ensures all frontend API calls correctly connect to the deployed Render backend and handle errors gracefully.

---

## ✅ Pre-Testing Setup

### 1. Verify Backend URL Configuration

- [ ] Check `frontend/assets/js/api.js` - Should default to `https://myshp-backend.onrender.com/api`
- [ ] Check `frontend/index.html` - Should set `PRODUCTION_API_URL` to Render backend
- [ ] Verify backend is deployed and accessible: `https://myshp-backend.onrender.com/api/`

### 2. Verify CORS Configuration

- [ ] Backend CORS includes frontend domain
- [ ] Test CORS from browser console:
  ```javascript
  fetch('https://myshp-backend.onrender.com/api/products/')
    .then(r => r.json())
    .then(console.log)
    .catch(console.error);
  ```
- [ ] Should return products without CORS errors

---

## 📦 Product Loading Tests

### Test 1: Homepage Products
**Page:** `/index.html` or `/pages/index.html`

- [ ] **Men's Products Section:**
  - Products load and display
  - Product cards show images, titles, prices
  - "VIEW DETAILS" buttons work
  - If no products: Shows "No products found" (not error message)

- [ ] **Women's Products Section:**
  - Products load and display
  - Product cards show images, titles, prices
  - "VIEW DETAILS" buttons work
  - If no products: Shows "No products found" (not error message)

- [ ] **Banners Section:**
  - Banners load and display
  - Banner images show correctly
  - If no banners: Section doesn't break

**Expected Behavior:**
- ✅ Products load successfully
- ✅ Empty state shows "No products found" (user-friendly)
- ✅ No long error messages visible to users
- ✅ Console shows API calls to Render backend

---

### Test 2: Men's Collection Page
**Page:** `/pages/men.html`

- [ ] Page loads without errors
- [ ] Products filtered by gender=MEN display
- [ ] Product cards render correctly
- [ ] Images load from backend
- [ ] Clicking "VIEW DETAILS" navigates to product detail

**Error Handling:**
- [ ] If backend unavailable: Shows "No products found" (not connection error)
- [ ] If no products: Shows "No products found"
- [ ] Network errors handled gracefully

**API Call Verified:**
```javascript
GET https://myshp-backend.onrender.com/api/products/?gender=MEN&expand_by_color=false&_t=<timestamp>
```

---

### Test 3: Women's Collection Page
**Page:** `/pages/women.html`

- [ ] Page loads without errors
- [ ] Products filtered by gender=WOMEN display
- [ ] Product cards render correctly
- [ ] Images load from backend
- [ ] Clicking "VIEW DETAILS" navigates to product detail

**Error Handling:**
- [ ] If backend unavailable: Shows "No products found"
- [ ] If no products: Shows "No products found"

**API Call Verified:**
```javascript
GET https://myshp-backend.onrender.com/api/products/?gender=WOMEN&expand_by_color=false&_t=<timestamp>
```

---

### Test 4: Product Detail Page
**Page:** `/pages/product_detail.html?id=<product_id>`

- [ ] Product details load correctly
- [ ] Product images display
- [ ] Product title, description, price show
- [ ] Size and color selectors work (if variants exist)
- [ ] Quantity selector works
- [ ] "Add to Cart" button works

**Error Handling:**
- [ ] Invalid product ID: Shows "Product not found"
- [ ] Backend unavailable: Shows "Product not found" (user-friendly)
- [ ] No long error messages

**API Call Verified:**
```javascript
GET https://myshp-backend.onrender.com/api/products/id/<id>/?_t=<timestamp>
```

---

## 🛒 Cart Tests

### Test 5: Add to Cart
**Page:** `/pages/product_detail.html`

- [ ] Select product variant (size/color)
- [ ] Set quantity
- [ ] Click "Add to Cart"
- [ ] Success message appears
- [ ] Redirects to cart page
- [ ] Cart shows added product

**API Call Verified:**
```javascript
POST https://myshp-backend.onrender.com/api/cart/add
Body: { variant_id: <id>, quantity: <number> }
```

---

### Test 6: View Cart
**Page:** `/pages/cart.html`

- [ ] Cart items load correctly
- [ ] Product images display
- [ ] Product details show (title, size, color, price)
- [ ] Quantities display correctly
- [ ] Total amount calculates correctly
- [ ] "Checkout" button works

**Error Handling:**
- [ ] Empty cart: Shows "Your cart is empty"
- [ ] Backend unavailable: Shows "Unable to load cart. Please refresh the page."
- [ ] No long error messages

**API Call Verified:**
```javascript
GET https://myshp-backend.onrender.com/api/cart/
```

---

### Test 7: Update Cart
**Page:** `/pages/cart.html`

- [ ] Change quantity of item
- [ ] Cart updates correctly
- [ ] Total recalculates
- [ ] Changes persist

**API Call Verified:**
```javascript
PATCH https://myshp-backend.onrender.com/api/cart/update
Body: { item_id: <id>, quantity: <number> }
```

---

### Test 8: Remove from Cart
**Page:** `/pages/cart.html`

- [ ] Click "Remove" on item
- [ ] Item removed from cart
- [ ] Cart updates correctly
- [ ] Total recalculates

**API Call Verified:**
```javascript
DELETE https://myshp-backend.onrender.com/api/cart/remove/<id>
```

---

## 🔐 Login Tests

### Test 9: User Login
**Page:** Backend login page (redirected from frontend)

- [ ] Click "Login" in navigation menu
- [ ] Redirects to: `https://myshp-backend.onrender.com/login/`
- [ ] Login form displays
- [ ] Enter credentials and submit
- [ ] Login successful
- [ ] Redirects back to original page
- [ ] JWT tokens stored in localStorage
- [ ] Navigation shows "Logout" button

**API Call Verified:**
```javascript
POST https://myshp-backend.onrender.com/api/auth/login
Body: { username: <username>, password: <password> }
```

---

### Test 10: User Registration
**Page:** Backend signup page

- [ ] Click "Create Account" on login page
- [ ] Redirects to: `https://myshp-backend.onrender.com/signup/`
- [ ] Signup form displays
- [ ] Fill form and submit
- [ ] Account created successfully
- [ ] User logged in automatically
- [ ] Redirects to homepage

---

### Test 11: Checkout Authentication
**Page:** `/pages/checkout.html`

- [ ] **Without Login:**
  - Try to access checkout
  - Redirects to login page
  - After login, returns to checkout
  - Cart preserved

- [ ] **With Login:**
  - Access checkout directly
  - Form displays
  - Can place order

**API Call Verified:**
```javascript
POST https://myshp-backend.onrender.com/api/orders/checkout
Headers: { Authorization: Bearer <token> }
Body: { name, email, phone_number, address, ... }
```

---

## 📋 Categories Tests

### Test 12: Categories Loading
**Page:** Any page that loads categories

- [ ] Categories load from backend
- [ ] Categories display correctly
- [ ] If no categories: Handles gracefully (no error)

**API Call Verified:**
```javascript
GET https://myshp-backend.onrender.com/api/categories/
```

---

## 🎨 Banners Tests

### Test 13: Banners Loading
**Page:** `/index.html` (homepage)

- [ ] Banners load from backend
- [ ] Banner images display correctly
- [ ] Banner links work (if configured)
- [ ] If no banners: Section doesn't break

**API Call Verified:**
```javascript
GET https://myshp-backend.onrender.com/api/banners/
```

---

## 🔍 Error Handling Tests

### Test 14: Backend Unavailable
**Scenario:** Backend service is sleeping or down

- [ ] **Products Page:**
  - Shows "No products found" (not connection error)
  - No long error messages
  - Page doesn't break

- [ ] **Cart Page:**
  - Shows "Unable to load cart. Please refresh the page."
  - No technical error messages

- [ ] **Product Detail:**
  - Shows "Product not found."
  - No connection error details

---

### Test 15: Network Errors
**Scenario:** Network connection issues

- [ ] All pages handle network errors gracefully
- [ ] User-friendly error messages shown
- [ ] No technical error details exposed
- [ ] Console logs errors for debugging (but not shown to users)

---

### Test 16: 404 Errors
**Scenario:** Invalid product ID or endpoint

- [ ] Product detail with invalid ID: Shows "Product not found"
- [ ] No 404 error messages shown to users
- [ ] Handled gracefully

---

### Test 17: 401 Errors (Unauthorized)
**Scenario:** Token expired or invalid

- [ ] Tokens cleared automatically
- [ ] User redirected to login if needed
- [ ] No "Unauthorized" error shown to users

---

## 🌐 CORS Verification

### Test 18: CORS Headers
**Check in Browser DevTools:**

- [ ] Open Network tab
- [ ] Make API request from frontend
- [ ] Check response headers:
  - `Access-Control-Allow-Origin` includes frontend domain
  - `Access-Control-Allow-Methods` includes GET, POST, PUT, DELETE
  - `Access-Control-Allow-Headers` includes Authorization, Content-Type

**Expected:**
```
Access-Control-Allow-Origin: https://myshp-frontend.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: authorization, content-type
```

---

## 📊 API Base URL Verification

### Test 19: Verify All API Calls Use Correct Base URL

**Check Browser Console:**

- [ ] All API calls use: `https://myshp-backend.onrender.com/api`
- [ ] No calls to `http://localhost` or `http://127.0.0.1` (unless local development)
- [ ] Cache-busting timestamps added to GET requests

**Expected Pattern:**
```
https://myshp-backend.onrender.com/api/products/?gender=MEN&_t=1234567890
```

---

## ✅ Final Verification

### Test 20: End-to-End Flow

1. [ ] **Browse Products:**
   - Homepage loads products
   - Men's page loads products
   - Women's page loads products

2. [ ] **View Product:**
   - Click product → Detail page loads
   - Product information displays

3. [ ] **Add to Cart:**
   - Select variant
   - Add to cart
   - Cart updates

4. [ ] **Checkout:**
   - Go to checkout
   - Login if needed
   - Place order

5. [ ] **Verify:**
   - All API calls successful
   - No CORS errors
   - No user-facing error messages
   - Console shows correct API URLs

---

## 🐛 Common Issues & Solutions

### Issue: "Failed to fetch" Errors
**Solution:**
- Check backend is deployed and accessible
- Verify CORS configuration
- Check network connection

### Issue: CORS Errors
**Solution:**
- Verify `CORS_ALLOWED_ORIGINS` in backend includes frontend URL
- Check backend logs for CORS errors
- Verify frontend domain matches backend CORS config

### Issue: Products Not Loading
**Solution:**
- Check backend API: `https://myshp-backend.onrender.com/api/products/`
- Verify products exist in database
- Check browser console for errors
- Verify API base URL is correct

### Issue: Long Error Messages
**Solution:**
- Error handling updated to show user-friendly messages
- Check `api.js` error handling
- Verify all catch blocks use friendly messages

---

## 📝 Testing Notes

- **Backend URL:** `https://myshp-backend.onrender.com/api`
- **Frontend URL:** `https://myshp-frontend.vercel.app` (or localhost for testing)
- **CORS:** Configured in backend settings
- **Error Handling:** User-friendly messages, technical details in console only

---

## ✅ Checklist Summary

- [ ] All product pages load correctly
- [ ] Cart functionality works
- [ ] Login/registration works
- [ ] Checkout requires authentication
- [ ] Error handling is user-friendly
- [ ] CORS configured correctly
- [ ] All API calls use Render backend URL
- [ ] No long error messages shown to users
- [ ] Empty states handled gracefully
- [ ] Network errors handled gracefully

---

**Status:** ✅ Ready for Testing
**Last Updated:** After frontend API fixes

