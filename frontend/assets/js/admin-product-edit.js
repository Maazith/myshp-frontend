import { adminApi } from './admin-api.js';
import { adminAuth } from './admin-auth.js';
import { mountAdminNavbar } from './admin-navbar.js';

// Page-specific check - only run on product edit page
const isProductEditPage = () => {
  const path = window.location.pathname;
  return path.includes('product-edit.html');
};

if (!isProductEditPage()) {
  console.warn('[Admin Product Edit] This script should only run on product edit page');
} else {
  if (!adminAuth.requireAuth()) {
    // Redirect handled
  } else {
    mountAdminNavbar();

const getProductId = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
};

let variantCount = 0;
let imageCount = 0;
const productImages = []; // Array of { id (existing), file (new), preview, image_url }

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

const loadProduct = async () => {
  const productId = getProductId();
  if (!productId) {
    window.location.href = '/admin/products.html';
    return;
  }
  
  try {
    const product = await adminApi.getProduct(productId);
    
    // Fill form fields
    document.getElementById('title').value = product.title || '';
    document.getElementById('description').value = product.description || '';
    document.getElementById('category').value = product.category?.id || '';
    document.getElementById('gender').value = product.gender || '';
    document.getElementById('base_price').value = product.base_price || '';
    document.getElementById('is_active').checked = product.is_active !== false;
    document.getElementById('is_featured').checked = product.is_featured || false;
    
    // Load default size/color from first variant if available
    if (product.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      const sizeInput = document.getElementById('size');
      const colorInput = document.getElementById('color');
      if (sizeInput && firstVariant.size) {
        sizeInput.value = firstVariant.size;
      }
      if (colorInput && firstVariant.color) {
        colorInput.value = firstVariant.color;
      }
    }
    
    // Load variants
    const container = document.getElementById('variants-container');
    if (container && product.variants && product.variants.length > 0) {
      container.innerHTML = '';
      product.variants.forEach((variant) => {
        addVariant({
          size: variant.size,
          color: variant.color,
          stock: variant.stock || 0,
          price: variant.price_override || null,
        });
      });
    }
    
    // Load product images
    const imagesContainer = document.getElementById('images-container');
    if (imagesContainer && product.images && product.images.length > 0) {
      imagesContainer.innerHTML = '';
      // Sort by display_order
      const sortedImages = [...product.images].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      sortedImages.forEach((image) => {
        addImageInput({
          id: image.id,
          image_url: image.image_url,
          display_order: image.display_order || 0
        });
      });
    }
    
  } catch (err) {
    console.error('[Admin Product Edit] Error loading product:', {
      error: err,
      message: err.message,
      stack: err.stack,
      apiBaseUrl: adminApi.baseUrl,
      hasToken: !!adminApi.accessToken
    });
    alert(`Error loading product: ${err.message || 'Unknown error'}. Check console for details.`);
    window.location.href = '/admin/products.html';
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
        <input type="text" name="variant_color_${variantCount}" placeholder="e.g., Black, White, Red" value="${variant.color || ''}" required list="variant-color-suggestions-edit-${variantCount}" />
        <datalist id="variant-color-suggestions-edit-${variantCount}">
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

const addImageInput = (existingImage = null) => {
  imageCount++;
  const container = document.getElementById('images-container');
  if (!container) return;
  
  const imageId = existingImage ? `existing_image_${existingImage.id}` : `image_${imageCount}`;
  const isExisting = !!existingImage;
  
  const imageHtml = `
    <div class="form-card" data-image-id="${imageId}" data-image-db-id="${existingImage?.id || ''}" style="margin-top:1rem;position:relative;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <p class="badge">Image ${imageCount}${isExisting ? ' (Existing)' : ''}</p>
        <button type="button" class="btn small ghost" onclick="removeImage('${imageId}', ${existingImage?.id || 'null'})">Remove</button>
      </div>
      ${isExisting ? `
        <div class="form-group">
          <label>Current Image</label>
          <img src="${existingImage.image_url}" alt="Current" style="max-width:200px;max-height:200px;border-radius:var(--radius);object-fit:cover;border:2px solid var(--light-grey);display:block;" />
        </div>
      ` : ''}
      <div class="form-group">
        <label>${isExisting ? 'Replace Image (leave empty to keep current)' : 'Image File *'}</label>
        <input type="file" name="${imageId}" accept="image/*" onchange="handleImagePreview('${imageId}', this)" ${isExisting ? '' : 'required'} />
        <div id="preview-${imageId}" style="margin-top:0.5rem;"></div>
      </div>
      <div class="form-group" style="display:none;">
        <label>Display Order</label>
        <input type="number" name="${imageId}_order" value="${existingImage?.display_order || imageCount - 1}" min="0" />
      </div>
    </div>
  `;
  
  container.insertAdjacentHTML('beforeend', imageHtml);
  
  if (existingImage) {
    productImages.push({ id: imageId, dbId: existingImage.id, file: null, preview: existingImage.image_url, image_url: existingImage.image_url });
  }
};

window.removeImage = (imageId, dbId) => {
  const imageEl = document.querySelector(`[data-image-id="${imageId}"]`);
  if (imageEl) {
    // If it's an existing image, mark it for deletion
    if (dbId) {
      const index = productImages.findIndex(img => img.dbId === dbId);
      if (index !== -1) {
        productImages[index].markedForDeletion = true;
      }
    } else {
      // Remove from productImages array if it's a new image
      const index = productImages.findIndex(img => img.id === imageId);
      if (index !== -1) {
        productImages.splice(index, 1);
      }
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
  
  // Update productImages array
  const existingIndex = productImages.findIndex(img => img.id === imageId);
  if (existingIndex !== -1) {
    productImages[existingIndex].file = file;
    productImages[existingIndex].preview = reader.result;
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
    const productId = getProductId();
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
    
    // Collect images to delete
    const imagesToDelete = productImages.filter(img => img.markedForDeletion && img.dbId).map(img => img.dbId);
    if (imagesToDelete.length > 0) {
      formData.image_ids_to_delete = imagesToDelete;
    }
    
    // Collect new product images
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
    
    // Add image deletions
    if (imagesToDelete.length > 0) {
      formDataToSend.append('image_ids_to_delete', JSON.stringify(imagesToDelete));
    }
    
    // Add new product images
    imagesToUpload.forEach((file, idx) => {
      formDataToSend.append(`product_image_${idx}`, file);
    });
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Updating...';
    }
    
    await adminApi.updateProduct(productId, formDataToSend);
    
    alert('Product updated successfully!');
    window.location.href = '/admin/products.html';
    
  } catch (err) {
    console.error('[Admin Product Edit] Error updating product:', {
      error: err,
      message: err.message,
      stack: err.stack,
      apiBaseUrl: adminApi.baseUrl,
      hasToken: !!adminApi.accessToken
    });
    if (errorEl) {
      errorEl.textContent = err.message || 'Error updating product. Please try again. Check console for details.';
      errorEl.style.display = 'block';
    }
    
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Update Product';
    }
  }
};

    document.addEventListener('DOMContentLoaded', async () => {
      console.log('[Admin Product Edit] Initializing product edit page');
      await loadCategories();
      await loadProduct();
      
      const form = document.getElementById('product-form');
      if (form) {
        form.addEventListener('submit', handleSubmit);
      }
      
      const addVariantBtn = document.getElementById('add-variant-btn');
      if (addVariantBtn) {
        addVariantBtn.addEventListener('click', addVariant);
      }
      
      const addImageBtn = document.getElementById('add-image-btn');
      if (addImageBtn) {
        addImageBtn.addEventListener('click', () => addImageInput());
      }
    });
  }
}
