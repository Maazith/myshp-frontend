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
let imageCount = 0;
const productImages = []; // Array of { file, preview, id (if existing) }

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

const addVariant = (variant = {}) => {
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
        <label>Size *</label>
        <select name="variant_size_${variantCount}" required>
          <option value="">Select Size</option>
          <option value="S" ${variant.size === 'S' ? 'selected' : ''}>Small (S)</option>
          <option value="M" ${variant.size === 'M' ? 'selected' : ''}>Medium (M)</option>
          <option value="L" ${variant.size === 'L' ? 'selected' : ''}>Large (L)</option>
          <option value="XL" ${variant.size === 'XL' ? 'selected' : ''}>Extra Large (XL)</option>
          <option value="XXL" ${variant.size === 'XXL' ? 'selected' : ''}>2X Large (XXL)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Color *</label>
        <input type="text" name="variant_color_${variantCount}" placeholder="e.g., Black, White, Red" value="${variant.color || ''}" required list="variant-color-suggestions-${variantCount}" />
        <datalist id="variant-color-suggestions-${variantCount}">
          <option value="Black">
          <option value="White">
          <option value="Red">
          <option value="Blue">
          <option value="Green">
          <option value="Yellow">
          <option value="Pink">
          <option value="Purple">
          <option value="Orange">
          <option value="Brown">
          <option value="Grey">
          <option value="Navy">
          <option value="Beige">
          <option value="Khaki">
        </datalist>
      </div>
      <div class="form-group">
        <label>Stock *</label>
        <input type="number" name="variant_stock_${variantCount}" min="0" value="${variant.stock || 0}" required />
      </div>
      <div class="form-group">
        <label>Price Override (optional)</label>
        <input type="number" name="variant_price_${variantCount}" step="0.01" min="0" placeholder="Leave empty to use base price" value="${variant.price || ''}" />
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

const addImageInput = () => {
  imageCount++;
  const container = document.getElementById('images-container');
  if (!container) return;
  
  const imageId = `image_${imageCount}`;
  const imageHtml = `
    <div class="form-card" data-image-id="${imageId}" style="margin-top:1rem;position:relative;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <p class="badge">Image ${imageCount}</p>
        <button type="button" class="btn small ghost" onclick="removeImage('${imageId}')">Remove</button>
      </div>
      <div class="form-group">
        <label>Image File *</label>
        <input type="file" name="${imageId}" accept="image/*" onchange="handleImagePreview('${imageId}', this)" />
        <div id="preview-${imageId}" style="margin-top:0.5rem;"></div>
      </div>
      <div class="form-group" style="display:none;">
        <label>Display Order</label>
        <input type="number" name="${imageId}_order" value="${imageCount - 1}" min="0" />
      </div>
    </div>
  `;
  
  container.insertAdjacentHTML('beforeend', imageHtml);
};

window.removeImage = (imageId) => {
  const imageEl = document.querySelector(`[data-image-id="${imageId}"]`);
  if (imageEl) {
    // Remove from productImages array if it exists
    const index = productImages.findIndex(img => img.id === imageId);
    if (index !== -1) {
      productImages.splice(index, 1);
    }
    imageEl.remove();
  }
};

window.handleImagePreview = (imageId, input) => {
  const file = input.files[0];
  if (!file) return;
  
  const previewDiv = document.getElementById(`preview-${imageId}`);
  if (!previewDiv) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    previewDiv.innerHTML = `
      <img src="${e.target.result}" alt="Preview" style="max-width:200px;max-height:200px;border-radius:var(--radius);object-fit:cover;border:2px solid var(--light-grey);" />
    `;
  };
  reader.readAsDataURL(file);
  
  // Store in productImages array
  const existingIndex = productImages.findIndex(img => img.id === imageId);
  if (existingIndex !== -1) {
    productImages[existingIndex] = { id: imageId, file, preview: reader.result };
  } else {
    productImages.push({ id: imageId, file, preview: reader.result });
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
    
    // Get default size and color from main form
    const defaultSize = document.getElementById('size').value.trim();
    const defaultColor = document.getElementById('color').value.trim();
    
    // Collect variants
    const variantElements = document.querySelectorAll('[data-variant-id]');
    const variantsData = [];
    
    // If no variants added, create one from main form size/color
    if (variantElements.length === 0) {
      if (defaultSize && defaultColor) {
        variantsData.push({
          size: defaultSize,
          color: defaultColor,
          stock: 0, // Default stock, user can edit in variants section
          price: null, // Use base price
        });
      }
    } else {
      // Use variants from the variants section
      variantElements.forEach(variantEl => {
        const id = variantEl.dataset.variantId;
        const sizeInput = variantEl.querySelector(`[name="variant_size_${id}"]`);
        const colorInput = variantEl.querySelector(`[name="variant_color_${id}"]`);
        const stockInput = variantEl.querySelector(`[name="variant_stock_${id}"]`);
        const priceInput = variantEl.querySelector(`[name="variant_price_${id}"]`);
        
        if (sizeInput && colorInput) {
          variantsData.push({
            size: sizeInput.value.trim(),
            color: colorInput.value.trim(),
            stock: parseInt(stockInput.value) || 0,
            price: priceInput.value ? parseFloat(priceInput.value) : null,
          });
        }
      });
    }
    
    formData.variants = variantsData;
    
    // Collect product images
    const imageInputs = document.querySelectorAll('[data-image-id] input[type="file"]');
    const imagesToUpload = [];
    imageInputs.forEach(input => {
      if (input.files && input.files[0]) {
        imagesToUpload.push(input.files[0]);
      }
    });
    
    // Build FormData for multipart upload
    const formDataToSend = new FormData();
    
    // Add basic fields
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description || '');
    if (formData.category) {
      formDataToSend.append('category_id', formData.category);
    }
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('base_price', formData.base_price);
    formDataToSend.append('is_active', formData.is_active ? 'true' : 'false');
    formDataToSend.append('is_featured', formData.is_featured ? 'true' : 'false');
    
    // Add variants
    if (formData.variants && formData.variants.length > 0) {
      formDataToSend.append('variants', JSON.stringify(formData.variants));
    }
    
    // Add hero_media if provided
    if (formData.hero_media) {
      formDataToSend.append('hero_media', formData.hero_media);
    }
    
    // Add product images
    imagesToUpload.forEach((file, idx) => {
      formDataToSend.append(`product_image_${idx}`, file);
    });
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating...';
    }
    
    await adminApi.createProduct(formDataToSend);
    
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
        addVariantBtn.addEventListener('click', () => addVariant());
      }
      
      const addImageBtn = document.getElementById('add-image-btn');
      if (addImageBtn) {
        addImageBtn.addEventListener('click', () => addImageInput());
      }
      
      // Pre-fill first variant with main form size/color when user adds variant
      const sizeInput = document.getElementById('size');
      const colorInput = document.getElementById('color');
      if (sizeInput && colorInput) {
        addVariantBtn?.addEventListener('click', () => {
          // Wait a bit for the variant to be added to DOM
          setTimeout(() => {
            const lastVariant = document.querySelector('[data-variant-id]:last-child');
            if (lastVariant && sizeInput.value && colorInput.value) {
              const variantId = lastVariant.dataset.variantId;
              const variantSizeInput = lastVariant.querySelector(`[name="variant_size_${variantId}"]`);
              const variantColorInput = lastVariant.querySelector(`[name="variant_color_${variantId}"]`);
              if (variantSizeInput && !variantSizeInput.value) {
                variantSizeInput.value = sizeInput.value;
              }
              if (variantColorInput && !variantColorInput.value) {
                variantColorInput.value = colorInput.value;
              }
            }
          }, 100);
        });
      }
    });
  }
}
