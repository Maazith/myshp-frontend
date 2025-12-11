import { api } from './api.js';
import { formatCurrency } from './components.js';

const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

const state = {
  product: null,
  variants: [],
  selectedSize: null,
  selectedColor: null,
};

const sizeSelect = document.getElementById('size-select');
const colorSelect = document.getElementById('color-select');
const quantityInput = document.getElementById('quantity');
const quantityValueDisplay = document.getElementById('quantity-value');
const holder = {
  title: document.getElementById('product-title'),
  description: document.getElementById('product-description'),
  price: document.getElementById('product-price'),
  category: document.getElementById('product-category'),
  media: document.getElementById('product-media'),
  error: document.getElementById('detail-error'),
};

if (!productId) {
  holder.error.textContent = 'Invalid product.';
}

// Helper function to convert relative image URLs to absolute backend URLs
const getAbsoluteImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // If already absolute URL (http/https), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If starts with /media/, prepend backend URL
  if (imageUrl.startsWith('/media/')) {
    const backendUrl = api.baseUrl.replace('/api', '');
    return `${backendUrl}${imageUrl}`;
  }
  
  // If relative path, try to construct absolute URL
  if (imageUrl.startsWith('/')) {
    const backendUrl = api.baseUrl.replace('/api', '');
    return `${backendUrl}${imageUrl}`;
  }
  
  // Return as is for relative paths (like ../assets/img/placeholder.jpg)
  return imageUrl;
};

const renderMedia = (product, selectedColor = null) => {
  // Get images for selected color, or fallback to hero image or product images
  let imagesToShow = [];
  
  if (selectedColor && state.variants.length > 0) {
    // Find variant with selected color
    const colorVariant = state.variants.find(v => v.color === selectedColor);
    if (colorVariant && colorVariant.images && colorVariant.images.length > 0) {
      // Sort by display_order
      const sortedImages = [...colorVariant.images].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      imagesToShow = sortedImages.map(img => getAbsoluteImageUrl(img.image_url || img.image));
    }
  }
  
  // Fallback to product images or hero image
  if (imagesToShow.length === 0) {
    if (product.images && product.images.length > 0) {
      // Sort by display_order
      const sortedImages = [...product.images].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      imagesToShow = sortedImages.map(img => getAbsoluteImageUrl(img.image_url || img.image));
    } else if (product.hero_media_url || product.hero_media) {
      imagesToShow = [getAbsoluteImageUrl(product.hero_media_url || product.hero_media)];
    } else {
      imagesToShow = ['../assets/img/placeholder.jpg'];
    }
  }
  
  // Filter out null values
  imagesToShow = imagesToShow.filter(url => url);
  
  // Store current image index
  if (!window.currentImageIndex) {
    window.currentImageIndex = 0;
  }
  
  // Render image gallery with carousel
  if (imagesToShow.length === 1) {
    holder.media.innerHTML = `
      <img src="${imagesToShow[0]}" alt="${product.title}" style="width:100%;border-radius:var(--radius);object-fit:cover;" onerror="this.src='../assets/img/placeholder.jpg'" loading="lazy" />
    `;
  } else {
    // Multiple images - show gallery with carousel
    holder.media.innerHTML = `
      <div style="position:relative;">
        <div style="position:relative;width:100%;margin-bottom:1rem;">
          <img id="main-product-image" src="${imagesToShow[window.currentImageIndex]}" alt="${product.title}" style="width:100%;border-radius:var(--radius);object-fit:cover;aspect-ratio:1/1;background:var(--light-grey);" onerror="this.src='../assets/img/placeholder.jpg'" loading="lazy" />
          ${imagesToShow.length > 1 ? `
            <button id="prev-image-btn" onclick="changeImage(-1)" style="position:absolute;left:0.5rem;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.5);color:white;border:none;border-radius:50%;width:40px;height:40px;cursor:pointer;font-size:1.2rem;display:flex;align-items:center;justify-content:center;z-index:2;">‹</button>
            <button id="next-image-btn" onclick="changeImage(1)" style="position:absolute;right:0.5rem;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.5);color:white;border:none;border-radius:50%;width:40px;height:40px;cursor:pointer;font-size:1.2rem;display:flex;align-items:center;justify-content:center;z-index:2;">›</button>
          ` : ''}
        </div>
        <div id="thumbnail-container" style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;overflow-x:auto;padding:0.5rem 0;">
          ${imagesToShow.map((img, idx) => `
            <img src="${img}" alt="${product.title} - Image ${idx + 1}" 
                 class="thumbnail-image"
                 data-index="${idx}"
                 style="width:80px;height:80px;border-radius:var(--radius);object-fit:cover;cursor:pointer;border:2px solid ${idx === window.currentImageIndex ? 'var(--white)' : 'transparent'};opacity:${idx === window.currentImageIndex ? '1' : '0.7'};transition:all 0.2s ease;"
                 onclick="selectImage(${idx})"
                 onerror="this.src='../assets/img/placeholder.jpg'" loading="lazy" />
          `).join('')}
        </div>
      </div>
    `;
    
    // Store images array globally for navigation
    window.productImages = imagesToShow;
  }
};

