import { api } from './api.js';

export const adminApi = {
  // Categories
  async getCategories() {
    return await api.request('/categories/');
  },
  
  async createCategory(name, description = '') {
    return await api.request('/categories/add', {
      method: 'POST',
      body: { name, description },
    });
  },

  // Products
  async getProducts() {
    return await api.request('/products/', { cacheBust: true });
  },

  async getProduct(id) {
    return await api.request(`/products/id/${id}/`, { cacheBust: true });
  },

  async createProduct(formData) {
    return await api.request('/products/add', {
      method: 'POST',
      body: formData,
      isForm: true,
    });
  },

  async updateProduct(id, formData) {
    return await api.request(`/products/${id}/edit`, {
      method: 'PUT',
      body: formData,
      isForm: true,
    });
  },

  async deleteProduct(id) {
    return await api.request(`/products/${id}/delete`, {
      method: 'DELETE',
    });
  },

  async bulkDelete(type) {
    return await api.request('/admin/bulk-delete', {
      method: 'DELETE',
      body: { type },
    });
  },

  // Orders
  async getOrders() {
    return await api.request('/orders/');
  },

  async getOrder(id) {
    return await api.request(`/orders/${id}/`);
  },

  async updateOrderStatus(id, status) {
    return await api.request(`/orders/${id}/status`, {
      method: 'POST',
      body: { status },
    });
  },

  async markOrderPaid(id) {
    return await api.request(`/orders/${id}/mark-paid`, {
      method: 'POST',
    });
  },

  // Banners
  async getBanners() {
    return await api.request('/banners/');
  },

  async uploadBanner(formData) {
    return await api.request('/banners/upload', {
      method: 'POST',
      body: formData,
      isForm: true,
    });
  },

  async deleteBanner(id) {
    return await api.request(`/banners/${id}/`, {
      method: 'DELETE',
    });
  },

  // Users
  async getUsers() {
    return await api.request('/users/');
  },
};
