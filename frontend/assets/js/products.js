import { api } from './api.js';
import { createProductCard, initCarousels, mountNavbar, mountFooter } from './components.js';
import { ConnectionResolver } from './connection-resolver.js';

const container = document.getElementById('products-list');
const gender = document.body.dataset.gender;

// Auto-resolve backend connection on page load
const resolveConnection = async () => {
  try {
    const resolver = new ConnectionResolver();
    const result = await resolver.autoResolve();
    if (!result.success) {
      console.warn('⚠️ Backend connection issue:', result.message);
    }
  } catch (err) {
    console.warn('⚠️ Connection resolver error:', err);
  }
};

const fetchProducts = async () => {
  if (!container) return;
  try {
    // Build URL correctly - don't expand by color, show one product per item
    // Add cache-busting timestamp to ensure fresh data
    const timestamp = `_t=${Date.now()}`;
    const url = gender 
      ? `/products/?gender=${gender}&expand_by_color=false&${timestamp}` 
      : `/products/?expand_by_color=false&${timestamp}`;
    
    const data = await api.request(url, { cacheBust: true });
    
    // Handle empty products array gracefully
    if (!data || !Array.isArray(data) || data.length === 0) {
      container.innerHTML = '<p style="color:#E6E6E6;text-align:center;padding:2rem;">No products found.</p>';
      return;
    }
    
    container.innerHTML = data.map((product) => createProductCard(product)).join('');
    initCarousels();
  } catch (err) {
    console.error('❌ Error fetching products:', err);
    // User-friendly error message
    container.innerHTML = '<p style="color:#E6E6E6;text-align:center;padding:2rem;">No products found. Please try again later.</p>';
  }
};

document.body.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action="view"]');
  if (target) {
    const id = target.dataset.product;
    // Navigate to product detail page (color selection happens on detail page)
    window.location.href = `product_detail.html?id=${id}`;
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  // Resolve backend connection first
  await resolveConnection();
  await mountNavbar();
  await mountFooter();
  fetchProducts();
});
