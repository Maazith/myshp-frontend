import { adminAuth } from './admin-auth.js';

const ADMIN_TOKEN_KEY = 'edithcloths_admin_token';
const API_BASE = 'https://myshp-backend.onrender.com/api';

export const adminApi = {
  async request(path, options = {}) {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    } else if (options.body && typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
    }
    
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      body: options.body,
    });
    
    if (response.status === 401) {
      adminAuth.clearAuth();
      window.location.href = '/admin/login.html';
      return null;
    }
    
    if (response.status === 204) return null;
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.detail || data.message || `HTTP ${response.status}`);
    }
    return data;
  },
  
  // Orders
  async getOrders() {
    return await this.request('/orders/');
  },
  async getOrder(id) {
    // Get order from orders list or use detail endpoint if available
    const orders = await this.getOrders();
    return orders.find(o => o.id === parseInt(id)) || orders.find(o => o.order_number === id);
  },
  async updateOrderStatus(id, status) {
    return await this.request(`/orders/${id}/status`, {
      method: 'POST',
      body: { status },
    });
  },
  
  // Products
  async getProducts() {
    return await this.request('/products/');
  },
  async getProduct(id) {
    return await this.request(`/products/id/${id}/`);
  },
  async createProduct(data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'variants' || key === 'images') {
        formData.append(key, JSON.stringify(data[key]));
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return await this.request('/products/add', {
      method: 'POST',
      body: formData,
    });
  },
  async updateProduct(id, data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'variants' || key === 'images') {
        formData.append(key, JSON.stringify(data[key]));
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return await this.request(`/products/${id}/edit`, {
      method: 'PUT',
      body: formData,
    });
  },
  async deleteProduct(id) {
    return await this.request(`/products/${id}/delete`, {
      method: 'DELETE',
    });
  },
  
  // Categories
  async getCategories() {
    return await this.request('/categories/');
  },
  async createCategory(data) {
    return await this.request('/categories/add', {
      method: 'POST',
      body: data,
    });
  },
  
  // Banners
  async getBanners() {
    return await this.request('/banners/');
  },
  async uploadBanner(data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return await this.request('/banners/upload', {
      method: 'POST',
      body: formData,
    });
  },
  async deleteBanner(id) {
    return await this.request(`/banners/${id}/`, {
      method: 'DELETE',
    });
  },
};

