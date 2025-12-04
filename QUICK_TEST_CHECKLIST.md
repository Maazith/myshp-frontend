# ⚡ Quick Test Checklist - End-to-End Verification

## 🚀 Run These Tests in Order

### 1️⃣ Backend Health Check (2 minutes)
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```

**Test:**
- Open: `http://127.0.0.1:8000/api/categories/`
- ✅ Should return JSON with categories

---

### 2️⃣ Landing Page (30 seconds)
- Open: `frontend/index.html`
- ✅ See logo
- ✅ See "User Login" card
- ✅ See "Admin Login" card

---

### 3️⃣ User Registration (1 minute)
1. Click "User Login" → "Register"
2. Create account
3. ✅ Redirected to home
4. ✅ Navbar shows user menu

---

### 4️⃣ Browse & Cart (2 minutes)
1. View products on home
2. Click a product
3. Add to cart
4. ✅ Cart icon shows count
5. ✅ Cart page shows item

---

### 5️⃣ Checkout & Payment (2 minutes)
1. Go to cart → Checkout
2. Enter address → Submit
3. ✅ Payment page shows UPI/QR
4. Enter reference → Submit
5. ✅ Success page appears

---

### 6️⃣ Admin Approval (2 minutes)
1. Login as admin: `Maazith` / `maazith2005`
2. Go to Orders
3. Find pending order
4. Click "Mark as Paid"
5. ✅ Status changes to "PLACED"

---

### 7️⃣ Email Verification (1 minute)
**Check console/email:**
- ✅ Admin received payment notification
- ✅ Customer received order confirmation

---

## ✅ All Tests Pass = System Ready!

**Total Time:** ~10 minutes

---

## 🐛 Quick Fixes

**Server won't start?**
```bash
python manage.py migrate
python manage.py runserver
```

**No products?**
```bash
python manage.py create_demo_data
```

**Can't login?**
- User: Check registration
- Admin: `Maazith` / `maazith2005`

---

**Quick test complete!** ✨


