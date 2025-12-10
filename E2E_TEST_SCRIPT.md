# End-to-End Test Script - Complete Testing Guide

## 🎯 Test Execution Order

Follow these tests in order to verify the complete system.

---

## PHASE 1: ADMIN SETUP & PRODUCT CREATION

### Test 1.1: Admin Login
**Steps:**
1. Navigate to `/admin/login.html`
2. Enter admin credentials (username with `is_staff=True`)
3. Click "Login"

**Expected:**
- ✅ Login successful
- ✅ Redirected to `/admin/dashboard.html`
- ✅ JWT tokens stored in localStorage (`edithcloths_token`, `edithcloths_refresh`, `edithcloths_user`)
- ✅ Admin navbar visible

**Verify:**
```javascript
// In browser console:
localStorage.getItem('edithcloths_token') // Should return token
localStorage.getItem('edithcloths_user') // Should return user object with is_staff: true
```

---

### Test 1.2: Create Test Products
**Steps:**
1. Navigate to `/admin/products.html`
2. Click "Add Product"
3. Fill form:
   - Title: "Test T-Shirt"
   - Description: "A test product for E2E testing"
   - Gender: "Men"
   - Base Price: 500
   - Hero Image: Upload an image
   - Active: Checked
4. Click "Create Product"

**Expected:**
- ✅ Success message: "✅ Product created successfully! Redirecting..."
- ✅ Redirected to `/admin/products.html`
- ✅ Success banner appears: "✅ Product created successfully!"
- ✅ New product appears in products list

**Repeat for:**
- Product 2: "Test Hoodie", Women, ₹1200
- Product 3: "Test Jeans", Unisex, ₹2000

**Verify:**
- All products visible in `/admin/products.html`
- Products appear on user pages (`/pages/men.html`, `/pages/women.html`)

---

### Test 1.3: Verify Products on User Pages
**Steps:**
1. Navigate to `/pages/men.html`
2. Check products display
3. Navigate to `/pages/women.html`
4. Check products display

**Expected:**
- ✅ Test T-Shirt visible on Men's page
- ✅ Test Hoodie visible on Women's page
- ✅ Test Jeans visible on both pages (Unisex)
- ✅ Product images load correctly
- ✅ Prices display correctly
- ✅ "VIEW DETAILS" buttons work

---

## PHASE 2: USER REGISTRATION & AUTHENTICATION

### Test 2.1: User Registration
**Steps:**
1. Navigate to backend signup page: `https://your-backend-url.com/signup/`
2. Fill registration form:
   - Username: `testuser123`
   - Email: `testuser@example.com`
   - Password: `testpass123`
3. Submit form

**Expected:**
- ✅ Account created successfully
- ✅ User logged in automatically
- ✅ Redirected to homepage
- ✅ User session active

**Verify:**
- Check backend admin panel → Users page
- User `testuser123` should appear in users list

---

### Test 2.2: User Login
**Steps:**
1. Logout if logged in
2. Navigate to backend login: `https://your-backend-url.com/login/`
3. Enter credentials:
   - Username: `testuser123`
   - Password: `testpass123`
4. Submit form

**Expected:**
- ✅ Login successful
- ✅ Redirected appropriately
- ✅ User session active

---

## PHASE 3: SHOPPING CART FLOW

### Test 3.1: Browse Products
**Steps:**
1. Navigate to `/pages/men.html`
2. View products
3. Click "VIEW DETAILS" on "Test T-Shirt"

**Expected:**
- ✅ Product detail page loads
- ✅ Product information displays correctly
- ✅ Images load
- ✅ Price displays correctly

---

### Test 3.2: Add to Cart
**Steps:**
1. On product detail page
2. Select size/color (if variants exist)
3. Set quantity: 2
4. Click "Add to Cart"

**Expected:**
- ✅ Product added to cart
- ✅ Cart count updates (if visible)
- ✅ Success message or visual feedback

---

### Test 3.3: View Cart
**Steps:**
1. Navigate to `/pages/cart.html`
2. View cart contents

**Expected:**
- ✅ Added products appear in cart
- ✅ Quantities correct
- ✅ Prices correct
- ✅ Total calculation correct
- ✅ "Proceed to Checkout" button visible

---

### Test 3.4: Update Cart
**Steps:**
1. On cart page
2. Change quantity of an item
3. Remove an item

