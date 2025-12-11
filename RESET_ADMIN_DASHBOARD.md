# Reset Admin Dashboard - Complete Data Reset

This guide will help you reset all data in the admin dashboard (orders, products, categories, banners, carts) while preserving:
- ✅ **Users** (including admin accounts)
- ✅ **Site Settings** (UPI ID, contact info, etc.)
- ✅ **All application logic and designs**

---

## 🗑️ What Will Be Deleted

- **Orders** (all orders, order items, payment proofs)
- **Products** (all products, variants, product images)
- **Categories** (all categories)
- **Banners** (all homepage banners)
- **Carts** (all user carts and cart items)

---

## ✅ What Will Be Preserved

- **Users** (all user accounts, including admin)
- **Site Settings** (UPI ID, contact info, logo, QR code, etc.)
- **Application code** (all logic, designs, templates remain intact)

---

## 🚀 How to Reset (On Render)

### Option 1: Via Render Shell (Recommended)

1. **Go to Render Dashboard:**
   - Navigate to your backend service: `myshp-backend`
   - Click on **"Shell"** tab

2. **Run the reset command:**
   ```bash
   python manage.py clear_all_data --force
   ```

   Or without `--force` (will ask for confirmation):
   ```bash
   python manage.py clear_all_data
   ```
   Then type `yes` when prompted.

3. **Verify the reset:**
   ```bash
   python manage.py shell
   ```
   Then in Python shell:
   ```python
   from shop.models import Order, Product, Category, Banner
   print(f"Orders: {Order.objects.count()}")
   print(f"Products: {Product.objects.count()}")
   print(f"Categories: {Category.objects.count()}")
   print(f"Banners: {Banner.objects.count()}")
   ```
   All should show `0`.

---

### Option 2: Via Django Admin Panel

1. **Login to Admin:**
   - Go to: `https://myshp-backend.onrender.com/edith-admin-login/`
   - Login with admin credentials

2. **Delete manually:**
   - Go to **Orders** → Select all → Delete
   - Go to **Products** → Select all → Delete
   - Go to **Categories** → Select all → Delete
   - Go to **Banners** → Select all → Delete

   ⚠️ **Note:** This is more time-consuming and may not delete related items properly.

---

## 📋 After Reset

### Dashboard Will Show:
- **Total Orders:** 0
- **Pending Orders:** 0
- **Completed Orders:** 0
- **Revenue:** ₹0.00
- **Recent Orders:** Empty
- **Products List:** Empty
- **Categories List:** Empty
- **Banners List:** Empty

### Next Steps (Optional):

1. **Add Categories:**
   ```bash
   python manage.py create_demo_data
   ```
   Or add manually via Admin panel

2. **Add Products:**
   - Go to Admin → Products → Add Product
   - Or use the admin panel at `/admin/products.html`

3. **Add Banners:**
   - Go to Admin → Banners → Upload Banner
   - Or use the admin panel at `/admin/banners.html`

---

## ⚠️ Important Notes

- **This action cannot be undone!** All data will be permanently deleted.
- **Users are preserved** - you can still login with the same credentials
- **Site Settings are preserved** - UPI ID, contact info, etc. remain unchanged
- **Application code is not affected** - all logic and designs remain intact

---

## 🔍 Verify Reset

After running the command, check:

1. **Admin Dashboard:**
   - Go to: `/admin/dashboard.html`
   - All stats should be 0

2. **Products Page:**
   - Go to: `/admin/products.html`
   - Should show "No products found"

3. **Orders Page:**
   - Go to: `/admin/orders.html`
   - Should show "No orders found"

4. **User Frontend:**
   - Homepage should show no products
   - Cart should be empty
   - My Orders should show "No orders yet"

---

## 🛠️ Troubleshooting

**If command doesn't work:**
- Make sure you're in the correct directory: `backend/backend/backend/`
- Check Python path: `python --version`
- Try: `python manage.py clear_all_data --force`

**If some data remains:**
- Check for foreign key constraints
- Run the command again
- Check database directly via admin panel

---

**Status:** ✅ Ready to use

**Command:** `python manage.py clear_all_data --force`




