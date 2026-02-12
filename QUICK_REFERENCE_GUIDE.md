# 🚀 QUICK REFERENCE GUIDE
## EdithCloths E-Commerce Platform

**For:** Developers, Administrators, and Support Staff  
**Last Updated:** December 11, 2025

---

## 📋 Quick Links

- **Full Documentation:** `COMPLETE_TECHNICAL_DOCUMENTATION.md`
- **Backend API:** `https://api.edithcloths.com/api` or `https://myshp-backend.onrender.com/api`
- **Frontend:** `https://edithcloths.com` or `https://myshp-frontend.vercel.app`
- **Admin Panel:** `https://edithcloths.com/admin/login.html`

---

## 🔑 Admin Credentials

**Username:** `Edithcloths`  
**Email:** `edith0530s@gmail.com`  
**Password:** `edithcloths0530@2025./`

*Note: These are set in Render environment variables. Change them in Render dashboard if needed.*

---

## 🌐 Environment Variables (Backend)

### Required
```
RENDER=true
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=[Auto-generated]
DATABASE_URL=[Auto-set when database linked]
DJANGO_SUPERUSER_USERNAME=Edithcloths
DJANGO_SUPERUSER_EMAIL=edith0530s@gmail.com
DJANGO_SUPERUSER_PASSWORD=edithcloths0530@2025./
```

### Optional
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## 🔌 API Endpoints Quick Reference

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login (returns JWT tokens)
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products/` - List products
- `GET /api/products/:slug/` - Product detail
- `POST /api/products/add` - Create product (Admin)
- `PUT /api/products/:id/edit` - Update product (Admin)
- `DELETE /api/products/:id/delete` - Delete product (Admin)

### Cart
- `GET /api/cart/` - Get cart
- `POST /api/cart/add` - Add to cart
- `PATCH /api/cart/update` - Update quantity
- `DELETE /api/cart/remove/:id` - Remove item

### Orders
- `POST /api/orders/checkout` - Create order
- `POST /api/orders/confirm-payment` - Submit payment proof
- `GET /api/orders/my-orders` - User's orders
- `GET /api/orders/` - All orders (Admin)
- `POST /api/orders/:id/mark-paid` - Mark paid (Admin)
- `POST /api/orders/:id/status` - Update status (Admin)

### Banners
- `GET /api/banners/` - List banners
- `POST /api/banners/upload` - Upload banner (Admin)
- `DELETE /api/banners/:id/` - Delete banner (Admin)

### Settings
- `GET /api/settings/` - Get settings
- `PUT /api/settings/update` - Update settings (Admin)

---

## 🛠️ Common Tasks

### Add a Product
1. Admin → Products → Add Product
2. Fill form (title, category, gender, price)
3. Upload images (multiple)
4. Add variants (size, color, stock)
5. Click "Create Product"

### Process an Order
1. Admin → Orders → Click order
2. View payment proof
3. Verify payment matches order
4. Click "Mark as Paid"
5. Update status: SHIPPED → OUT_FOR_DELIVERY → DELIVERED

### Update Site Settings
1. Admin → Settings (or via dashboard)
2. Update UPI ID, QR code, contact info
3. Click "Update Settings"

### Troubleshoot Deployment
1. **Backend not working:**
   - Check Render logs
   - Verify environment variables
   - Check database connection

2. **Frontend not loading:**
   - Check Vercel deployment status
   - Verify API_BASE_URL environment variable
   - Check browser console for errors

3. **Images not loading:**
   - Check Cloudinary credentials (if using)
   - Verify media URL configuration
   - Check file permissions

---

## 📱 Mobile Responsive Breakpoints

- **Desktop:** > 768px
- **Tablet:** 481px - 768px
- **Mobile:** ≤ 480px

---

## 🔒 Security Notes

- JWT tokens expire: Access (60 min), Refresh (7 days)
- Admin endpoints require `is_staff=True`
- CORS configured for production domains
- HTTPS enforced in production
- File uploads validated (images only)

---

## 📞 Support Contacts

- **Technical Issues:** Check Render/Vercel logs
- **Database Issues:** Check Render PostgreSQL dashboard
- **Domain Issues:** Check Namecheap/GoDaddy DNS settings

---

## 📚 Documentation Files

1. **COMPLETE_TECHNICAL_DOCUMENTATION.md** - Full technical documentation
2. **QUICK_REFERENCE_GUIDE.md** - This file
3. **README.md** - Project overview

---

**Last Updated:** December 11, 2025  
**Status:** ✅ Production Ready