**Expected:**
- ✅ Quantity updates correctly
- ✅ Total recalculates
- ✅ Item removal works
- ✅ Cart persists

---

## PHASE 4: CHECKOUT & ORDER PLACEMENT

### Test 4.1: Checkout Without Login
**Steps:**
1. Ensure user is logged out
2. Add items to cart
3. Navigate to `/pages/checkout.html`

**Expected:**
- ✅ Redirected to backend login page: `/login/?next=...`
- ✅ Cart preserved

---

### Test 4.2: Checkout With Login
**Steps:**
1. Login as `testuser123`
2. Navigate to `/pages/checkout.html`
3. Fill checkout form:
   - Name: "Test User"
   - Email: "testuser@example.com"
   - Phone: "9876543210"
   - Address: "123 Test Street"
   - Street Name: "Test Road"
   - City/Town: "Test City"
   - District: "Test District"
   - PIN Code: "123456"
4. Click "Place Order"

**Expected:**
- ✅ Order created successfully
- ✅ Redirected to `/pages/payment.html`
- ✅ Order ID and amount displayed
- ✅ Cart cleared

**Verify:**
- Check admin panel → Orders
- Order should appear with user `testuser123`

---

### Test 4.3: Payment Submission
**Steps:**
1. On payment page
2. Enter payment reference: "TEST123456"
3. Upload payment proof (optional)
4. Submit payment

**Expected:**
- ✅ Payment submitted successfully
- ✅ Redirected to order success page
- ✅ Order confirmation displayed

---

## PHASE 5: ADMIN ORDER MANAGEMENT

### Test 5.1: View Orders
**Steps:**
1. As admin, navigate to `/admin/orders.html`
2. View orders list

**Expected:**
- ✅ All orders display
- ✅ Order from `testuser123` visible
- ✅ Order details show:
  - Order Number
  - Customer Username (`testuser123`)
  - Order Date
  - Total Amount
  - Status

---

### Test 5.2: View Order Detail
**Steps:**
1. Click "View Details" on the test order
2. View order detail page

**Expected:**
- ✅ Order detail loads correctly
- ✅ Customer Information shows:
  - Customer Name: "Test User"
  - Email: "testuser@example.com"
  - Phone: "9876543210"
  - **Account Username: `testuser123`** ✅
- ✅ Shipping address displays correctly
- ✅ Order items display correctly
- ✅ Payment proof displays (if uploaded)

---

### Test 5.3: Update Order Status
**Steps:**
1. On order detail page
2. Change status dropdown to "PAYMENT_VERIFIED"
3. Click "Update Status"

**Expected:**
- ✅ Status updates successfully
- ✅ Success message appears
- ✅ Order status changes

---

## PHASE 6: ADMIN USER MANAGEMENT

### Test 6.1: View All Users
**Steps:**
1. Navigate to `/admin/users.html`
2. View users list

**Expected:**
- ✅ All registered users display
- ✅ `testuser123` appears in list
- ✅ User details show:
  - Username: `testuser123`
  - Email: `testuser@example.com`
  - Join Date
  - User ID
  - Admin status (should be "Regular User")

---

### Test 6.2: Verify User in Order
**Steps:**
1. Go back to Orders
2. View order detail
3. Verify user information matches

**Expected:**
- ✅ Order shows correct user
- ✅ User details match Users page
- ✅ User can be traced from order to user account

---

## PHASE 7: PRODUCT MANAGEMENT

### Test 7.1: Edit Product
**Steps:**
1. Navigate to `/admin/products.html`
2. Click "Edit" on "Test T-Shirt"
3. Change price to ₹600
4. Update product

**Expected:**
- ✅ Product updated successfully
- ✅ Redirected to products list
- ✅ Updated price reflects on user pages

---

### Test 7.2: Delete Product
**Steps:**
1. On products page
2. Click "Delete" on a test product
3. Confirm deletion

**Expected:**
- ✅ Product deleted successfully
- ✅ Product removed from list
- ✅ Product no longer appears on user pages

---

## PHASE 8: VERIFICATION CHECKS

### Test 8.1: Cache Busting
**Steps:**
1. Create a new product in admin
2. Immediately check user pages

**Expected:**
- ✅ New product appears immediately
- ✅ No caching issues
- ✅ Fresh data loads

---

### Test 8.2: Admin Logout
**Steps:**
1. As admin, click "Logout"
2. Try to access admin pages

