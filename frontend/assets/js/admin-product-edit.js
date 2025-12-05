import { adminAuth } from './admin-auth.js';
import { adminApi } from './admin-api.js';

if (!adminAuth.requireAuth()) return;

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

if (!productId) {
  window.location.href = 'products.html';
}

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

async function loadProduct() {
  try {
    const product = await adminApi.getProduct(productId);
    if (!product) return;
    
    document.getElementById('title').value = product.title || '';
    document.getElementById('description').value = product.description || '';
    document.getElementById('category').value = product.category?.id || '';
    document.getElementById('gender').value = product.gender || 'M';
    document.getElementById('base-price').value = product.base_price || 0;
    document.getElementById('is-active').checked = product.is_active !== false;
    
    // Show current hero image if available
    if (product.hero_media_url) {
      const currentPreview = document.getElementById('current-hero-preview');
      const currentImg = document.getElementById('current-hero-img');
      currentImg.src = product.hero_media_url;
      currentPreview.style.display = 'block';
    }
    
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach(variant => {
        addVariant(variant);
      });
    }
  } catch (error) {
    console.error('Product load error:', error);
    document.getElementById('form-error').textContent = error.message;
  }
}

function addVariant(variant = {}) {
  variantCount++;
  const variantHtml = `
    <div class="glass-card" style="padding: 1.5rem; margin-bottom: 1.5rem;" data-variant="${variantCount}">
      <div class="form-group">
        <label>Size</label>
        <input type="text" class="variant-size" value="${variant.size || ''}" placeholder="e.g., S, M, L">
      </div>
      <div class="form-group">
        <label>Color</label>
        <input type="text" class="variant-color" value="${variant.color || ''}" placeholder="e.g., Red, Blue">
      </div>
      <div class="form-group">
        <label>Stock</label>
        <input type="number" class="variant-stock" min="0" value="${variant.stock || 0}">
      </div>
      <div class="form-group">
        <label>Price Override (optional)</label>
        <input type="number" class="variant-price" step="0.01" min="0" value="${variant.price_override || ''}" placeholder="Leave empty to use base price">
      </div>
      <button type="button" class="btn ghost small" onclick="removeVariant(${variantCount})" style="margin-top: 0.5rem;">Remove</button>
    </div>
  `;
  document.getElementById('variants-list').insertAdjacentHTML('beforeend', variantHtml);
}

window.removeVariant = (id) => {
  document.querySelector(`[data-variant="${id}"]`).remove();
};

document.getElementById('add-variant').addEventListener('click', () => addVariant());

// Hero image preview for new upload
const heroMediaInput = document.getElementById('hero-media');
const newHeroPreviewDiv = document.getElementById('new-hero-image-preview');
const newHeroPreviewImg = document.getElementById('new-hero-preview-img');
const removeNewHeroPreviewBtn = document.getElementById('remove-new-hero-preview');

heroMediaInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      newHeroPreviewImg.src = event.target.result;
      newHeroPreviewDiv.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    newHeroPreviewDiv.style.display = 'none';
  }
});

removeNewHeroPreviewBtn.addEventListener('click', () => {
  heroMediaInput.value = '';
  newHeroPreviewDiv.style.display = 'none';
  newHeroPreviewImg.src = '';
});

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
    formData.append('is_active', document.getElementById('is-active').checked);
    
    const heroFile = document.getElementById('hero-media').files[0];
    if (heroFile) {
      formData.append('hero_media', heroFile);
    }
    
    if (variants.length > 0) {
      formData.append('variants', JSON.stringify(variants));
    }
    
    await adminApi.updateProduct(productId, formData);
    window.location.href = 'products.html';
  } catch (error) {
    errorEl.textContent = error.message;
  }
});

loadCategories();
loadProduct();

