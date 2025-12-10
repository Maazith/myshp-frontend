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
    
    console.log('📦 Fetching products from:', api.baseUrl + url);
    console.log('📦 Gender filter:', gender || 'all');
    
    const data = await api.request(url, { cacheBust: true });
    
    console.log('📦 Products received:', data);
    console.log('📦 Number of products:', data ? (Array.isArray(data) ? data.length : 'not an array') : 'null/undefined');
    
    // Handle empty products array gracefully
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log('⚠️ No products found in response');
      container.innerHTML = '<p style="color:#E6E6E6;text-align:center;padding:2rem;">No products found.</p>';
      return;
    }
    
    // Log each product for debugging
    data.forEach((product, index) => {
      console.log(`  Product ${index + 1}:`, {
        id: product.id,
        name: product.name || product.title,
        title: product.title,
        base_price: product.base_price,
        hero_media_url: product.hero_media_url,
        is_active: product.is_active,
        gender: product.gender
      });
    });
    
    container.innerHTML = data.map((product) => createProductCard(product)).join('');
    initCarousels();
    console.log('✅ Products rendered successfully');
  } catch (err) {
    console.error('❌ Error fetching products:', err);
    console.error('❌ Error details:', {
      message: err.message,
      stack: err.stack,
      apiBaseUrl: api.baseUrl
    });
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
