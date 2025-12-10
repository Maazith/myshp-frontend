# Login/Logout Button in Navigation Menu - Feature Added

## ✅ Feature Summary

Added login/logout functionality to the navigation menu so users can easily access authentication from any page.

---

## 🎯 What Was Added

### 1. **Login Button** (When Not Authenticated)
- Shows "Login" link in navigation menu
- Links to backend login page: `https://myshp-backend.onrender.com/login/`
- Includes return URL parameter to redirect back after login
- Visible in both desktop and mobile navigation

### 2. **Logout Button** (When Authenticated)
- Shows "Logout" link in navigation menu (styled in red/danger color)
- Clears authentication tokens from localStorage
- Redirects to home page after logout
- Visible in both desktop and mobile navigation

### 3. **Checkout Redirect** (Already Implemented)
- Checkout page automatically checks authentication
- If not logged in, redirects to login page
- After login, redirects back to checkout page
- Cart is preserved during redirect

---

## 📝 Implementation Details

### Files Modified:

1. **`frontend/assets/js/components.js`**
   - Added authentication check in `mountNavbar()`
   - Added login/logout button rendering logic
   - Added logout event handler
   - Login button links to backend with return URL

2. **`frontend/assets/js/api.js`**
   - Updated logout comment for clarity

### Code Changes:

**Navbar Authentication Check:**
```javascript
// Check authentication status
const isAuthenticated = api.isAuthenticated;
const currentUser = api.currentUser();

// Get backend base URL for login/signup links
const backendBaseUrl = api.baseUrl.replace('/api', '');
```

**Login/Logout Button Rendering:**
```javascript
${isAuthenticated 
  ? `<a href="#" id="user-logout" style="color: var(--danger);">Logout</a>` 
  : `<a href="${backendBaseUrl}/login/?next=${encodeURIComponent(window.location.href)}" id="user-login">Login</a>`
}
```

**Logout Handler:**
```javascript
const logoutBtn = document.getElementById('user-logout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    api.logout();
    // Redirect to home page
    const homeUrl = isInPages ? '../index.html' : 'index.html';
    window.location.href = homeUrl;
  });
}
```

---

## 🔄 User Flow

### Login Flow:
1. User clicks "Login" in navigation menu
2. Redirected to backend login page: `/login/?next=<current-page-url>`
3. User enters credentials and logs in
4. Backend redirects back to original page with JWT tokens
5. Frontend extracts tokens and stores in localStorage
6. User is now authenticated

### Logout Flow:
1. User clicks "Logout" in navigation menu
2. Authentication tokens cleared from localStorage
3. User redirected to home page
4. Navigation menu now shows "Login" button

### Checkout Flow:
1. User adds items to cart
2. User clicks "Checkout" button
3. **If not logged in:**
   - Redirected to login page with return URL
   - After login, redirected back to checkout
   - Cart preserved
4. **If logged in:**
   - Proceeds to checkout form
   - Can place order

---

## ✅ Features

- ✅ Login button visible when not authenticated
- ✅ Logout button visible when authenticated (red color)
- ✅ Login redirects to backend with return URL
- ✅ Logout clears tokens and redirects home
- ✅ Works on desktop and mobile navigation
- ✅ Checkout automatically redirects if not logged in
- ✅ Cart preserved during login redirect

---

## 🎨 Styling

- **Login Button:** Standard navigation link style
- **Logout Button:** Red/danger color (`var(--danger)`) to indicate logout action
- **Mobile Menu:** Login/logout button appears in mobile menu
- **Responsive:** Works on all screen sizes

---

## 📋 Testing Checklist

- [ ] Login button appears when not logged in
- [ ] Login button links to backend login page
- [ ] Login page shows "Create Account" link
- [ ] After login, user redirected back to original page
- [ ] Logout button appears when logged in
- [ ] Logout clears tokens and redirects home
- [ ] Checkout redirects to login if not authenticated
- [ ] After login from checkout, user returns to checkout
- [ ] Cart preserved during login redirect
- [ ] Mobile menu shows login/logout button

---

## 🚀 Deployment Status

**Status:** ✅ **IMPLEMENTED AND DEPLOYED**

- Changes committed to frontend repository
- Ready for testing after Vercel rebuild

---

## 📝 Notes

- Login page is served from backend (Django template)
- Signup page accessible from login page
- Authentication uses JWT tokens stored in localStorage
- Backend handles session management
- Frontend handles token storage and API authentication

---

**Feature:** ✅ Login/Logout in Navigation Menu
**Status:** 🟢 Ready for Testing

