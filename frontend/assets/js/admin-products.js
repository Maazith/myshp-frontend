import { adminApi } from './admin-api.js';
import { adminAuth } from './admin-auth.js';
import { mountAdminNavbar } from './admin-navbar.js';
import { formatCurrency } from './components.js';

// Page-specific check - only run on products list page
const isProductsPage = () => {
  const path = window.location.pathname;
  return path.includes('products.html') && !path.includes('product-add') && !path.includes('product-edit');
};

if (!isProductsPage()) {
  console.warn('[Admin Products] This script should only run on products list page');
} else {
  if (!adminAuth.requireAuth()) {
    // Redirect handled
  } else {
    mountAdminNavbar();

    const loadProducts = async () => {
  try {
    const products = await adminApi.getProducts();
    const container = document.getElementById('products-list');
    
    if (!container) return;
    
    if (products.length === 0) {
      container.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:2rem;">No products found.</p>';
      return;
    }
    
    container.innerHTML = products.map(product => `
      <div class="cart-item">
        ${product.hero_media_url ? `
          <img src="${product.hero_media_url}" alt="${product.title || product.name}" style="width:80px;height:80px;object-fit:cover;border-radius:var(--radius);" />
        ` : '<div style="width:80px;height:80px;background:rgba(255,255,255,0.1);border-radius:var(--radius);"></div>'}
        <div class="cart-item-info">
          <h3>${product.title || product.name}</h3>
          <p>${product.category?.name || 'No category'}</p>
          <p>${product.gender || 'N/A'}</p>
          <p><strong>${formatCurrency(product.base_price)}</strong></p>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.5rem;align-items:flex-end;">
          <span class="badge">${product.is_active ? 'Active' : 'Inactive'}</span>
          <div style="display:flex;gap:0.5rem;">
            <a href="/admin/product-edit.html?id=${product.id}" class="btn small">Edit</a>
            <button class="btn small ghost" onclick="deleteProduct(${product.id}, '${product.title || product.name}')">Delete</button>
          </div>
        </div>
      </div>
    `).join('');
    
  } catch (err) {
    console.error('[Admin Products] Error loading products:', {
      error: err,
      message: err.message,
      stack: err.stack,
      apiBaseUrl: adminApi.baseUrl,
      hasToken: !!adminApi.accessToken
    });
    const container = document.getElementById('products-list');
    if (container) {
      container.innerHTML = `<div class="form-card" style="background:var(--danger);color:#fff;padding:1.5rem;">
        <h3>Error Loading Products</h3>
        <p><strong>Error:</strong> ${err.message || 'Unknown error'}</p>
        <p style="font-size:0.85rem;margin-top:0.5rem;">Check browser console for details. API Base URL: ${adminApi.baseUrl}</p>
      </div>`;
    }
  }
};

window.deleteProduct = async (id, name) => {
  if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
    return;
  }
  
  try {
    await adminApi.deleteProduct(id);
    alert('Product deleted successfully!');
    loadProducts();
  } catch (err) {
    alert('Error deleting product: ' + (err.message || 'Unknown error'));
  }
};

    document.addEventListener('DOMContentLoaded', () => {
      console.log('[Admin Products] Initializing products list page');
      loadProducts();
    });
  }
}
