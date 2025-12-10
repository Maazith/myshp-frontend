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
      imagesToShow = colorVariant.images.map(img => getAbsoluteImageUrl(img.image_url || img.image));
    }
  }
  
  // Fallback to product images or hero image
  if (imagesToShow.length === 0) {
    if (product.images && product.images.length > 0) {
      imagesToShow = product.images.map(img => getAbsoluteImageUrl(img.image_url || img.image));
    } else if (product.hero_media_url || product.hero_media) {
      imagesToShow = [getAbsoluteImageUrl(product.hero_media_url || product.hero_media)];
    } else {
      imagesToShow = ['../assets/img/placeholder.jpg'];
    }
  }
  
  // Filter out null values
  imagesToShow = imagesToShow.filter(url => url);
  
  // Render image gallery
  if (imagesToShow.length === 1) {
    holder.media.innerHTML = `
      <img src="${imagesToShow[0]}" alt="${product.title}" style="width:100%;border-radius:var(--radius);object-fit:cover;" onerror="this.src='../assets/img/placeholder.jpg'" loading="lazy" />
    `;
  } else {
    // Multiple images - show gallery
    holder.media.innerHTML = `
      <div style="position:relative;">
        <img id="main-product-image" src="${imagesToShow[0]}" alt="${product.title}" style="width:100%;border-radius:var(--radius);object-fit:cover;margin-bottom:1rem;" onerror="this.src='../assets/img/placeholder.jpg'" loading="lazy" />
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          ${imagesToShow.map((img, idx) => `
            <img src="${img}" alt="${product.title} - Image ${idx + 1}" 
                 style="width:80px;height:80px;border-radius:var(--radius);object-fit:cover;cursor:pointer;border:2px solid ${idx === 0 ? 'var(--light-grey)' : 'transparent'};"
                 onclick="document.getElementById('main-product-image').src='${img}'"
                 onerror="this.src='../assets/img/placeholder.jpg'" loading="lazy" />
          `).join('')}
        </div>
      </div>
    `;
  }
};

const uniqueValues = (key) => [...new Set(state.variants.map((variant) => variant[key]))];

const populateSizes = () => {
  const options = uniqueValues('size');
  if (!options.length) {
    sizeSelect.innerHTML = '<option disabled>No sizes</option>';
    colorSelect.innerHTML = '<option disabled>N/A</option>';
    state.selectedSize = null;
    state.selectedColor = null;
    return;
  }
  sizeSelect.innerHTML = options.map((opt) => `<option value="${opt}">${opt}</option>`).join('');
  state.selectedSize = options[0];
};

const populateColors = () => {
  const colors = state.variants
    .filter((variant) => variant.size === state.selectedSize)
    .map((variant) => variant.color);
  const unique = [...new Set(colors)];
  if (!unique.length) {
    colorSelect.innerHTML = '<option disabled>No colors</option>';
    state.selectedColor = null;
    return;
  }
  
  // Check if we have a pre-selected color from URL that's available for current size
  const urlParams = new URLSearchParams(window.location.search);
  const preSelectedColor = urlParams.get('color');
  const defaultColor = (preSelectedColor && unique.includes(preSelectedColor)) ? preSelectedColor : unique[0];
  
  colorSelect.innerHTML = unique.map((color) => `<option value="${color}">${color}</option>`).join('');
  colorSelect.value = defaultColor;
  state.selectedColor = defaultColor;
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
  if (!productId) return;
  try {
    // Use ID endpoint for product detail with cache-busting
    const product = await api.request(`/products/id/${productId}/`, { cacheBust: true });
    state.product = product;
    state.variants = product.variants || [];
    holder.title.textContent = product.title;
    holder.description.textContent = product.description || 'No description available';
    holder.category.textContent = product.category?.name || 'EdithCloths';
    
    // Check if color is passed in URL params before populating dropdowns
    const urlParams = new URLSearchParams(window.location.search);
    const preSelectedColor = urlParams.get('color');
    
    populateSizes();
    // populateColors() will check for preSelectedColor internally
    populateColors();
    
    renderMedia(product, state.selectedColor);
    updatePrice();
  } catch (err) {
    holder.error.textContent = err.message || 'Error loading product';
    console.error('Product load error:', err);
  }
};

sizeSelect?.addEventListener('change', (event) => {
  state.selectedSize = event.target.value;
  populateColors();
  updatePrice();
});

colorSelect?.addEventListener('change', (event) => {
  state.selectedColor = event.target.value;
  // Update images when color changes
  if (state.product) {
    renderMedia(state.product, state.selectedColor);
  }
  updatePrice();
});

document.getElementById('add-to-cart')?.addEventListener('click', async () => {
  // No auth required - add to cart works without login
  const variant = currentVariant();
  if (!variant) {
    holder.error.textContent = 'Choose a valid variant.';
    return;
  }
  try {
    await api.request('/cart/add', {
      method: 'POST',
      body: {
        variant_id: variant.id,
        quantity: Number(quantityInput.value) || 1,
      },
    });
    holder.error.style.color = 'var(--success)';
    holder.error.textContent = 'Added to cart!';
    setTimeout(() => (window.location.href = 'cart.html'), 600);
  } catch (err) {
    holder.error.style.color = 'var(--danger)';
    holder.error.textContent = err.message;
  }
});

window.addEventListener('DOMContentLoaded', loadProduct);

