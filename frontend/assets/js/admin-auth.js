import { api } from './api.js';

const ADMIN_TOKEN_KEY = 'edithcloths_admin_token';
const ADMIN_REFRESH_KEY = 'edithcloths_admin_refresh';
const ADMIN_USER_KEY = 'edithcloths_admin_user';

export const adminAuth = {
  get token() {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  },
  get refreshToken() {
    return localStorage.getItem(ADMIN_REFRESH_KEY);
  },
  get user() {
    const user = localStorage.getItem(ADMIN_USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  get isAuthenticated() {
    return !!this.token;
  },
  get isStaff() {
    const user = this.user;
    return user && user.is_staff === true;
  },
  setAuth(token, refresh, user) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    if (refresh) localStorage.setItem(ADMIN_REFRESH_KEY, refresh);
    if (user) localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
  },
  clearAuth() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_REFRESH_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  },
  async login(username, password) {
    try {
      // Get API base URL
      const getApiBaseUrl = () => {
        if (typeof window !== 'undefined' && window.API_BASE_URL) {
          return window.API_BASE_URL;
        }
        if (typeof window !== 'undefined' && window.VERCEL_ENV_API_BASE_URL) {
          return window.VERCEL_ENV_API_BASE_URL;
        }
        return 'https://api.edithcloths.com/api';
      };
      
      const apiBase = getApiBaseUrl();
      
      const response = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || data.message || `Login failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Get user info
      const userResponse = await fetch(`${apiBase}/auth/me`, {
        headers: { 'Authorization': `Bearer ${data.access}` },
      });
      
      if (!userResponse.ok) {
        throw new Error('Failed to verify user credentials');
      }
      
      const userData = await userResponse.json();
      if (!userData.is_staff) {
        throw new Error('Access denied. Staff privileges required.');
      }
      this.setAuth(data.access, data.refresh, userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Failed to connect to server. Please check your connection.' };
    }
  },
  requireAuth() {
    if (!this.isAuthenticated || !this.isStaff) {
      window.location.href = '/admin/login.html';
      return false;
    }
    return true;
  },
};

// Handle login form
if (document.getElementById('admin-login-form')) {
  document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('admin-login-error');
    errorEl.textContent = '';
    const username = document.getElementById('admin-user').value;
    const password = document.getElementById('admin-pass').value;
    const result = await adminAuth.login(username, password);
    if (result.success) {
      window.location.href = '/admin/dashboard.html';
    } else {
      errorEl.textContent = result.error;
    }
  });
}

