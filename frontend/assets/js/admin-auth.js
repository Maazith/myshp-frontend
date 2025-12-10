import { api } from './api.js';

const handleAdminLogin = () => {
  const form = document.getElementById('admin-login-form');
  if (!form) return;
  
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const errorEl = document.getElementById('admin-login-error');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (errorEl) errorEl.textContent = ''; // Clear previous errors
    
    try {
      const username = document.getElementById('admin-user').value.trim();
      const password = document.getElementById('admin-pass').value.trim();
      
      if (!username || !password) {
        if (errorEl) {
          errorEl.textContent = 'Please enter both username and password.';
          errorEl.style.display = 'block';
        }
        return;
      }
      
      // Disable submit button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';
      }
      
      // Call login API
      const payload = await api.login({ username, password });
      
      console.log('Login response:', payload);
      
      // Check if tokens were received
      if (!payload || (!payload.access && !payload.refresh)) {
        throw new Error('Login failed: No authentication tokens received.');
      }
      
      // If user data is not in the response, fetch it from /auth/me
      let userData = payload.user;
      if (!userData) {
        console.log('User data not in login response, fetching from /auth/me');
        try {
          userData = await api.request('/auth/me');
          console.log('User data from /auth/me:', userData);
        } catch (meError) {
          console.error('Failed to fetch user data:', meError);
          throw new Error('Login successful but could not verify user account. Please try again.');
        }
      }
      
      // Check if user has admin privileges
      if (!userData || !userData.is_staff) {
        api.logout(); // Clear invalid token
        if (errorEl) {
          errorEl.textContent = 'Access denied. This account does not have admin privileges. Please contact an administrator.';
          errorEl.style.display = 'block';
          errorEl.style.color = 'var(--danger)';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Login';
        }
        return;
      }
      
      // Store user data if not already stored
      if (userData && !payload.user) {
        localStorage.setItem('edithcloths_user', JSON.stringify(userData));
      }
      
      // Success - redirect to dashboard
      window.location.href = 'dashboard.html';
    } catch (err) {
      if (errorEl) {
        let errorMsg = err.message || 'Login failed. Please check your credentials and try again.';
        
        // More specific error messages
        if (errorMsg.includes('Failed to connect') || errorMsg.includes('fetch')) {
          errorMsg = 'Cannot connect to server. Please check your internet connection and ensure the backend is running.';
        } else if (errorMsg.includes('401') || errorMsg.includes('Unauthorized') || errorMsg.includes('No active account') || errorMsg.includes('Invalid')) {
          errorMsg = 'Invalid username or password. Please check your credentials.';
        } else if (errorMsg.includes('404')) {
          errorMsg = 'API endpoint not found. Check if backend is running.';
        } else if (errorMsg.includes('500')) {
          errorMsg = 'Server error. Check backend console for details.';
        }
        
        errorEl.textContent = errorMsg;
        errorEl.style.display = 'block';
        errorEl.style.color = 'var(--danger)';
      }
      console.error('Admin login error:', err);
      
      // Re-enable submit button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
      }
    }
  });
};

// Export adminAuth object for use in other modules
export const adminAuth = {
  requireAuth() {
    // Check if user is authenticated
    const token = localStorage.getItem('edithcloths_token');
    if (!token) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },
  
  clearAuth() {
    // Clear all auth data
    localStorage.removeItem('edithcloths_token');
    localStorage.removeItem('edithcloths_refresh');
    localStorage.removeItem('edithcloths_user');
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  handleAdminLogin();
});
