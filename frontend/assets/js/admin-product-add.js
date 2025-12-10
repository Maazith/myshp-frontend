import { adminAuth } from './admin-auth.js';
import { adminApi } from './admin-api.js';

if (!adminAuth.requireAuth()) return;

let variantCount = 0;

function addVariant(variantData = null) {
  variantCount++;
  const size = variantData?.size || '';
  const color = variantData?.color || '';
  const stock = variantData?.stock || 0;
  const price = variantData?.price_override || variantData?.price || '';
  
  const variantHtml = `
    <div class="glass-card" style="padding: 1rem; margin-bottom: 1rem; border: 1px solid rgba(230,230,230,0.2);" data-variant="${variantCount}">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
        <div class="form-group">
          <label>Size *</label>
          <input type="text" class="variant-size" placeholder="e.g., S, M, L, XL" value="${size}" required>
        </div>
        <div class="form-group">
          <label>Color *</label>
          <input type="text" class="variant-color" placeholder="e.g., Red, Blue, Black" value="${color}" required>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
        <div class="form-group">
          <label>Stock</label>
          <input type="number" class="variant-stock" min="0" value="${stock}">
        </div>
        <div class="form-group">
          <label>Price Override (optional)</label>
          <input type="number" class="variant-price" step="0.01" min="0" placeholder="Leave empty to use base price" value="${price}">
        </div>
      </div>
      <button type="button" class="btn ghost small" onclick="removeVariant(${variantCount})" style="color: var(--danger);">Remove Variant</button>
    </div>
  `;
  const variantsList = document.getElementById('variants-list');
  if (variantsList) {
    variantsList.insertAdjacentHTML('beforeend', variantHtml);
  }
}

window.removeVariant = (id) => {
  document.querySelector(`[data-variant="${id}"]`).remove();
};

document.getElementById('add-variant').addEventListener('click', addVariant);

// Hero image preview
const heroMediaInput = document.getElementById('hero-media');
const heroPreviewDiv = document.getElementById('hero-image-preview');
const heroPreviewImg = document.getElementById('hero-preview-img');
const removeHeroPreviewBtn = document.getElementById('remove-hero-preview');

heroMediaInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      heroPreviewImg.src = event.target.result;
      heroPreviewDiv.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    heroPreviewDiv.style.display = 'none';
  }
});

removeHeroPreviewBtn.addEventListener('click', () => {
  heroMediaInput.value = '';
  heroPreviewDiv.style.display = 'none';
  heroPreviewImg.src = '';
});

document.getElementById('product-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById('form-error');
  errorEl.textContent = '';
  
  try {
    // Collect variants - ensure all fields are properly collected
    const variants = Array.from(document.querySelectorAll('[data-variant]')).map(el => {
      const size = el.querySelector('.variant-size')?.value?.trim() || null;
      const color = el.querySelector('.variant-color')?.value?.trim() || null;
      const stockInput = el.querySelector('.variant-stock');
      const stock = stockInput ? parseInt(stockInput.value) || 0 : 0;
      const priceInput = el.querySelector('.variant-price');
      const priceValue = priceInput?.value?.trim();
      const price = priceValue && priceValue !== '' ? parseFloat(priceValue) : null;
      
      return {
        size: size,
        color: color,
        stock: stock,
        price: price, // Backend expects 'price' field for price_override
      };
    }).filter(v => v.size && v.color); // Both size and color are required
    
    // Validate variants before submission
    if (variants.length === 0) {
      const addVariant = confirm('No variants added. Product will be created with a default variant (M, Black). Continue?');
      if (!addVariant) {
        return;
      }
    }
    
    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
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
    
    await adminApi.createProduct(formData);
    window.location.href = 'products.html';
  } catch (error) {
    errorEl.textContent = error.message;
  }
});

// Initialize on page load

