# 🔗 Connect Everything to Backend - Complete Guide

## ✅ What's Already Connected

Your frontend is **already configured** to connect to the backend at:
- **Production**: `https://myshp-backend.onrender.com/api`
- **Local**: `http://127.0.0.1:8000/api`

All JavaScript files are using the centralized `api.js` module which handles all backend connections.

## 📋 Connection Status

### ✅ Already Connected Components

1. **API Module** (`frontend/assets/js/api.js`)
   - ✅ Configured with backend URL
   - ✅ Handles all API requests
   - ✅ Manages authentication tokens
   - ✅ Error handling for connection issues

2. **All JavaScript Modules** (import from `api.js`)
   - ✅ `admin.js` - Admin panel functionality
   - ✅ `auth.js` - User authentication
   - ✅ `cart.js` - Shopping cart
   - ✅ `checkout.js` - Checkout process
   - ✅ `orders.js` - Order management
   - ✅ `payment.js` - Payment processing
   - ✅ `products.js` - Product listing
   - ✅ `product-detail.js` - Product details
   - ✅ `home.js` - Homepage content
   - ✅ `components.js` - Shared components

3. **Image URLs**
   - ✅ Automatically converts relative URLs to absolute backend URLs
   - ✅ Uses backend media URL for product images
   - ✅ Supports both local and production backends

## 🎯 How It Works

### Automatic Backend Detection

The frontend automatically detects which backend to use:

1. **Local Development** (localhost/127.0.0.1)
   - Uses: `http://127.0.0.1:8000/api`
   - For testing before deployment

2. **Production** (deployed frontend)
   - Uses: `https://myshp-backend.onrender.com/api`
   - Your deployed backend

3. **Vercel Environment Variable**
   - Can override with `NEXT_PUBLIC_API_BASE_URL`
   - For custom deployments

### Connection Flow

```
HTML Page → api-config.js (sets API URL) → api.js (handles requests) → Backend
```

## 🔧 Configuration Files

### 1. API Configuration (`frontend/api-config.js`)
- Sets `window.API_BASE_URL` before other scripts load
- Automatically detects local vs production
- Can be included in all HTML pages

### 2. Main API Module (`frontend/assets/js/api.js`)
- Central API handler
- All other modules import from this
- Handles authentication, requests, errors

### 3. HTML Files
- Most already configured through `index.html`
- Sets `window.API_BASE_URL` in head section

## 🚀 Ensuring Connection

### Method 1: Current Setup (Already Working)

All pages already connect through:
- `api.js` imports in JavaScript modules
- API URL set in `index.html` head
- Automatic URL detection

### Method 2: Explicit Configuration (Recommended)

Add to ALL HTML files (before other scripts):

```html
<head>
  <!-- ... other head content ... -->
  <script src="../api-config.js"></script> <!-- For pages in subdirectories -->
  <!-- OR -->
  <script src="api-config.js"></script> <!-- For root level pages -->
</head>
```

## ✅ Verification Checklist

### Backend Connection

- [ ] Backend is deployed and running
- [ ] Backend URL is accessible: `https://myshp-backend.onrender.com/api/`
- [ ] Frontend can make API requests
- [ ] CORS is configured correctly

### Frontend Pages

- [ ] Homepage loads products/categories
- [ ] Login/Register works
- [ ] Product pages load data
- [ ] Cart functionality works
- [ ] Checkout process works
- [ ] Admin panel connects

### Test Connection

Use the connection test tool:
1. Open: `frontend/test-connection.html`
2. Enter backend URL: `https://myshp-backend.onrender.com/api`
3. Click "Test All Connections"
4. All should show ✅ SUCCESS

## 🔍 Troubleshooting

### Issue: "Failed to connect to server"

**Causes:**
1. Backend not deployed
2. Backend URL incorrect
3. Backend is sleeping (free tier)
4. CORS issues

**Solutions:**
1. Deploy backend: See `DEPLOY_EVERYTHING.md`
2. Check backend URL in browser
3. Wait 30-60 seconds for service to wake up
4. Verify CORS settings in backend

### Issue: API requests fail

**Check:**
1. Browser console (F12) for errors
2. Network tab for failed requests
3. Backend logs on Render dashboard
4. CORS headers in response

### Issue: Images not loading

**Solution:**
- Images are automatically converted to backend URLs
- Check if backend media files are accessible
- Verify MEDIA_URL in backend settings

## 📝 Quick Reference

### Backend URLs

- **API Root**: `https://myshp-backend.onrender.com/api/`
- **Admin Panel**: `https://myshp-backend.onrender.com/admin/`
- **Media Files**: `https://myshp-backend.onrender.com/media/`

### Frontend Configuration

- **API Config**: `frontend/api-config.js`
- **Main API**: `frontend/assets/js/api.js`
- **Test Tool**: `frontend/test-connection.html`

## 🎉 Summary

**Everything is already connected!** Your frontend:
- ✅ Uses centralized API module
- ✅ Automatically detects backend URL
- ✅ Handles all API requests
- ✅ Manages authentication
- ✅ Converts image URLs
- ✅ Has error handling

**To verify connection:**
1. Deploy backend (if not done)
2. Test with connection tool
3. Try using the frontend features

---

**Status: All components are configured and ready to connect to backend!** ✅

