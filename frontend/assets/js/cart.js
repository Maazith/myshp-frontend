import { api } from './api.js';
import { formatCurrency } from './components.js';

const itemsContainer = document.getElementById('cart-items');
const totalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('go-checkout');

// No auth required - cart works without login

const renderItems = (cart) => {
  if (!cart.items?.length) {
    itemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    checkoutBtn.disabled = true;
    totalEl.textContent = '';
    return;
  }
  checkoutBtn.disabled = false;
  itemsContainer.innerHTML = cart.items
    .map((item) => {
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
      
      // Get image URL - prioritize variant-specific images (color-specific), then product_media, then placeholder
      let imageUrl = null;
      
      // First try variant-specific images (for the selected color)
      if (item.variant?.images && Array.isArray(item.variant.images) && item.variant.images.length > 0) {
        const firstImage = item.variant.images.find(img => img.is_primary) || item.variant.images[0];
        imageUrl = firstImage?.image_url || firstImage?.image || null;
      }
      
      // Try variant product_media
      if (!imageUrl && item.variant?.product_media) {
        imageUrl = item.variant.product_media;
      }
      
      // Try variant product_media_url
      if (!imageUrl && item.variant?.product_media_url) {
        imageUrl = item.variant.product_media_url;
      }
      
      // Try product-level images
      if (!imageUrl && item.product?.hero_media_url) {
        imageUrl = item.product.hero_media_url;
      }
      
      if (!imageUrl && item.product?.hero_media) {
        imageUrl = item.product.hero_media;
      }
      
      // Convert to absolute URL if needed
      imageUrl = getAbsoluteImageUrl(imageUrl);
      
      // Fallback to placeholder
      if (!imageUrl) {
        // Determine correct placeholder path based on current location
        const currentPath = window.location.pathname;
        const isInPages = currentPath.includes('/pages/') || currentPath.includes('pages/');
        imageUrl = isInPages ? '../assets/img/placeholder.jpg' : 'assets/img/placeholder.jpg';
      }
      
      // Determine placeholder path for error fallback
      const currentPath = window.location.pathname;
      const isInPages = currentPath.includes('/pages/') || currentPath.includes('pages/');
      const placeholderPath = isInPages ? '../assets/img/placeholder.jpg' : 'assets/img/placeholder.jpg';
      
      return `
        <div class="cart-item" data-id="${item.id}">
          <img src="${imageUrl}" alt="${item.variant?.product_title || 'Product'}" onerror="this.onerror=null; this.src='${placeholderPath}';" loading="lazy" />
          <div class="cart-item-info">
            <h3>${item.variant?.product_title || 'Product'}</h3>
            <p>${item.variant?.size || ''} / ${item.variant?.color || ''}</p>
            <strong>${formatCurrency(item.variant?.price || 0)}</strong>
          </div>
          <div class="cart-item-quantity">
            <input type="number" min="1" value="${item.quantity}" data-action="update" data-id="${item.id}" />
          </div>
          <button class="btn ghost small" data-action="remove" data-id="${item.id}">Remove</button>
        </div>
      `;
    })
    .join('');
  totalEl.textContent = `Total: ${formatCurrency(cart.total_amount)}`;
};

const loadCart = async () => {
  try {
    console.log('[Cart] Loading cart...', { apiBaseUrl: api.baseUrl });
    const cart = await api.request('/cart/', { cacheBust: true });
    console.log('[Cart] Cart loaded:', { 
      itemsCount: cart.items?.length || 0, 
      total: cart.total_amount,
      cart: cart 
    });
    renderItems(cart);
  } catch (err) {
    console.error('[Cart] Cart load error:', {
      error: err,
      message: err.message,
      stack: err.stack,
      apiBaseUrl: api.baseUrl
    });
    // User-friendly error message
    itemsContainer.innerHTML = '<p style="color:var(--danger);text-align:center;padding:2rem;">Unable to load cart. Please refresh the page.</p>';
  }
};

itemsContainer?.addEventListener('change', async (event) => {
  const input = event.target.closest('input[data-action="update"]');
  if (!input) return;
  const id = Number(input.dataset.id);
  const quantity = Number(input.value) || 1;
  await api.request('/cart/update', {
    method: 'PATCH',
    body: { item_id: id, quantity },
  });
  loadCart();
});

itemsContainer?.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const id = button.dataset.id;
  if (button.dataset.action === 'remove') {
    await api.request(`/cart/remove/${id}`, { method: 'DELETE' });
    loadCart();
  }
});

checkoutBtn?.addEventListener('click', () => {
  // Check authentication before going to checkout
  if (!api.isAuthenticated) {
    // Redirect to login with return URL to checkout
    const checkoutUrl = window.location.origin + window.location.pathname.replace('cart.html', 'checkout.html');
    const backendBaseUrl = api.baseUrl.replace('/api', '');
    window.location.href = `${backendBaseUrl}/login/?next=${encodeURIComponent(checkoutUrl)}`;
    return;
  }
  window.location.href = 'checkout.html';
});

window.addEventListener('DOMContentLoaded', loadCart);
