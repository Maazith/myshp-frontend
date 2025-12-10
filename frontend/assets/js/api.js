// API Base URL - Use environment variable or fallback to production URL
// Vercel: Set NEXT_PUBLIC_API_BASE_URL or VERCEL_ENV_API_BASE_URL in environment variables
// For local development, set window.API_BASE_URL before loading this script

const ACCESS_KEY = 'edithcloths_token';
const REFRESH_KEY = 'edithcloths_refresh';
const USER_KEY = 'edithcloths_user';

const buildHeaders = (options = {}) => {
  const headers = { ...options };
  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem(ACCESS_KEY);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Function to get current API base URL (dynamic)
const getApiBaseUrl = () => {
  // Check for window variable first (can be updated dynamically)
  if (typeof window !== 'undefined' && window.API_BASE_URL) {
    return window.API_BASE_URL;
  }
  // Check for Vercel environment variable
  if (typeof window !== 'undefined' && window.VERCEL_ENV_API_BASE_URL) {
    return window.VERCEL_ENV_API_BASE_URL;
  }
  // Check for environment variable (Vercel sets this)
  if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  // Production fallback - Try Render backend first, then custom domain
  // Render backend URL (primary)
  const RENDER_BACKEND = 'https://myshp-backend.onrender.com/api';
  // Custom domain (if configured)
  const CUSTOM_DOMAIN = 'https://api.edithcloths.com/api';
  
  // Prefer Render URL as it's more reliable
  return RENDER_BACKEND;
};

export const api = {
  get baseUrl() {
    return getApiBaseUrl();
  },
  get accessToken() {
    return localStorage.getItem(ACCESS_KEY);
  },
  get isAuthenticated() {
    return !!this.accessToken;
  },
  currentUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  logout() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    // Note: Redirect handled by calling code (navbar logout button)
  },
  async request(path, { method = 'GET', body, isForm = false, cacheBust = false } = {}) {
    const options = { method };
    
    // Add cache-busting for GET requests to ensure fresh data
    let requestPath = path;
    if (method === 'GET' && cacheBust) {
      const separator = path.includes('?') ? '&' : '?';
      requestPath = `${path}${separator}_t=${Date.now()}`;
    }
    
    // Build headers - don't include Content-Type for FormData
    if (isForm || body instanceof FormData) {
      options.headers = {};
      const token = localStorage.getItem(ACCESS_KEY);
      if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
      }
      options.body = body;
    } else {
      options.headers = buildHeaders();
      // Add cache control headers for GET requests
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
      const response = await fetch(`${getApiBaseUrl()}${requestPath}`, options);
      if (response.status === 204) return null;
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        // Handle 401 errors without redirecting (no login system)
        if (response.status === 401) {
          // Clear tokens but don't redirect
          localStorage.removeItem(ACCESS_KEY);
          localStorage.removeItem(REFRESH_KEY);
          localStorage.removeItem(USER_KEY);
        }
        // Handle validation errors (400)
        if (response.status === 400 && data.detail) {
          let errorMsg = '';
          if (typeof data.detail === 'object') {
            // Format Django REST Framework validation errors
            const errors = [];
            for (const [field, messages] of Object.entries(data.detail)) {
              if (Array.isArray(messages)) {
                errors.push(`${field}: ${messages.join(', ')}`);
              } else {
                errors.push(`${field}: ${messages}`);
              }
            }
            errorMsg = errors.join('\n');
          } else {
            errorMsg = data.detail;
          }
          throw new Error(errorMsg || 'Validation error. Please check your input.');
        }
        throw new Error(data.detail || data.message || data.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        // Enhanced error message with helpful solutions
        const backendUrl = getApiBaseUrl().replace('/api', '');
        const errorMsg = `Failed to connect to server at ${getApiBaseUrl()}. `;
        let solution = '';
        
        if (backendUrl.includes('onrender.com')) {
          solution = `\n\nPossible solutions:\n1. Backend not deployed - Deploy at https://dashboard.render.com\n2. Service sleeping (free tier) - Wait 30-60 seconds or wake it up\n3. Check service name matches: myshp-backend\n4. Use local backend for testing: http://127.0.0.1:8000/api`;
        } else if (backendUrl.includes('127.0.0.1') || backendUrl.includes('localhost')) {
          solution = `\n\nTo fix:\n1. Start backend: cd backend && python manage.py runserver\n2. Make sure backend is running on port 8000\n3. Check http://127.0.0.1:8000/api/ in browser`;
        }
        
        throw new Error(errorMsg + solution);
      }
      throw error;
    }
  },
  // Auth methods
  async login(credentials) {
    // Login should not include Authorization header
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    };
    
    const response = await fetch(`${getApiBaseUrl()}/auth/login`, options);
    
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.detail || data.message || data.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Store tokens
    if (data.access && data.refresh) {
      localStorage.setItem(ACCESS_KEY, data.access);
      localStorage.setItem(REFRESH_KEY, data.refresh);
      
      // Store user data if provided
      if (data.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      }
    }
    
    return data;
  },
  setAuthTokens(accessToken, refreshToken, user) {
    localStorage.setItem(ACCESS_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },
  // Products
  async getProducts(gender = null) {
    const path = gender ? `/products/?gender=${gender}` : '/products/';
    return await this.request(path, { cacheBust: true });
  },
  async getProduct(slug) {
    return await this.request(`/products/${slug}/`, { cacheBust: true });
  },
  async getCategories() {
    return await this.request('/categories/');
  },
  async getBanners() {
    return await this.request('/banners/');
  },
  // Cart
  async getCart() {
    return await this.request('/cart/');
  },
  async addToCart(variantId, quantity = 1) {
    return await this.request('/cart/add', {
      method: 'POST',
      body: { variant_id: variantId, quantity },
    });
  },
  async removeFromCart(itemId) {
    return await this.request(`/cart/remove/${itemId}`, { method: 'DELETE' });
  },
  async updateCart(itemId, quantity) {
    return await this.request('/cart/update', {
      method: 'PATCH',
      body: { item_id: itemId, quantity },
    });
  },
  // Orders
  async checkout(shippingAddress) {
    return await this.request('/orders/checkout', {
      method: 'POST',
      body: { shipping_address: shippingAddress },
    });
  },
  async getOrders() {
    return await this.request('/orders/my-orders');
  },
  async confirmPayment(orderId, referenceId, proofFile = null, notes = '') {
    const formData = new FormData();
    formData.append('order', orderId);
    formData.append('reference_id', referenceId);
    if (proofFile) formData.append('proof_file', proofFile);
    if (notes) formData.append('notes', notes);
    return await this.request('/orders/confirm-payment', {
      method: 'POST',
      body: formData,
      isForm: true,
    });
  },
  // Settings
  async getSettings() {
    return await this.request('/settings/');
  },
};

// Auth guard function removed - no user login system