// Image navigation functions
window.changeImage = (direction) => {
  if (!window.productImages || window.productImages.length === 0) return;
  
  window.currentImageIndex = (window.currentImageIndex + direction + window.productImages.length) % window.productImages.length;
  
  const mainImg = document.getElementById('main-product-image');
  if (mainImg) {
    mainImg.src = window.productImages[window.currentImageIndex];
  }
  
  // Update thumbnail selection
  document.querySelectorAll('.thumbnail-image').forEach((thumb, idx) => {
    if (idx === window.currentImageIndex) {
      thumb.style.border = '2px solid var(--white)';
      thumb.style.opacity = '1';
    } else {
      thumb.style.border = '2px solid transparent';
      thumb.style.opacity = '0.7';
    }
  });
};

window.selectImage = (index) => {
  if (!window.productImages || index < 0 || index >= window.productImages.length) return;
  
  window.currentImageIndex = index;
  
  const mainImg = document.getElementById('main-product-image');
  if (mainImg) {
    mainImg.src = window.productImages[index];
  }
  
  // Update thumbnail selection
  document.querySelectorAll('.thumbnail-image').forEach((thumb, idx) => {
    if (idx === index) {
      thumb.style.border = '2px solid var(--white)';
      thumb.style.opacity = '1';
    } else {
      thumb.style.border = '2px solid transparent';
      thumb.style.opacity = '0.7';
    }
  });
};

const uniqueValues = (key) => {
  if (!state.variants || state.variants.length === 0) return [];
  
  // Extract all values for the key, filter out null/undefined/empty strings, and normalize
  const values = state.variants
    .map((variant) => variant[key])
    .filter((value) => value !== null && value !== undefined && value !== '')
    .map((value) => String(value).trim()); // Normalize to string and trim
  
  // Use Set to get unique values, then sort for consistent display
  const unique = [...new Set(values)];
  
  console.log(`[Product Detail] uniqueValues('${key}'):`, {
    totalVariants: state.variants.length,
    extractedValues: values,
    uniqueValues: unique,
    variants: state.variants.map(v => ({ size: v.size, color: v.color, id: v.id }))
  });
  
  return unique.sort(); // Sort alphabetically for consistent display
};

const populateSizes = () => {
  // Check if we have variants at all
  if (!state.variants || state.variants.length === 0) {
    sizeSelect.innerHTML = '<option disabled>No variants available</option>';
    colorSelect.innerHTML = '<option disabled>No variants available</option>';
    state.selectedSize = null;
    state.selectedColor = null;
    holder.error.textContent = 'This product has no size/color variants. Please contact support.';
    return;
  }
  
  const options = uniqueValues('size');
  console.log('[Product Detail] populateSizes - Available sizes:', options, 'from', state.variants.length, 'variants');
  
  if (!options.length) {
    sizeSelect.innerHTML = '<option disabled>No sizes available</option>';
    colorSelect.innerHTML = '<option disabled>No colors available</option>';
    state.selectedSize = null;
    state.selectedColor = null;
    holder.error.textContent = 'This product has no size options. Please contact support.';
    return;
  }
  
  sizeSelect.innerHTML = '<option value="">Select Size</option>' + 
    options.map((opt) => `<option value="${opt}">${opt}</option>`).join('');
  
  // Auto-select first size if available
  if (options.length > 0) {
    sizeSelect.value = options[0];
    state.selectedSize = options[0];
  }
};

