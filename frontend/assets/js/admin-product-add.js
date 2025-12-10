import { adminApi } from './admin-api.js';
import { adminAuth } from './admin-auth.js';
import { mountAdminNavbar } from './admin-navbar.js';

// Page-specific check - only run on product add page
const isProductAddPage = () => {
  const path = window.location.pathname;
  return path.includes('product-add.html');
};

if (!isProductAddPage()) {
  console.warn('[Admin Product Add] This script should only run on product add page');
} else {
  if (!adminAuth.requireAuth()) {
    // Redirect handled
  } else {
    mountAdminNavbar();

let variantCount = 0;
const variants = [];

const loadCategories = async () => {
  try {
    const categories = await adminApi.request('/categories/');
    const select = document.getElementById('category');
    if (select && categories.length > 0) {
      select.innerHTML = '<option value="">Select Category</option>' + 
        categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
    }
  } catch (err) {
    console.error('Error loading categories:', err);
  }
};

const addVariant = () => {
  variantCount++;
  const container = document.getElementById('variants-container');
  if (!container) return;
  
  const variantHtml = `
    <div class="form-card" data-variant-id="${variantCount}" style="margin-top:1rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <p class="badge">Variant ${variantCount}</p>
        <button type="button" class="btn small ghost" onclick="removeVariant(${variantCount})">Remove</button>
      </div>
      <div class="form-group">
        <label>Size</label>
        <input type="text" name="variant_size_${variantCount}" placeholder="e.g., S, M, L, XL" required />
      </div>
      <div class="form-group">
        <label>Color</label>
        <input type="text" name="variant_color_${variantCount}" placeholder="e.g., Black, White" required />
      </div>
      <div class="form-group">
        <label>Stock</label>
        <input type="number" name="variant_stock_${variantCount}" min="0" value="0" required />
      </div>
      <div class="form-group">
        <label>Price Override (optional)</label>
        <input type="number" name="variant_price_${variantCount}" step="0.01" min="0" placeholder="Leave empty to use base price" />
      </div>
    </div>
  `;
  
  container.insertAdjacentHTML('beforeend', variantHtml);
};

window.removeVariant = (id) => {
  const variant = document.querySelector(`[data-variant-id="${id}"]`);
  if (variant) {
    variant.remove();
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const errorEl = document.getElementById('form-error');
  
  if (errorEl) errorEl.textContent = '';
  
  try {
    // Collect form data
    const formData = {
      title: document.getElementById('title').value.trim(),
      description: document.getElementById('description').value.trim(),
      category: document.getElementById('category').value || null, // API layer converts to 'category_id'
      gender: document.getElementById('gender').value,
      base_price: parseFloat(document.getElementById('base_price').value) || 0,
      is_active: document.getElementById('is_active').checked,
      is_featured: document.getElementById('is_featured').checked,
      hero_media: document.getElementById('hero_media').files[0] || null,
    };
    
    // Collect variants
    const variantElements = document.querySelectorAll('[data-variant-id]');
    const variantsData = [];
    variantElements.forEach(variantEl => {
      const id = variantEl.dataset.variantId;
      variantsData.push({
        size: variantEl.querySelector(`[name="variant_size_${id}"]`).value.trim(),
        color: variantEl.querySelector(`[name="variant_color_${id}"]`).value.trim(),
        stock: parseInt(variantEl.querySelector(`[name="variant_stock_${id}"]`).value) || 0,
        price: variantEl.querySelector(`[name="variant_price_${id}"]`).value ? 
          parseFloat(variantEl.querySelector(`[name="variant_price_${id}"]`).value) : null,
      });
    });
    
    formData.variants = variantsData;
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating...';
    }
    
    await adminApi.createProduct(formData);
    
    alert('Product created successfully!');
    window.location.href = '/admin/products.html';
    
  } catch (err) {
    console.error('[Admin Product Add] Error creating product:', {
      error: err,
      message: err.message,
      stack: err.stack,
      apiBaseUrl: adminApi.baseUrl,
      hasToken: !!adminApi.accessToken
    });
    if (errorEl) {
      errorEl.textContent = err.message || 'Error creating product. Please try again. Check console for details.';
      errorEl.style.display = 'block';
    }
    
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Product';
    }
  }
};

    document.addEventListener('DOMContentLoaded', () => {
      console.log('[Admin Product Add] Initializing product add page');
      loadCategories();
      
      const form = document.getElementById('product-form');
      if (form) {
        form.addEventListener('submit', handleSubmit);
      }
      
      const addVariantBtn = document.getElementById('add-variant-btn');
      if (addVariantBtn) {
        addVariantBtn.addEventListener('click', addVariant);
      }
    });
  }
}
