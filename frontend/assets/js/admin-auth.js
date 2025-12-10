import { adminApi } from './admin-api.js';

// Admin authentication module
export const adminAuth = {
  requireAuth() {
    const token = adminApi.accessToken;
    if (!token) {
      window.location.href = '/admin/login.html';
      return false;
    }
    return true;
  },
  
  clearAuth() {
    adminApi.logout();
  },
  
  async checkAuth() {
    if (!adminApi.isAuthenticated) {
      return false;
    }
    
    // Verify token is still valid by making a test request
    try {
      const user = adminApi.currentUser();
      if (user && user.is_staff) {
        return true;
      }
      // Token exists but user is not staff, clear auth
      this.clearAuth();
      return false;
    } catch {
      this.clearAuth();
      return false;
    }
  }
};

// Handle admin login form
const handleAdminLogin = () => {
  const form = document.getElementById('admin-login-form');
  if (!form) return;
  
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const errorEl = document.getElementById('admin-login-error');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (errorEl) errorEl.textContent = '';
    
    try {
      const username = document.getElementById('admin-user').value.trim();
      const password = document.getElementById('admin-pass').value.trim();
      
      if (!username || !password) {
        if (errorEl) {
          errorEl.textContent = 'Please enter both username and password.';
        }
        return;
      }
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';
      }
      
      console.log('[Admin Auth] Attempting login...');
      
      // Call login API
      const payload = await adminApi.login({ username, password });
      
      console.log('[Admin Auth] Login response:', payload);
      
      // Check if tokens were stored
      const accessToken = localStorage.getItem('admin_access');
      const refreshToken = localStorage.getItem('admin_refresh');
      
      if (!accessToken) {
        throw new Error('Login failed: No access token received.');
      }
      
      console.log('[Admin Auth] Tokens stored:', { hasAccess: !!accessToken, hasRefresh: !!refreshToken });
      
      // Check if user data is in response
      let userData = payload.user;
      if (!userData) {
        console.log('[Admin Auth] User data not in response, fetching from /auth/me...');
        // Fetch user data
        try {
          userData = await adminApi.request('/auth/me');
          console.log('[Admin Auth] User data fetched:', userData);
        } catch (meError) {
          console.error('[Admin Auth] Error fetching user data:', meError);
          throw new Error('Login successful but could not verify user account.');
        }
      }
      
      // Verify admin privileges
      if (!userData || !userData.is_staff) {
        console.error('[Admin Auth] User is not staff:', userData);
        adminApi.logout();
        if (errorEl) {
          errorEl.textContent = 'Access denied. This account does not have admin privileges.';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Login';
        }
        return;
      }
      
      // Store user data (already stored by adminApi.login, but ensure it's there)
      if (userData) {
        localStorage.setItem('admin_user', JSON.stringify(userData));
        console.log('[Admin Auth] User data stored:', userData);
      }
      
      console.log('[Admin Auth] Login successful, redirecting to dashboard...');
      
      // Success - redirect to dashboard
      window.location.href = '/admin/dashboard.html';
    } catch (err) {
      if (errorEl) {
        let errorMsg = err.message || 'Login failed. Please check your credentials.';
        
        if (errorMsg.includes('Failed to connect') || errorMsg.includes('fetch')) {
          errorMsg = 'Cannot connect to server. Please check your internet connection.';
        } else if (errorMsg.includes('401') || errorMsg.includes('Unauthorized') || errorMsg.includes('Invalid')) {
          errorMsg = 'Invalid username or password. Please check your credentials.';
        }
        
        errorEl.textContent = errorMsg;
      }
      console.error('Admin login error:', err);
      
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
      }
    }
  });
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  handleAdminLogin();
});