const populateColors = () => {
  if (!state.selectedSize) {
    colorSelect.innerHTML = '<option disabled>Select a size first</option>';
    state.selectedColor = null;
    return;
  }
  
  const colors = state.variants
    .filter((variant) => variant.size === state.selectedSize)
    .map((variant) => variant.color);
  const unique = [...new Set(colors)];
  
  if (!unique.length) {
    colorSelect.innerHTML = '<option disabled>No colors available for this size</option>';
    state.selectedColor = null;
    holder.error.textContent = 'No colors available for the selected size.';
    return;
  }
  
  // Check if we have a pre-selected color from URL that's available for current size
  const urlParams = new URLSearchParams(window.location.search);
  const preSelectedColor = urlParams.get('color');
  const defaultColor = (preSelectedColor && unique.includes(preSelectedColor)) ? preSelectedColor : unique[0];
  
  colorSelect.innerHTML = '<option value="">Select Color</option>' + 
    unique.map((color) => `<option value="${color}">${color}</option>`).join('');
  colorSelect.value = defaultColor;
  state.selectedColor = defaultColor;
  
  // Clear error if we successfully populated colors
  if (holder.error && holder.error.textContent.includes('No colors')) {
    holder.error.textContent = '';
  }
};

const currentVariant = () =>
  state.variants.find(
    (variant) => variant.size === state.selectedSize && variant.color === state.selectedColor,
  );

const updatePrice = () => {
  const variant = currentVariant();
  if (variant) {
    holder.price.textContent = formatCurrency(variant.price);
  }
};

const loadProduct = async () => {
  if (!productId) {
    holder.error.textContent = 'Invalid product.';
    return;
  }
  try {
    // Use ID endpoint for product detail with cache-busting
    const product = await api.request(`/products/id/${productId}/`, { cacheBust: true });
    
    if (!product) {
      holder.error.textContent = 'Product not found.';
      return;
    }
    
    state.product = product;
    state.variants = product.variants || [];
    
    console.log('[Product Detail] Product loaded:', {
      productId: product.id,
      title: product.title,
      variantsCount: state.variants.length,
      variants: state.variants,
      sizesFound: [...new Set(state.variants.map(v => v.size).filter(s => s))],
      colorsFound: [...new Set(state.variants.map(v => v.color).filter(c => c))]
    });
    
    holder.title.textContent = product.title;
    holder.description.textContent = product.description || 'No description available';
    holder.category.textContent = product.category?.name || 'EdithCloths';
    
    // Set default price from base_price if no variants
    if (!state.variants || state.variants.length === 0) {
      holder.price.textContent = formatCurrency(product.base_price || 0);
      holder.error.textContent = 'This product has no size/color variants available. Please contact support.';
    } else {
      // Check if color is passed in URL params before populating dropdowns
      const urlParams = new URLSearchParams(window.location.search);
      const preSelectedColor = urlParams.get('color');
      
      populateSizes();
      // populateColors() will check for preSelectedColor internally
      populateColors();
      
      renderMedia(product, state.selectedColor);
      updatePrice();
      
      // Initialize quantity display
      if (quantityValueDisplay && quantityInput) {
        quantityValueDisplay.textContent = quantityInput.value;
      }
    }
  } catch (err) {
    console.error('Product load error:', err);
    // User-friendly error message
    holder.error.textContent = 'Product not found. Please try again.';
  }
};

sizeSelect?.addEventListener('change', (event) => {
  state.selectedSize = event.target.value || null;
  if (state.selectedSize) {
    populateColors();
    updatePrice();
    // Clear error when valid size is selected
    if (holder.error && holder.error.textContent.includes('Choose a valid')) {
      holder.error.textContent = '';
    }
  } else {
    colorSelect.innerHTML = '<option disabled>Select a size first</option>';
    state.selectedColor = null;
  }
});

colorSelect?.addEventListener('change', (event) => {
  state.selectedColor = event.target.value || null;
  // Update images when color changes - reset to first image
  window.currentImageIndex = 0;
  if (state.product && state.selectedColor) {
    renderMedia(state.product, state.selectedColor);
  }
  updatePrice();
  // Clear error when valid color is selected
  if (holder.error && holder.error.textContent.includes('Choose a valid')) {
    holder.error.textContent = '';
  }
});

// Update quantity value display when slider changes
quantityInput?.addEventListener('input', (event) => {
  const value = Number(event.target.value);
  if (quantityValueDisplay) {
    quantityValueDisplay.textContent = value;
  }
  // Clear any quantity-related errors
  if (holder.error && holder.error.textContent.includes('Maximum quantity')) {
    holder.error.textContent = '';
  }
});

