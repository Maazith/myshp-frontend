import { adminAuth } from './admin-auth.js';
import { adminApi } from './admin-api.js';

if (!adminAuth.requireAuth()) return;

let variantCount = 0;

async function loadCategories() {
  try {
    const categories = await adminApi.getCategories();
    const select = document.getElementById('category');
    select.innerHTML = '<option value="">Select Category</option>' + 
      categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
  } catch (error) {
    console.error('Categories load error:', error);
  }
}

function addVariant() {
  variantCount++;
  const variantHtml = `
    <div class="glass-card" style="padding: 1rem; margin-bottom: 1rem;" data-variant="${variantCount}">
      <div class="form-group">
        <label>Size</label>
        <input type="text" class="variant-size" placeholder="e.g., S, M, L">
      </div>
      <div class="form-group">
        <label>Color</label>
        <input type="text" class="variant-color" placeholder="e.g., Red, Blue">
      </div>
      <div class="form-group">
        <label>Stock</label>
        <input type="number" class="variant-stock" min="0" value="0">
      </div>
      <div class="form-group">
        <label>Price Override (optional)</label>
        <input type="number" class="variant-price" step="0.01" min="0" placeholder="Leave empty to use base price">
      </div>
      <button type="button" class="btn ghost small" onclick="removeVariant(${variantCount})">Remove</button>
    </div>
  `;
  document.getElementById('variants-list').insertAdjacentHTML('beforeend', variantHtml);
}

window.removeVariant = (id) => {
  document.querySelector(`[data-variant="${id}"]`).remove();
};

document.getElementById('add-variant').addEventListener('click', addVariant);

document.getElementById('product-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById('form-error');
  errorEl.textContent = '';
  
  try {
    const variants = Array.from(document.querySelectorAll('[data-variant]')).map(el => ({
      size: el.querySelector('.variant-size').value || null,
      color: el.querySelector('.variant-color').value || null,
      stock: parseInt(el.querySelector('.variant-stock').value) || 0,
      price_override: el.querySelector('.variant-price').value || null,
    })).filter(v => v.size || v.color);
    
    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('category_id', document.getElementById('category').value);
    formData.append('gender', document.getElementById('gender').value);
    formData.append('base_price', document.getElementById('base-price').value);
    formData.append('is_featured', document.getElementById('is-featured').checked);
    formData.append('is_active', document.getElementById('is-active').checked);
    
    const heroFile = document.getElementById('hero-media').files[0];
    if (heroFile) {
      formData.append('hero_media', heroFile);
    }
    
    if (variants.length > 0) {
      formData.append('variants', JSON.stringify(variants));
    }
    
    await adminApi.createProduct(formData);
    window.location.href = 'products.html';
  } catch (error) {
    errorEl.textContent = error.message;
  }
});

loadCategories();

