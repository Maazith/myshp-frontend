# Product Display Troubleshooting Guide

## 🔍 Current Status

**API Endpoint:** `https://myshp-backend.onrender.com/api/products/`  
**Response:** `[]` (Empty array)  
**Status:** HTTP 200 OK ✅

---

## ✅ API is Working

The API endpoint is accessible and responding correctly. The empty array means:
- Either no products exist in the database
- Or all products have `is_active=False`

---

## 🔧 Quick Fix Steps

### Step 1: Verify Products Exist

**Option A: Use Verification Script**
```bash
cd backend/backend/backend
python manage.py shell < verify_products.py
```

**Option B: Check Admin Panel**
1. Go to: `https://myshp-backend.onrender.com/edith-admin-login/`
2. Login with admin credentials
3. Go to "Products" section
4. Check if products exist
5. Verify `is_active` checkbox is checked

### Step 2: Create Test Product

**Option A: Use Script**
```bash
cd backend/backend/backend
python manage.py shell < create_test_product.py
```

**Option B: Create in Admin**
1. Go to admin panel → Products → Add Product
2. Fill required fields:
   - **Title:** "Test Product"
   - **Category:** Select or create category
   - **Base Price:** 500
   - **Gender:** Men or Women
   - **Hero Image:** Upload an image
   - **Is Active:** ✅ Check this box (IMPORTANT!)
3. Save

### Step 3: Verify Product is Active

**Critical:** Products must have `is_active=True` to show on frontend!

- ✅ Check `is_active` checkbox in admin
- ✅ Save product after checking
- ✅ Verify in API response: `"is_active": true`

---

## 📋 Product Requirements Checklist

For a product to show on homepage:

- [ ] **Title** - Required
- [ ] **Category** - Required (create if doesn't exist)
- [ ] **Base Price** - Required (e.g., 500.00)
- [ ] **Gender** - Required (MEN, WOMEN, or UNISEX)
- [ ] **Is Active** - ✅ MUST BE CHECKED (most important!)
- [ ] **Hero Image** - Recommended (product won't break without it)

---

## 🧪 Testing After Creating Product

### 1. Test API Directly
```bash
curl https://myshp-backend.onrender.com/api/products/
```

Should return:
```json
[
  {
    "id": 1,
    "name": "Test Product",
    "title": "Test Product",
    "base_price": "500.00",
    "hero_media_url": "https://myshp-backend.onrender.com/media/products/image.jpg",
    "gender": "MEN",
    "is_active": true,
    ...
  }
]
```

### 2. Test Homepage
- Go to: `https://myshp-frontend.vercel.app/` or `/index.html`
- Open browser console (F12)
- Check logs:
  ```
  📦 Fetching products from: https://myshp-backend.onrender.com/api/products/...
  📦 Products received: [{...}]
  📦 Number of products: 1
  ```
- Product should display on homepage

### 3. Test Gender Pages
- Men's page: `/pages/men.html` - Should show MEN and UNISEX products
- Women's page: `/pages/women.html` - Should show WOMEN and UNISEX products

---

## 🐛 Common Issues

### Issue 1: Products Exist But Don't Show

**Cause:** `is_active=False`

**Solution:**
1. Go to admin panel
2. Edit product
3. Check "Is Active" checkbox
4. Save

**Verify:**
```python
# In Django shell
from shop.models import Product
Product.objects.filter(is_active=True).count()
```

---

### Issue 2: Products Show in API But Not on Frontend

**Possible Causes:**
1. CORS error (check browser console)
2. Frontend using wrong API URL
3. Cache issue (hard refresh: Ctrl+F5)

**Solution:**
1. Check browser console for errors
2. Verify API URL in console logs
3. Clear browser cache
4. Check Network tab for failed requests

---

### Issue 3: Products Show But Images Don't Load

**Cause:** `hero_media_url` is null or incorrect

**Solution:**
1. Upload hero image in admin
2. Verify image URL in API response
3. Test image URL directly in browser
4. Check media files are served correctly

---

### Issue 4: Products Show on Wrong Gender Page

**Cause:** Gender filter mismatch

**Solution:**
- MEN page shows: MEN + UNISEX products
- WOMEN page shows: WOMEN + UNISEX products
- If product is MEN, it won't show on WOMEN page (unless UNISEX)

---

## 📊 Verification Commands

### Check Products in Database:
```python
python manage.py shell
>>> from shop.models import Product
>>> Product.objects.all().count()  # Total products
>>> Product.objects.filter(is_active=True).count()  # Active products
>>> Product.objects.filter(is_active=True, gender='MEN').count()  # Men's products
```

### Check API Response:
```bash
curl https://myshp-backend.onrender.com/api/products/ | python -m json.tool
```

### Check Specific Product:
```bash
curl https://myshp-backend.onrender.com/api/products/id/1/ | python -m json.tool
```

---

## ✅ Expected Behavior

### After Creating Product:

1. **API Response:**
   ```json
   [
     {
       "id": 1,
       "name": "Test Product",
       "title": "Test Product",
       "base_price": "500.00",
       "hero_media_url": "https://myshp-backend.onrender.com/media/products/image.jpg",
       "gender": "MEN",
       "is_active": true,
       "category": {...}
     }
   ]
   ```

2. **Homepage:**
   - Product appears in Men's section
   - Product image loads
   - Product title and price display
   - "VIEW DETAILS" button works

3. **Console Logs:**
   ```
   📦 Fetching products from: https://myshp-backend.onrender.com/api/products/?gender=MEN&...
   📦 Products received: [{id: 1, name: "Test Product", ...}]
   📦 Number of products: 1
   ✅ Products rendered successfully
   ```

---

## 🎯 Quick Action Plan

1. **Check if products exist:**
   - Admin panel → Products
   - Or run: `python manage.py shell < verify_products.py`

2. **If no products:**
   - Create product in admin
   - Or run: `python manage.py shell < create_test_product.py`

3. **If products exist but don't show:**
   - Check `is_active=True` in admin
   - Verify in API response
   - Check browser console for errors

4. **Test homepage:**
   - Go to homepage
   - Check console logs
   - Verify products display

---

## 📝 Summary

**Current Status:**
- ✅ API endpoint working (`/api/products/`)
- ✅ Returns HTTP 200 OK
- ⚠️ Returns empty array `[]` (no active products)

**Next Steps:**
1. Create products in admin panel
2. Ensure `is_active=True`
3. Upload hero images
4. Test homepage display

**Status:** Ready to create products and test display

---

**Last Updated:** After API verification
**Status:** ⚠️ Need to create products with `is_active=True`

