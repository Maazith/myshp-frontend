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
    .map(
      (item) => `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.variant?.product_media || '../assets/img/placeholder.jpg'}" alt="${item.variant?.product_title || 'Product'}" />
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
      `,
    )
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
