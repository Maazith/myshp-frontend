import { adminAuth } from './admin-auth.js';

const ADMIN_TOKEN_KEY = 'edithcloths_admin_token';
const API_BASE = 'https://api.edithcloths.com/api';

export const adminApi = {
  async request(path, options = {}) {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    const headers = {
      ...options.headers,
    };
    
    // Don't set Content-Type for FormData - browser will set it with boundary
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    if (options.body instanceof FormData) {
      // FormData - don't stringify
      options.body = options.body;
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
    // Get order from orders list
    const orders = await this.getOrders();
    const order = orders.find(o => o.id === parseInt(id)) || orders.find(o => o.order_number === id);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
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
  async createProduct(formData) {
    // FormData is already created in the calling function
    return await this.request('/products/add', {
      method: 'POST',
      body: formData,
    });
  },
  async updateProduct(id, formData) {
    // FormData is already created in the calling function
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
  async uploadBanner(formData) {
    // FormData is already created in the calling function
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
  
  // Bulk delete
  async bulkDelete(type) {
    return await this.request('/admin/bulk-delete', {
      method: 'DELETE',
      body: { type },
    });
  },
};
