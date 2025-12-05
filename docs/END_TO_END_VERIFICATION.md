# 🔍 End-to-End Project Verification & Testing Guide

## 🎯 Overview

This document provides a comprehensive guide to verify all flows in the EdithCloths e-commerce platform.

## 📋 Pre-Testing Checklist

Before running the simulation, ensure:

- [ ] Django backend is installed and virtual environment is activated
- [ ] Database migrations are applied
- [ ] Demo data is created (optional but recommended)
- [ ] Django development server can start
- [ ] Frontend files are accessible
- [ ] API base URL is configured correctly

## 🚀 Quick Start Testing

### Step 1: Start Django Backend

```bash
cd backend
# Activate virtual environment (Windows)
venv\Scripts\activate
# Or (Linux/Mac)
source venv/bin/activate

# Run migrations
python manage.py migrate

# Create demo data (optional)
python manage.py create_demo_data

# Start server
python manage.py runserver
```

**Expected:** Server should start on `http://127.0.0.1:8000`

### Step 2: Verify Backend is Running

Open in browser or use curl:
- `http://127.0.0.1:8000/api/categories/` - Should return categories list
- `http://127.0.0.1:8000/api/products/` - Should return products list
- `http://127.0.0.1:8000/api/settings/` - Should return site settings

### Step 3: Run Automated Test Script

```bash
# Make sure backend is running first
cd backend
python ../END_TO_END_TEST_SCRIPT.py
```

This will automatically test all API endpoints.

## 📝 Manual Testing Checklist

### ✅ Flow 1: Landing Page

**Test:** Visit landing page
- [ ] Open `frontend/index.html` in browser
- [ ] See EdithCloths logo
- [ ] See "User Login" option
- [ ] See "Admin Login" option
- [ ] Both cards are clickable

**Expected Result:** Landing page shows both login options clearly

---

### ✅ Flow 2: User Registration & Login

**Test:** Create new user account
1. Click "User Login" → Go to login page
2. Click "Register" link
3. Fill registration form:
   - Username
   - Email (optional)
   - Password
   - Confirm Password
4. Submit form

**Expected Result:** 
- User is created
- Redirected to home page
- Token stored in localStorage

**Test:** User Login
1. Go to login page
2. Enter username and password
3. Click "Login"

**Expected Result:**
- Successfully logged in
- Redirected to home page
- Navbar shows user menu

---

### ✅ Flow 3: Browse Products

**Test:** View products
1. After login, see homepage
2. Check banners are displayed
3. View product categories (Men/Women)
4. Click on a product

**Expected Result:**
- Homepage loads with banners
- Product carousels show products
- Can navigate to product detail page

**Test:** Product Detail
1. Click on any product
2. View product images
3. Check product details
4. Select size/color if variants exist
5. Add to cart

**Expected Result:**
- Product details displayed correctly
- Variants selectable
- "Add to Cart" button works

---

### ✅ Flow 4: Shopping Cart

**Test:** Add to Cart
1. Select a product
2. Choose variant (size/color)
3. Set quantity
4. Click "Add to Cart"

**Expected Result:**
- Item added to cart
- Cart icon shows item count
- Success message appears

**Test:** View Cart
1. Click cart icon or go to cart page
2. View cart items
3. Update quantities
4. Remove items

**Expected Result:**
- Cart shows all added items
- Quantities can be updated
- Items can be removed
- Total amount calculated correctly

---

### ✅ Flow 5: Checkout & Payment

**Test:** Checkout Process
1. Go to cart
2. Click "Proceed to Checkout"
3. Enter shipping address
4. Submit checkout form

**Expected Result:**
- Order created
- Redirected to payment page
- Order ID is generated

**Test:** Payment Confirmation
1. On payment page, see:
   - UPI ID (from site settings)
   - QR Code (from site settings)
   - Order details
   - Total amount
2. Enter payment reference ID
3. Upload payment screenshot (optional)
4. Submit payment confirmation

**Expected Result:**
- Payment details saved
- Email sent to admin (`maazith.md@gmail.com`)
- Order status: `PAYMENT_PENDING`
- Redirected to order success page

---

### ✅ Flow 6: Order Management (Admin)

**Test:** Admin Login
1. From landing page, click "Admin Login"
2. Enter admin credentials:
   - Username: `Maazith`
   - Password: `maazith2005`
3. Click "Login"

**Expected Result:**
- Successfully logged in as admin
- Redirected to admin dashboard

**Test:** View Orders
1. Go to Admin Dashboard
2. Click "Orders" in sidebar
3. View all orders list

**Expected Result:**
- All orders displayed
- Order details visible
- Payment status shown

**Test:** Approve Payment
1. Find order with `PAYMENT_PENDING` status
2. View payment proof
3. Click "Mark as Paid" or "Verify Payment"

**Expected Result:**
- Order status changes to `PLACED`
- Payment verified flag set
- Email sent to customer
- Success message displayed

**Test:** Update Order Status
1. Select an order
2. Change status (e.g., SHIPPED, DELIVERED)
3. Save changes

**Expected Result:**
- Order status updated
- Changes reflected immediately

---

### ✅ Flow 7: Product Management (Admin)

**Test:** View Products
1. Go to Admin Dashboard
2. Click "Products"
3. View products list

**Expected Result:**
- All products displayed
- Product details visible
- Can filter/search

**Test:** Add Product
1. Click "Add Product"
2. Fill product form:
   - Title
   - Category
   - Description
   - Base Price
   - Gender
   - Upload image
