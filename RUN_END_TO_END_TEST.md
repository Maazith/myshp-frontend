# 🚀 End-to-End Project Simulation & Verification Guide

## 📋 Quick Start - Run Complete Simulation

### Step 1: Start Backend Server

Open a terminal and run:
```bash
cd backend
venv\Scripts\activate  # Windows
# OR
source venv/bin/activate  # Linux/Mac

python manage.py runserver
```

**Expected:** Server starts on `http://127.0.0.1:8000`

### Step 2: Verify Backend is Running

Test in browser:
- ✅ `http://127.0.0.1:8000/api/categories/` → Should show categories
- ✅ `http://127.0.0.1:8000/api/products/` → Should show products
- ✅ `http://127.0.0.1:8000/api/settings/` → Should show site settings

### Step 3: Run Automated Tests

Open another terminal:
```bash
# Install requests if needed
pip install requests

# Run test script
python END_TO_END_TEST_SCRIPT.py
```

**Expected:** All tests run and show pass/fail results

## 🔍 Complete Flow Verification

### ✅ Flow 1: Landing Page → Login Options

**Manual Test:**
1. Open `frontend/index.html` in browser
2. Verify you see:
   - ✅ Logo at top
   - ✅ "User Login" card (left)
   - ✅ "Admin Login" card (right)
   - ✅ Both cards are clickable

**Expected:** Landing page clearly shows both login options

---

### ✅ Flow 2: User Registration & Login

**Manual Test:**
1. Click "User Login" → Go to login page
2. Click "Register" link
3. Fill form:
   - Username: `testuser123`
   - Password: `testpass123`
   - Confirm Password: `testpass123`
4. Submit

**Expected:**
- ✅ User created successfully
- ✅ Redirected to home page
- ✅ Navbar shows user menu

**Test Login:**
1. Logout
2. Login with credentials
3. Verify successful login

---

### ✅ Flow 3: Browse Products

**Manual Test:**
1. After login, see homepage
2. Verify:
   - ✅ Banners displayed at top
   - ✅ Men's products carousel
   - ✅ Women's products carousel
3. Click on any product

**Expected:**
- ✅ Product detail page loads
- ✅ Product images visible
- ✅ Variants selectable
- ✅ Price displayed

---

### ✅ Flow 4: Shopping Cart

**Manual Test:**
1. Select a product
2. Choose size/color
3. Click "Add to Cart"
4. Check cart icon (should show count)
5. Go to cart page

**Expected:**
- ✅ Item in cart
- ✅ Quantity editable
- ✅ Total calculated correctly
- ✅ Can remove items

---

### ✅ Flow 5: Checkout & Payment

**Manual Test:**
1. Go to cart
2. Click "Proceed to Checkout"
3. Enter shipping address
4. Submit checkout

**Expected:**
- ✅ Order created
- ✅ Redirected to payment page
- ✅ UPI ID shown (from site settings)
- ✅ QR Code shown (from site settings)
- ✅ Order total displayed

**Confirm Payment:**
1. Enter payment reference (e.g., `UPI123456789`)
2. Upload screenshot (optional)
3. Submit payment

**Expected:**
- ✅ Payment confirmed
- ✅ Email sent to admin (`maazith.md@gmail.com`)
- ✅ Order status: `PAYMENT_PENDING`
- ✅ Redirected to success page

---

### ✅ Flow 6: Admin Approval

**Manual Test:**
1. Login as admin:
   - Username: `Maazith`
   - Password: `maazith2005`
2. Go to Admin Dashboard
3. Click "Orders" in sidebar
4. Find order with `PAYMENT_PENDING` status
5. Click "Mark as Paid" or "Verify Payment"

**Expected:**
- ✅ Order status changes to `PLACED`
- ✅ Email sent to customer
- ✅ Payment verified flag set
- ✅ Success message shown

---

### ✅ Flow 7: Product Management (Admin)

**Manual Test:**
1. In Admin Dashboard, click "Products"
2. Click "Add Product"
3. Fill form:
   - Title: `Test Product`
   - Category: Select one
   - Base Price: `999`
   - Gender: `MEN` or `WOMEN`
   - Upload image
4. Save