quantityInput?.addEventListener('change', (event) => {
  const value = Number(event.target.value);
  if (quantityValueDisplay) {
    quantityValueDisplay.textContent = value;
  }
});

document.getElementById('add-to-cart')?.addEventListener('click', async () => {
  // Check if user is authenticated - require login to add to cart
  if (!api.isAuthenticated) {
    // Save intended destination in localStorage - after adding to cart, go to cart page
    localStorage.setItem('returnUrl', 'cart.html');
    // Redirect to login page with return URL to come back to this product page
    const currentUrl = window.location.href;
    const backendBaseUrl = api.baseUrl.replace('/api', '');
    window.location.href = `${backendBaseUrl}/login/?next=${encodeURIComponent(currentUrl)}`;
    return;
  }
  
  const variant = currentVariant();
  if (!variant) {
    holder.error.textContent = 'Choose a valid variant.';
    return;
  }
  
  // Validate quantity - maximum 5
  const quantity = Number(quantityInput.value) || 1;
  if (quantity < 1) {
    holder.error.style.color = 'var(--danger)';
    holder.error.textContent = 'Quantity must be at least 1.';
    return;
  }
  if (quantity > 5) {
    holder.error.style.color = 'var(--danger)';
    holder.error.textContent = 'Maximum quantity allowed is 5.';
    quantityInput.value = 5;
    return;
  }
  
  const addBtn = document.getElementById('add-to-cart');
  const originalText = addBtn?.textContent;
  
  try {
    if (addBtn) {
      addBtn.disabled = true;
      addBtn.textContent = 'Adding...';
    }
    
    console.log('[Product Detail] Adding to cart:', {
      variantId: variant.id,
      quantity: quantity,
      variant: variant
    });
    
    const response = await api.request('/cart/add', {
      method: 'POST',
      body: {
        variant_id: variant.id,
        quantity: quantity,
      },
    });
    
    console.log('[Product Detail] Add to cart response:', response);
    
    holder.error.style.color = 'var(--success)';
    holder.error.textContent = 'Added to cart!';
    
    // Wait a bit before redirecting to ensure cart is saved
    setTimeout(() => {
      window.location.href = 'cart.html';
    }, 800);
  } catch (err) {
    console.error('[Product Detail] Add to cart error:', {
      error: err,
      message: err.message,
      stack: err.stack
    });
    holder.error.style.color = 'var(--danger)';
    holder.error.textContent = err.message || 'Failed to add to cart. Please try again.';
    
    if (addBtn) {
      addBtn.disabled = false;
      addBtn.textContent = originalText;
    }
  }
});

// Extract JWT tokens from URL parameters (after Django login redirect)
// and handle redirect to intended page
const extractTokensAndRedirect = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const refresh = urlParams.get('refresh');
  
  if (token && refresh) {
    // Store tokens in localStorage
    localStorage.setItem('edithcloths_token', token);
    localStorage.setItem('edithcloths_refresh', refresh);
    
    // Get user info from API
    api.request('/auth/me').then(user => {
      localStorage.setItem('edithcloths_user', JSON.stringify(user));
    }).catch(() => {
      // Ignore errors
    });
    
    // Check for returnUrl in localStorage and redirect
    const returnUrl = localStorage.getItem('returnUrl');
    if (returnUrl) {
      localStorage.removeItem('returnUrl');
      // Remove tokens from URL before redirecting
      const newUrl = window.location.pathname + window.location.search.replace(/[?&]token=[^&]*/, '').replace(/[?&]refresh=[^&]*/, '').replace(/^\?$/, '');
      window.history.replaceState({}, '', newUrl);
      // Redirect to intended page
      setTimeout(() => {
        window.location.href = returnUrl;
      }, 100);
      return true; // Indicate that redirect is happening
    } else {
      // No returnUrl, just remove tokens from URL
      const newUrl = window.location.pathname + window.location.search.replace(/[?&]token=[^&]*/, '').replace(/[?&]refresh=[^&]*/, '').replace(/^\?$/, '');
      window.history.replaceState({}, '', newUrl);
    }
  }
  return false;
};

// Extract tokens immediately (before DOMContentLoaded)
extractTokensAndRedirect();

window.addEventListener('DOMContentLoaded', () => {
  // If we're redirecting, don't load product
  if (!extractTokensAndRedirect()) {
    loadProduct();
  }
});