**Expected:**
- ✅ Logout successful
- ✅ Tokens cleared
- ✅ Redirected to login
- ✅ Cannot access admin pages without login

---

## PHASE 9: COMPLETE USER JOURNEY

### Full Flow Test:
1. ✅ **Admin**: Login → Create Products → View Products
2. ✅ **User**: Register → Login → Browse Products
3. ✅ **User**: Add to Cart → View Cart → Update Cart
4. ✅ **User**: Checkout (requires login) → Fill Address → Place Order
5. ✅ **User**: Submit Payment → View Order Success
6. ✅ **Admin**: View Orders → View Order Detail → See User Info
7. ✅ **Admin**: View Users → Verify User Appears
8. ✅ **Admin**: Update Order Status → Verify Update

---

## ✅ VERIFICATION CHECKLIST

### Authentication
- [ ] Admin login works
- [ ] User registration works
- [ ] User login works
- [ ] Logout works (both admin and user)
- [ ] Session persists correctly
- [ ] Checkout requires authentication

### Products
- [ ] Products can be created
- [ ] Products display on user pages
- [ ] Products can be edited
- [ ] Products can be deleted
- [ ] Success messages show
- [ ] Products refresh after changes

### Cart
- [ ] Add to cart works
- [ ] Cart displays correctly
- [ ] Update quantity works
- [ ] Remove item works
- [ ] Cart persists across pages
- [ ] Cart preserved after login

### Orders
- [ ] Orders can be placed
- [ ] Orders linked to user accounts
- [ ] Admin can view all orders
- [ ] Admin can view order details
- [ ] User information shows in orders
- [ ] Order status can be updated

### Users
- [ ] Admin can view all users
- [ ] User details display correctly
- [ ] Users linked to orders correctly

### Navigation
- [ ] All admin pages accessible
- [ ] Navigation links work
- [ ] URLs resolve correctly
- [ ] No 404 errors

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue: Products not showing after creation
**Check:**
- Product `is_active` is True
- Cache-busting is working
- API endpoint returns products
- Browser console for errors

### Issue: User login not working
**Check:**
- Backend login endpoint accessible
- JWT tokens stored in localStorage
- API base URL correct
- CORS configured

### Issue: Checkout redirects incorrectly
**Check:**
- Authentication check in checkout.js
- Redirect URL construction
- Token passing in URL

### Issue: Order detail not loading
**Check:**
- `/api/orders/<id>/` endpoint exists
- Order ID is correct
- Admin authentication valid

---

## 📊 TEST RESULTS TEMPLATE

```
Date: ___________
Tester: ___________

PHASE 1: Admin Setup
- [ ] Admin Login: PASS / FAIL
- [ ] Create Products: PASS / FAIL
- [ ] Verify Products: PASS / FAIL

PHASE 2: User Auth
- [ ] User Registration: PASS / FAIL
- [ ] User Login: PASS / FAIL

PHASE 3: Shopping Cart
- [ ] Browse Products: PASS / FAIL
- [ ] Add to Cart: PASS / FAIL
- [ ] View Cart: PASS / FAIL
- [ ] Update Cart: PASS / FAIL

PHASE 4: Checkout
- [ ] Checkout Without Login: PASS / FAIL
- [ ] Checkout With Login: PASS / FAIL
- [ ] Payment Submission: PASS / FAIL

PHASE 5: Admin Orders
- [ ] View Orders: PASS / FAIL
- [ ] View Order Detail: PASS / FAIL
- [ ] Update Status: PASS / FAIL

PHASE 6: Admin Users
- [ ] View Users: PASS / FAIL
- [ ] Verify User in Order: PASS / FAIL

PHASE 7: Product Management
- [ ] Edit Product: PASS / FAIL
- [ ] Delete Product: PASS / FAIL

PHASE 8: Verification
- [ ] Cache Busting: PASS / FAIL
- [ ] Admin Logout: PASS / FAIL

OVERALL STATUS: ✅ PASS / ❌ FAIL
```

---

## 🎯 SUCCESS CRITERIA

All tests should pass:
- ✅ Complete user journey works end-to-end
- ✅ Admin can manage all aspects
- ✅ User authentication works correctly
- ✅ Orders linked to users correctly
- ✅ All admin URLs connected properly
- ✅ No broken links or missing endpoints

---

**Ready for Testing!** 🚀

