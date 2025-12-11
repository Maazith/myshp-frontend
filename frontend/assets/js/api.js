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
  // Production fallback - ALWAYS USE HTTPS in production
  // Render backend URL (primary) - HTTPS ONLY
  const RENDER_BACKEND = 'https://myshp-backend.onrender.com/api';
  // Custom domain (if configured) - HTTPS ONLY
  const CUSTOM_DOMAIN = 'https://api.edithcloths.com/api';
  
  // In production (not localhost), ensure HTTPS
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== '' && window.location.protocol === 'https:') {
      // Production with HTTPS - use HTTPS backend
      return RENDER_BACKEND;
    }
  }
  
  // Prefer Render URL as it's more reliable (HTTPS)
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
    const options = { 
      method,
      credentials: 'include'  // CRITICAL: Include cookies for session-based cart
    };
    
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
      const apiBaseUrl = getApiBaseUrl();
      const fullUrl = `${apiBaseUrl}${requestPath}`;
      
      const response = await fetch(fullUrl, options);
      
      if (response.status === 204) return null;
      
      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        // Handle 401 errors (unauthorized)
        if (response.status === 401) {
          // Clear tokens but don't redirect automatically
          localStorage.removeItem(ACCESS_KEY);
          localStorage.removeItem(REFRESH_KEY);
          localStorage.removeItem(USER_KEY);
          throw new Error('Please log in to continue.');
        }
        
        // Handle 404 errors (not found)
        if (response.status === 404) {
          // Return empty array/object for list endpoints, null for single items
          if (path.includes('/products/') || path.includes('/categories/') || path.includes('/banners/')) {
            return [];
          }
          throw new Error('Item not found.');
        }
        
        // Handle 400 errors (validation errors)
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
          throw new Error(errorMsg || 'Please check your input and try again.');
        }
        
        // Handle 500 errors (server errors)
        if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
        
        // Generic error handling
        const errorMessage = data.detail || data.message || data.error || `Error ${response.status}`;
        throw new Error(errorMessage);
      }
      
      return data;
    } catch (error) {
      // Network/connection errors
      if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
        const backendUrl = getApiBaseUrl().replace('/api', '');
        
        // User-friendly error message based on endpoint type
        if (path.includes('/products/')) {
          throw new Error('Unable to load products. Please check your connection and try again.');
        } else if (path.includes('/cart/')) {
          throw new Error('Unable to load cart. Please refresh the page.');
        } else if (path.includes('/orders/')) {
          throw new Error('Unable to load orders. Please try again later.');
        } else {
          throw new Error('Unable to connect to server. Please check your connection.');
        }
      }
      
      // Re-throw other errors as-is
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
      credentials: 'include',  // Include cookies for session
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