3. Save product

**Expected Result:**
- Product created
- Default variant auto-created
- Product appears in list
- Image uploaded successfully

**Test:** Edit Product
1. Click on a product
2. Edit details
3. Save changes

**Expected Result:**
- Changes saved
- Updates reflected immediately

**Test:** Delete Product
1. Select a product
2. Click delete
3. Confirm deletion

**Expected Result:**
- Product deleted
- Removed from list

---

### ✅ Flow 8: Banner Management (Admin)

**Test:** View Banners
1. Go to Admin Dashboard
2. Click "Banners"
3. View active banners

**Expected Result:**
- All banners displayed
- Banner details visible

**Test:** Upload Banner
1. Click "Upload Banner"
2. Fill form:
   - Title
   - Subtitle
   - Upload image
   - CTA link (optional)
3. Submit

**Expected Result:**
- Banner created
- Appears on homepage immediately (within 5 seconds)
- Banner image uploaded

**Test:** Delete Banner
1. Select a banner
2. Click delete
3. Confirm

**Expected Result:**
- Banner deleted
- Removed from homepage

---

### ✅ Flow 9: Site Settings (Admin)

**Test:** Update Site Settings
1. Go to Django Admin Panel (`/admin/`)
2. Navigate to "Site Settings"
3. Update:
   - Website Logo
   - Homepage Banner
   - UPI ID
   - QR Code Image
   - Contact Info
   - About Text
4. Save changes

**Expected Result:**
- Settings saved
- Changes reflected on frontend immediately
- Logo updated on all pages
- UPI/QR code updated on payment page

---

### ✅ Flow 10: Email Notifications

**Test:** Payment Confirmation Email (Admin)
1. Customer confirms payment (Flow 5)
2. Check admin email inbox (`maazith.md@gmail.com`)

**Expected Result:**
- Email received with subject: "New Order Payment Confirmation"
- Email contains:
  - Order number
  - Customer details
  - Product list
  - Total amount
  - Payment reference

**Test:** Order Placed Email (Customer)
1. Admin approves payment (Flow 6)
2. Check customer email inbox

**Expected Result:**
- Email received with subject: "Order Placed Successfully"
- Email contains:
  - Order number
  - Status: "ORDER PLACED"
  - Product list
  - Total amount
  - Thank you message

---

### ✅ Flow 11: Order Tracking (User)

**Test:** View My Orders
1. Login as user
2. Click "My Orders" in navbar
3. View order history

**Expected Result:**
- All user orders displayed
- Order status visible
- Order details shown
- Can track order progress

**Test:** Order Status Stages
Verify order statuses:
- PLACED
- PAYMENT_PENDING
- PAYMENT_VERIFIED
- SHIPPED
- OUT_FOR_DELIVERY
- DELIVERED

**Expected Result:**
- Status tracker shows current stage
- Visual progress indicator
- Status updates reflect immediately

---

## 🧪 Automated Test Results

After running `END_TO_END_TEST_SCRIPT.py`, check the results:

### Success Criteria:
- ✅ All authentication tests pass
- ✅ Product endpoints return data
- ✅ Cart functionality works
- ✅ Order creation works
- ✅ Admin functions accessible
- ✅ Email configuration verified

### Common Issues & Solutions:

**Issue:** Tests fail with connection errors
- **Solution:** Ensure Django server is running on port 8000

**Issue:** Authentication tests fail
- **Solution:** Verify superuser exists: `python manage.py createsuperuser`

**Issue:** Cart/Order tests fail
- **Solution:** Ensure products exist in database (run `create_demo_data`)

**Issue:** Email tests fail silently
- **Solution:** Check email configuration in settings.py (console backend for testing)

---

## 📊 Test Coverage Summary

### Backend API Endpoints:
- [x] Authentication (Register, Login, Me)
- [x] Products (List, Detail, Create, Update, Delete)
- [x] Categories (List, Create)
- [x] Cart (View, Add, Update, Remove)
- [x] Orders (Checkout, Confirm Payment, My Orders)
- [x] Admin Orders (List, Mark Paid, Update Status)
- [x] Banners (List, Upload, Delete)
- [x] Site Settings (Get, Update)

### Frontend Pages:
- [x] Landing Page
- [x] Login/Register
- [x] Homepage
- [x] Product Listing
- [x] Product Detail
- [x] Cart
- [x] Checkout
- [x] Payment
- [x] Order Success
- [x] My Orders
- [x] Admin Dashboard
- [x] Admin Products
- [x] Admin Orders
- [x] Admin Banners

### Features:
- [x] User Authentication
- [x] Product Browsing
- [x] Shopping Cart
- [x] Order Placement
- [x] Payment Confirmation
- [x] Email Notifications
- [x] Admin Management
- [x] Order Tracking
- [x] Banner Management
- [x] Site Settings

---

## 🎯 Acceptance Criteria

### ✅ All flows must pass:
1. User can register and login
2. User can browse products
3. User can add items to cart
4. User can checkout and place order
5. User can confirm payment
6. Admin receives email notification
7. Admin can approve payment
8. Customer receives confirmation email
9. Order status updates correctly
10. All admin CRUD operations work

---

## 📝 Next Steps After Testing

1. **Fix any failed tests**
2. **Document issues found**
3. **Update test results**
4. **Deploy to staging (if applicable)**
5. **Set up production email configuration**

---

**Testing Complete!** 🎉

If all tests pass, the system is ready for use. If any tests fail, refer to the error messages and fix the issues before deployment.



