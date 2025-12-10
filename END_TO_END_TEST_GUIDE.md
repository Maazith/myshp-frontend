# End-to-End Test Guide - EdithCloths E-commerce Platform

## Overview
This document provides a comprehensive testing guide for both user-side and admin-side functionality.

---

## 🛒 USER SIDE TESTING

### 1. Homepage (`/index.html` or `/`)
**Test Steps:**
- [ ] Page loads without errors
- [ ] Logo and navigation display correctly
- [ ] Featured products/banners display
- [ ] Navigation links work (Men, Women, Cart, etc.)
- [ ] Footer displays correctly

**Expected Result:** Clean homepage with working navigation

---

### 2. Browse Products (`/pages/men.html`, `/pages/women.html`)
**Test Steps:**
- [ ] Navigate to Men's page
- [ ] Products display correctly
- [ ] Product images load
- [ ] Product prices display
- [ ] "VIEW DETAILS" buttons work
- [ ] Navigate to Women's page
- [ ] Same checks apply

**Expected Result:** Products list displays correctly for each gender

---

### 3. Product Detail (`/pages/product_detail.html?id=X`)
**Test Steps:**
- [ ] Click on a product
- [ ] Product details load (title, description, price)
- [ ] Product images display
- [ ] Size/Color selectors work (if variants exist)
- [ ] Quantity selector works
- [ ] "Add to Cart" button works
- [ ] Product added to cart successfully

**Expected Result:** Product details display and can be added to cart

---

### 4. Cart (`/pages/cart.html`)
**Test Steps:**
- [ ] View cart page
- [ ] Added products appear in cart
- [ ] Product details correct (name, price, quantity)
- [ ] Update quantity works
- [ ] Remove item works
- [ ] Total calculation correct
- [ ] "Proceed to Checkout" button works

**Expected Result:** Cart displays correctly with all functionality

---

### 5. User Registration (`/signup/` - Backend URL)
**Test Steps:**
- [ ] Navigate to signup page
- [ ] Fill registration form:
  - Username
  - Email
  - Password
- [ ] Submit form
- [ ] Account created successfully
- [ ] Redirected to homepage
- [ ] User logged in automatically

**Expected Result:** User account created and logged in

---

### 6. User Login (`/login/` - Backend URL)
**Test Steps:**
- [ ] Navigate to login page
- [ ] Enter username and password
- [ ] Submit form
- [ ] Login successful
- [ ] Redirected appropriately
- [ ] User session active

**Expected Result:** User logged in successfully

---

### 7. Checkout Flow (`/pages/checkout.html`)
**Test Steps:**
- [ ] Add products to cart
- [ ] Navigate to checkout
- [ ] **If NOT logged in:**
  - Redirected to login page
  - After login, redirected back to checkout
  - Cart preserved
- [ ] **If logged in:**
  - Checkout form displays
  - Fill shipping address:
    - Name *
    - Email *
    - Phone Number *
    - Address *
    - Street Name *
    - City/Town *
    - District *
    - PIN Code *
  - Submit form
  - Order created successfully
  - Redirected to payment page

**Expected Result:** Checkout works with authentication check

---

### 8. Payment (`/pages/payment.html`)
**Test Steps:**
- [ ] Payment page loads
- [ ] Order details display
- [ ] UPI QR code displays (if configured)
- [ ] Payment reference input works
- [ ] Payment proof upload works (optional)
- [ ] Submit payment
- [ ] Redirected to success page

**Expected Result:** Payment page functional

---

### 9. Order Success (`/pages/order_success.html`)
**Test Steps:**
- [ ] Success page displays
- [ ] Order confirmation message shows
- [ ] Order number displayed
- [ ] Can navigate back to homepage

**Expected Result:** Order confirmation displayed

---

## 👨‍💼 ADMIN SIDE TESTING

### 1. Admin Login (`/admin/login.html`)
**Test Steps:**
- [ ] Navigate to admin login
- [ ] Enter admin credentials (user with `is_staff=True`)
- [ ] Submit form
- [ ] Login successful
- [ ] Redirected to dashboard
- [ ] JWT tokens stored in localStorage

**Expected Result:** Admin logged in successfully

---

### 2. Admin Dashboard (`/admin/dashboard.html`)
**Test Steps:**
- [ ] Dashboard loads
- [ ] Statistics display:
  - Total Orders
  - Pending Orders
  - Completed Orders
  - Total Revenue
- [ ] Recent orders list displays
- [ ] Navigation works

**Expected Result:** Dashboard displays all stats correctly

---

### 3. Products Management (`/admin/products.html`)
**Test Steps:**
- [ ] Products list displays
- [ ] All products visible
- [ ] Product details correct
- [ ] "Add Product" button works
- [ ] "Edit" button works
- [ ] "Delete" button works
- [ ] Success message appears after product creation

**Expected Result:** Products management functional

---

### 4. Add Product (`/admin/product-add.html`)
**Test Steps:**
- [ ] Navigate to add product page
- [ ] Fill product form:
  - Title *
  - Description *
  - Gender (Men/Women/Unisex) *
  - Base Price *
  - Hero Image (optional)
  - Active checkbox
- [ ] Submit form
- [ ] Success message: "✅ Product created successfully!"
- [ ] Redirected to products page
- [ ] Success banner appears on products page
- [ ] New product appears in list

