// Admin API - Separate from user API
// Uses admin_access and admin_refresh tokens

const ADMIN_ACCESS_KEY = 'admin_access';
const ADMIN_REFRESH_KEY = 'admin_refresh';
const ADMIN_USER_KEY = 'admin_user';

const buildAdminHeaders = (options = {}) => {
  const headers = { ...options };
  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem(ADMIN_ACCESS_KEY);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const getApiBaseUrl = () => {
  // Priority 1: Environment variable (Vercel)
  if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // Priority 2: Window variable set by HTML script tag
  if (typeof window !== 'undefined' && window.API_BASE_URL) {
    return window.API_BASE_URL;
  }
  // Priority 3: Vercel environment variable
  if (typeof window !== 'undefined' && window.VERCEL_ENV_API_BASE_URL) {
    return window.VERCEL_ENV_API_BASE_URL;
  }
  // Priority 4: Production fallback (Render backend) - ALWAYS USE IN PRODUCTION
  const RENDER_BACKEND_URL = 'https://myshp-backend-1.onrender.com/api';
  
  // In production (not localhost), always use Render backend
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== '') {
      return RENDER_BACKEND_URL;
    }
  }
  
  // Local development fallback
  return RENDER_BACKEND_URL;
};

export const adminApi = {
  get baseUrl() {
    return getApiBaseUrl();
  },
  get accessToken() {
    return localStorage.getItem(ADMIN_ACCESS_KEY);
  },
  get isAuthenticated() {
    return !!this.accessToken;
  },
  currentUser() {
    const user = localStorage.getItem(ADMIN_USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  logout() {
    localStorage.removeItem(ADMIN_ACCESS_KEY);
    localStorage.removeItem(ADMIN_REFRESH_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  },
  async request(path, { method = 'GET', body, isForm = false, cacheBust = false } = {}) {
    const options = { 
      method,
      credentials: 'include'  // Include cookies for session
    };
    
    let requestPath = path;
    if (method === 'GET' && cacheBust) {
      const separator = path.includes('?') ? '&' : '?';
      requestPath = `${path}${separator}_t=${Date.now()}`;
    }
    
    if (isForm || body instanceof FormData) {
      options.headers = {};
      const token = localStorage.getItem(ADMIN_ACCESS_KEY);
      if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
      }
      options.body = body;
    } else {
      options.headers = buildAdminHeaders();
      if (method === 'GET') {
        options.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        options.headers['Pragma'] = 'no-cache';
        options.headers['Expires'] = '0';
      }
      if (body) {
        options.body = JSON.stringify(body);
      }
    }
    
    try {
      const apiBaseUrl = getApiBaseUrl();
      const fullUrl = `${apiBaseUrl}${requestPath}`;
      
      // Log request for debugging
      console.log(`[Admin API] ${method} ${fullUrl}`, {
        hasToken: !!localStorage.getItem(ADMIN_ACCESS_KEY),
        isForm: isForm || body instanceof FormData
      });
      
      const response = await fetch(fullUrl, options);
      
      // Log response for debugging
      console.log(`[Admin API] Response ${response.status} ${response.statusText}`, {
        url: fullUrl,
        ok: response.ok
      });
      
      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        console.warn('[Admin API] 401 Unauthorized - attempting token refresh');
        // Try to refresh token
        const refreshed = await this.refreshToken();
        if (refreshed) {
          console.log('[Admin API] Token refreshed, retrying request');
          // Retry request with new token
          options.headers = buildAdminHeaders();
          if (body && !(body instanceof FormData)) {
            options.body = JSON.stringify(body);
          }
          const retryResponse = await fetch(fullUrl, options);
          if (!retryResponse.ok) {
            const errorText = await retryResponse.text();
            console.error(`[Admin API] Retry failed: ${retryResponse.status}`, errorText);
            throw new Error(`API request failed: ${retryResponse.status} ${retryResponse.statusText}`);
          }
          return await retryResponse.json();
        } else {
          // Refresh failed, redirect to login
          console.error('[Admin API] Token refresh failed, redirecting to login');
          this.logout();
          if (window.location.pathname !== '/admin/login.html') {
            window.location.href = '/admin/login.html';
          }
          throw new Error('Session expired. Please login again.');
        }
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: errorText || `HTTP ${response.status}` };
        }
        const errorMessage = errorData.detail || errorData.message || errorData.error || `API request failed: ${response.status}`;
        
        // Enhanced error logging with full details
        console.error(`[Admin API] Error ${response.status}:`, {
          url: fullUrl,
          method: method,
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
          errorData: errorData,
          responseHeaders: Object.fromEntries(response.headers.entries()),
          hasToken: !!localStorage.getItem(ADMIN_ACCESS_KEY)
        });
        
        // Provide more specific error messages
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. You do not have permission to perform this action.');
        } else if (response.status === 404) {
          throw new Error(`Endpoint not found: ${requestPath}. Please check the API path.`);
        } else if (response.status === 500) {
          throw new Error(`Server error: ${errorMessage}. Please check backend logs.`);
        } else {
          throw new Error(errorMessage);
        }
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log(`[Admin API] Success:`, { url: fullUrl, dataLength: Array.isArray(data) ? data.length : 'object' });
        return data;
      }
      return await response.text();
    } catch (err) {
      // Reconstruct URL for error logging (fullUrl might not be defined if error occurred early)
      const apiBaseUrl = getApiBaseUrl();
      const errorUrl = `${apiBaseUrl}${requestPath}`;
      console.error('[Admin API] Request failed:', {
        url: errorUrl,
        error: err.message,
        stack: err.stack
      });
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        throw new Error('Failed to connect to server. Please check your internet connection and ensure the backend is running.');
      }
      throw err;
    }
  },
  async refreshToken() {
    const refreshToken = localStorage.getItem(ADMIN_REFRESH_KEY);
    if (!refreshToken) {
      return false;
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // Include cookies for session
        body: JSON.stringify({ refresh: refreshToken }),
      });
      
      if (!response.ok) {
        return false;
      }
      
      const data = await response.json();
      if (data.access) {
        localStorage.setItem(ADMIN_ACCESS_KEY, data.access);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
  async login(credentials) {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',  // Include cookies for session
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { detail: errorText || 'Login failed' };
      }
      throw new Error(errorData.detail || errorData.message || 'Login failed');
    }
    
    const data = await response.json();
    
    // Store admin tokens
    if (data.access) {
      localStorage.setItem(ADMIN_ACCESS_KEY, data.access);
    }
    if (data.refresh) {
      localStorage.setItem(ADMIN_REFRESH_KEY, data.refresh);
    }
    if (data.user) {
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.user));
    }
    
    return data;
  },
  // Admin-specific endpoints
  async getStats() {
    return this.request('/admin/stats', { cacheBust: true });
  },
  async getOrders() {
    return this.request('/orders/', { cacheBust: true });
  },
  async getOrder(id) {
    return this.request(`/orders/${id}/`, { cacheBust: true });
  },
  async updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
  },
  async markOrderPaid(id) {
    return this.request(`/orders/${id}/mark-paid`, {
      method: 'POST',
    });
  },
  async getProducts() {
    return this.request('/products/', { cacheBust: true });
  },
  async getProduct(id) {
    return this.request(`/products/id/${id}/`, { cacheBust: true });
  },
  async createProduct(data) {
    // If data is already FormData, use it directly
    if (data instanceof FormData) {
      return this.request('/products/add', {
        method: 'POST',
        body: data,
        isForm: true,
      });
    }
    
    // Otherwise, build FormData from object
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value === null || value === undefined) {
        return; // Skip null/undefined values
      }
      
      // Backend expects 'category_id' for write operations (see serializer)
      if (key === 'category' && value) {
        formData.append('category_id', value);
      } else if (key === 'hero_media' && value instanceof File) {
        formData.append(key, value);
      } else if (key === 'variants' && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (typeof value === 'boolean') {
        formData.append(key, value ? 'true' : 'false');
      } else if (key !== 'category') { // Skip 'category' as we already handled it
        formData.append(key, value);
      }
    });
    
    return this.request('/products/add', {
      method: 'POST',
      body: formData,
      isForm: true,
    });
  },
  async updateProduct(id, data) {
    // If data is already FormData, use it directly
    if (data instanceof FormData) {
      return this.request(`/products/${id}/edit`, {
        method: 'PUT',
        body: data,
        isForm: true,
      });
    }
    
    // Otherwise, build FormData from object
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value === null || value === undefined) {
        return; // Skip null/undefined values
      }
      
      // Backend expects 'category_id' for write operations (see serializer)
      if (key === 'category' && value) {
        formData.append('category_id', value);
      } else if (key === 'hero_media' && value instanceof File) {
        formData.append(key, value);
      } else if (key === 'variants' && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (typeof value === 'boolean') {
        formData.append(key, value ? 'true' : 'false');
      } else if (key !== 'category') { // Skip 'category' as we already handled it
        formData.append(key, value);
      }
    });
    
    return this.request(`/products/${id}/edit`, {
      method: 'PUT',
      body: formData,
      isForm: true,
    });
  },
  async deleteProduct(id) {
    return this.request(`/products/${id}/delete`, {
      method: 'DELETE',
    });
  },
  async getBanners() {
    return this.request('/banners/', { cacheBust: true });
  },
  async createBanner(data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'media' && data[key] instanceof File) {
        formData.append(key, data[key]);
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return this.request('/banners/upload', {
      method: 'POST',
      body: formData,
      isForm: true,
    });
  },
  async deleteBanner(id) {
    return this.request(`/banners/${id}/`, {
      method: 'DELETE',
    });
  },
  // Categories
  async getCategories() {
    return this.request('/categories/', { cacheBust: true });
  },
  async createCategory(data) {
    return this.request('/categories/add', {
      method: 'POST',
      body: data,
    });
  },
  async updateCategory(id, data) {
    return this.request(`/categories/${id}/`, {
      method: 'PUT',
      body: data,
    });
  },
  async deleteCategory(id) {
    return this.request(`/categories/${id}/`, {
      method: 'DELETE',
    });
  },
};