**Expected:**
- ✅ Product created
- ✅ Default variant auto-created
- ✅ Product appears in list
- ✅ Image uploaded successfully

**Test Edit/Delete:**
- ✅ Edit product → Changes saved
- ✅ Delete product → Product removed

---

### ✅ Flow 8: Banner Management (Admin)

**Manual Test:**
1. In Admin Dashboard, click "Banners"
2. Click "Upload Banner"
3. Fill form:
   - Title: `Test Banner`
   - Subtitle: `Test Subtitle`
   - Upload image
4. Save

**Expected:**
- ✅ Banner created
- ✅ Appears on homepage within 5 seconds
- ✅ Banner image visible

---

### ✅ Flow 9: Email Notifications

**Verify Email Setup:**
1. Check `backend/edithclothes/settings.py`:
   - ✅ `EMAIL_HOST_USER = 'maazith.md@gmail.com'`
   - ✅ `ADMIN_EMAIL = 'maazith.md@gmail.com'`

**Test Email Flow:**
1. Customer confirms payment → Admin receives email
2. Admin approves payment → Customer receives email

**For Testing (Console Output):**
Uncomment in settings.py:
```python
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```

This prints emails to console instead of sending.

---

## 🧪 Automated API Testing

Run the test script to verify all API endpoints:

```bash
python END_TO_END_TEST_SCRIPT.py
```

**Tests Include:**
- ✅ User Registration
- ✅ User Login
- ✅ Get User Info
- ✅ Get Categories
- ✅ Get Products
- ✅ Get Product Detail
- ✅ Create Category (Admin)
- ✅ Get Cart
- ✅ Add to Cart
- ✅ Checkout
- ✅ Confirm Payment
- ✅ Get My Orders
- ✅ Get All Orders (Admin)
- ✅ Mark Order as Paid (Admin)
- ✅ Update Order Status (Admin)
- ✅ Get Site Settings
- ✅ Get Banners

---

## 📊 Verification Checklist

### Backend Verification:
- [ ] Django server starts without errors
- [ ] Database migrations applied
- [ ] Demo data created (optional)
- [ ] All API endpoints accessible
- [ ] Authentication working
- [ ] Admin user exists

### Frontend Verification:
- [ ] Landing page loads
- [ ] Both login options visible
- [ ] User pages accessible
- [ ] Admin pages accessible
- [ ] API calls successful
- [ ] Images loading

### Email Verification:
- [ ] Email configuration set
- [ ] Admin email configured
- [ ] Email templates exist
- [ ] Email sending works (or console output)

### Features Verification:
- [ ] User registration/login
- [ ] Product browsing
- [ ] Cart functionality
- [ ] Checkout process
- [ ] Payment confirmation
- [ ] Admin approval
- [ ] Order tracking
- [ ] Email notifications

---

## 🎯 Success Criteria

All flows should work end-to-end:

1. ✅ **Landing Page** → Shows both login options
2. ✅ **User Flow** → Register → Login → Browse → Cart → Checkout → Payment → Success
3. ✅ **Admin Flow** → Login → Dashboard → View Orders → Approve Payment
4. ✅ **Email Flow** → Admin receives payment notification → Customer receives confirmation
5. ✅ **Order Status** → Updates correctly through all stages

---

## 🐛 Troubleshooting

### Backend Won't Start:
- Check virtual environment is activated
- Verify Django is installed
- Check for migration issues: `python manage.py migrate`

### API Calls Fail:
- Verify backend is running on port 8000
- Check CORS settings in settings.py
- Verify API base URL in frontend

### Email Not Sending:
- Use console backend for testing
- Check email configuration in settings.py
- Verify Gmail app password is set (if using SMTP)

---

## 📝 Test Results Template

After running all tests, document results:

```
Date: [DATE]
Tester: [NAME]

✅ PASSED:
- Landing page shows both login options
- User registration works
- User login works
- Product browsing works
- Cart functionality works
- Checkout works
- Payment confirmation works
- Admin approval works
- Email notifications work

❌ FAILED:
- [List any failures]

⚠️ WARNINGS:
- [List any warnings]

Notes:
- [Additional notes]
```

---

**Ready to run end-to-end simulation!** 🚀

Follow the steps above to verify every flow works correctly.


