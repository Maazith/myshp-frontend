import { adminAuth } from './admin-auth.js';
import { adminApi } from './admin-api.js';
import { formatCurrency, getAbsoluteImageUrl } from './components.js';

if (!adminAuth.requireAuth()) return;

async function loadProducts() {
  try {
    const products = await adminApi.getProducts();
    if (!products) return;
    
    if (products.length === 0) {
      document.getElementById('products-list').innerHTML = '<p style="padding: 2rem; text-align: center; color: var(--text-light);">No products found</p>';
      return;
    }
    
    const productsHtml = products.map(product => {
      // Get image URL from hero_media field or use placeholder
      const imageUrl = product.hero_media ? getAbsoluteImageUrl(product.hero_media) : '../assets/img/placeholder.jpg';
      return `
        <div style="padding: 1.5rem; border-bottom: 1px solid rgba(230,230,230,0.1); display: grid; grid-template-columns: 100px 1fr auto; gap: 1.5rem; align-items: center;">
          <img src="${imageUrl}" alt="${product.title}" style="width: 100px; height: 100px; object-fit: cover; border-radius: var(--radius);">
          <div>
            <p style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem;">${product.title}</p>
            <p style="color: var(--text-light); font-size: 0.9rem;">${product.gender} • ${formatCurrency(product.base_price)}</p>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <a href="product-edit.html?id=${product.id}" class="btn small">Edit</a>
            <button class="btn small ghost" onclick="deleteProduct(${product.id})">Delete</button>
          </div>
        </div>
      `;
    }).join('');
    
    document.getElementById('products-list').innerHTML = productsHtml;
  } catch (error) {
    console.error('Products load error:', error);
    document.getElementById('products-list').innerHTML = `<p style="padding: 2rem; color: var(--danger);">Error: ${error.message}</p>`;
  }
}

window.deleteProduct = async (id) => {
  if (!confirm('Are you sure you want to delete this product?')) return;
  try {
    await adminApi.deleteProduct(id);
    loadProducts();
  } catch (error) {
    alert('Error deleting product: ' + error.message);
  }
};

// Delete all products
document.getElementById('delete-all-products')?.addEventListener('click', async () => {
  if (!confirm('⚠️ WARNING: This will delete ALL products permanently. This action cannot be undone!\n\nAre you absolutely sure?')) {
    return;
  }
  
  if (!confirm('This is your last chance. Delete ALL products?')) {
    return;
  }
  
  try {
    const result = await adminApi.bulkDelete('products');
    alert(`Successfully deleted ${result.deleted_count} product(s)`);
    loadProducts();
  } catch (error) {
    alert('Error deleting products: ' + error.message);
  }
});

loadProducts();

