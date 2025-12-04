import { api } from './api.js';
import { formatCurrency } from './components.js';

const itemsContainer = document.getElementById('cart-items');
const totalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('go-checkout');

if (!api.accessToken) {
  window.location.href = 'login.html';
}

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
        imageUrl = firstImage?.image_url || null;
      }
      
      // Fallback to product hero image
      if (!imageUrl && item.variant?.product_media) {
        imageUrl = item.variant.product_media;
      }
      
      // Convert to absolute URL if needed
      imageUrl = getAbsoluteImageUrl(imageUrl);
      
      // Fallback to placeholder
      if (!imageUrl) {
        imageUrl = '../assets/img/placeholder.jpg';
      }
      
      return `
        <div class="cart-item" data-id="${item.id}">
          <img src="${imageUrl}" alt="${item.variant?.product_title || 'Product'}" onerror="this.src='../assets/img/placeholder.jpg'" />
          <div>
            <h3>${item.variant?.product_title || ''}</h3>
            <p>${item.variant?.size || ''} / ${item.variant?.color || ''}</p>
            <strong>${formatCurrency(item.variant?.price)}</strong>
          </div>
          <div>
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
    const cart = await api.request('/cart/');
    renderItems(cart);
  } catch (err) {
    itemsContainer.innerHTML = `<p>${err.message}</p>`;
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
  window.location.href = 'checkout.html';
});

window.addEventListener('DOMContentLoaded', loadCart);
