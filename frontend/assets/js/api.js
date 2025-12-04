// API Base URL - Use environment variable or fallback to production URL
// Vercel: Set NEXT_PUBLIC_API_BASE_URL or VERCEL_ENV_API_BASE_URL in environment variables
// For local development, set window.API_BASE_URL before loading this script
const API_BASE = (() => {
  // Check for environment variable (Vercel sets this)
  if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  // Check for window variable (can be set in index.html)
  if (typeof window !== 'undefined' && window.API_BASE_URL) {
    return window.API_BASE_URL;
  }
  // Check for Vercel environment variable
  if (typeof window !== 'undefined' && window.VERCEL_ENV_API_BASE_URL) {
    return window.VERCEL_ENV_API_BASE_URL;
  }
  // Production fallback
  return 'https://myshp-backend.onrender.com/api';
})();
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

export const api = {
  baseUrl: API_BASE,
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
    window.location.href = getLoginPath();
  },
  async request(path, { method = 'GET', body, isForm = false } = {}) {
    const options = { method };
    
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
      if (body) {
        options.body = JSON.stringify(body);
      }
    }
    
    try {
      const response = await fetch(`${API_BASE}${path}`, options);
      if (response.status === 204) return null;
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
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
        throw new Error(`Failed to connect to server. Make sure the backend is running at ${API_BASE}`);
      }
      throw error;
    }
  },
  async login({ username, password }) {
    const payload = await this.request('/auth/login', {
      method: 'POST',
      body: { username, password },
    });
    localStorage.setItem(ACCESS_KEY, payload.access);
    localStorage.setItem(REFRESH_KEY, payload.refresh);
    if (payload.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
    }
    return payload;
  },
  async register(data) {
    return await this.request('/auth/register', {
      method: 'POST',
      body: data,
    });
  },
  // Products
  async getProducts(gender = null) {
    const path = gender ? `/products/?gender=${gender}` : '/products/';
    return await this.request(path);
  },
  async getProduct(slug) {
    return await this.request(`/products/${slug}/`);
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

// Helper function to get correct login path
function getLoginPath() {
  const currentPath = window.location.pathname;
  // If already in pages directory, use relative path
  if (currentPath.includes('/pages/') || currentPath.includes('pages/')) {
    return 'login.html';
  }
  // If in admin directory, go up then into pages
  if (currentPath.includes('/admin/') || currentPath.includes('admin/')) {
    return '../pages/login.html';
  }
  // If at root, go to pages
  return 'pages/login.html';
}

// Auth guard function
export function requireAuth() {
  if (!api.isAuthenticated) {
    window.location.href = getLoginPath();
    return false;
  }
  return true;
}