**Expected Result:** Product created successfully with success message

---

### 5. Edit Product (`/admin/product-edit.html?id=X`)
**Test Steps:**
- [ ] Click "Edit" on a product
- [ ] Product data loads in form
- [ ] Make changes
- [ ] Submit form
- [ ] Product updated successfully
- [ ] Redirected to products page

**Expected Result:** Product editing works

---

### 6. Orders Management (`/admin/orders.html`)
**Test Steps:**
- [ ] Orders list displays
- [ ] All orders visible
- [ ] Order details show:
  - Order Number
  - Customer Username
  - Order Date
  - Total Amount
  - Status
- [ ] "View Details" button works
- [ ] Orders linked to users correctly

**Expected Result:** Orders display with user information

---

### 7. Order Detail (`/admin/order-detail.html?id=X`)
**Test Steps:**
- [ ] Click "View Details" on an order
- [ ] Order detail page loads
- [ ] Customer information displays:
  - Customer Name
  - Email
  - Phone Number
  - **Account Username** (from user account)
- [ ] Shipping address displays
- [ ] Order items display
- [ ] Payment proof displays (if uploaded)
- [ ] Status can be updated
- [ ] Update status works

**Expected Result:** Order details show complete user information

---

### 8. Users Management (`/admin/users.html`) - NEW
**Test Steps:**
- [ ] Navigate to Users page
- [ ] All registered users display
- [ ] User information shows:
  - Username
  - Email
  - Join Date
  - User ID
  - Admin status (if admin)
- [ ] Total users count displays
- [ ] Admin users marked clearly

**Expected Result:** All registered users visible in admin panel

---

### 9. Admin Logout
**Test Steps:**
- [ ] Click "Logout" in admin navbar
- [ ] All auth tokens cleared
- [ ] Redirected to login page
- [ ] Cannot access admin pages without login

**Expected Result:** Logout works correctly

---

## 🔄 INTEGRATION TESTING

### Complete User Journey
1. **Browse** → Visit homepage, browse products
2. **Add to Cart** → Add multiple products to cart
3. **Register** → Create new user account
4. **Login** → Login with credentials
5. **Checkout** → Complete checkout form
6. **Payment** → Submit payment details
7. **Success** → View order confirmation

### Complete Admin Journey
1. **Login** → Admin login
2. **Create Product** → Add new product
3. **View Orders** → Check new order appears
4. **View Order Detail** → See customer information
5. **View Users** → See registered user in users list
6. **Update Order** → Mark order as paid/update status

---

## ✅ VERIFICATION CHECKLIST

### User Authentication
- [ ] User registration works
- [ ] User login works
- [ ] User logout works
- [ ] Session persists across pages
- [ ] Checkout requires login
- [ ] Cart preserved after login

### Product Management
- [ ] Products display on user pages
- [ ] Products can be added to cart
- [ ] Products refresh after backend changes
- [ ] Admin can create products
- [ ] Admin can edit products
- [ ] Admin can delete products
- [ ] Success messages display

### Order Management
- [ ] Orders can be placed
- [ ] Orders linked to user accounts
- [ ] Admin can view all orders
- [ ] Admin can see user details in orders
- [ ] Order status can be updated
- [ ] Payment verification works

### User Management
- [ ] Admin can view all users
- [ ] User details display correctly
- [ ] User registration date shows
- [ ] Admin users marked clearly

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue: Products not showing after creation
**Solution:** 
- Check cache-busting is enabled
- Verify product is marked as `is_active=True`
- Check browser console for API errors

### Issue: User login not working
**Solution:**
- Check backend login endpoint (`/login/`)
- Verify JWT tokens are stored in localStorage
- Check browser console for errors

### Issue: Checkout redirects incorrectly
**Solution:**
- Verify authentication check in checkout.js
- Check redirect URL construction
- Ensure tokens are passed correctly

### Issue: Admin can't see users
**Solution:**
- Verify `/api/users/` endpoint exists
- Check admin has `is_staff=True`
- Verify Users page exists and loads

---

## 📝 TEST DATA CREATION

### Create Test Products (via Admin)
1. Login as admin
2. Go to Products → Add Product
3. Create products:
   - Product 1: "Test T-Shirt", Men, ₹500
   - Product 2: "Test Hoodie", Women, ₹1200
   - Product 3: "Test Jeans", Unisex, ₹2000

### Create Test User (via Frontend)
1. Navigate to `/signup/`
2. Register:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `testpass123`

### Create Test Order
1. Login as test user
2. Add products to cart
3. Go to checkout
4. Fill shipping address
5. Complete order
6. Submit payment

---

## 🎯 SUCCESS CRITERIA

All tests should pass:
- ✅ User can browse and purchase products
- ✅ User authentication works end-to-end
- ✅ Admin can manage products
- ✅ Admin can view orders
- ✅ Admin can see user details in orders
- ✅ Admin can view all registered users
- ✅ All success messages display
- ✅ All error handling works
- ✅ Cache-busting ensures fresh data

---

## 📞 SUPPORT

If any test fails:
1. Check browser console for errors
2. Check network tab for failed requests
3. Verify backend is running
4. Check API endpoints are correct
5. Verify database has test data

---

**Last Updated:** $(date)
**Version:** 1.0

