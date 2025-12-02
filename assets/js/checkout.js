import { api } from './api.js';
import { formatCurrency } from './components.js';

const summaryEl = document.getElementById('checkout-summary');
const form = document.getElementById('checkout-form');
const errorEl = document.getElementById('checkout-error');

if (!api.accessToken) {
  window.location.href = 'login.html';
}

const renderSummary = (cart) => {
  if (!cart?.items?.length) {
    summaryEl.innerHTML = '<p>Add items to cart first.</p>';
    form.querySelector('button').disabled = true;
    return;
  }
  form.querySelector('button').disabled = false;
  summaryEl.innerHTML = `
    <h2>Order Summary</h2>
    ${cart.items
      .map(
        (item) => `
          <div style="display:flex;justify-content:space-between;margin:.5rem 0;">
            <span>${item.variant?.product_title || ''} (${item.quantity})</span>
            <strong>${formatCurrency(item.subtotal)}</strong>
          </div>
        `,
      )
      .join('')}
    <hr style="margin:1rem 0;border-color:rgba(255,255,255,.1)" />
    <p style="display:flex;justify-content:space-between">
      <span>Total</span>
      <strong>${formatCurrency(cart.total_amount)}</strong>
    </p>
  `;
};

const loadSummary = async () => {
  try {
    const cart = await api.request('/cart/');
    renderSummary(cart);
  } catch (err) {
    summaryEl.innerHTML = `<p>${err.message}</p>`;
  }
};

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorEl.textContent = '';
  try {
    const order = await api.request('/orders/checkout', {
      method: 'POST',
      body: { shipping_address: form.address.value },
    });
    sessionStorage.setItem('latestOrder', JSON.stringify(order));
    window.location.href = `payment.html?orderId=${order.id}&amount=${order.total_amount}`;
  } catch (err) {
    errorEl.textContent = err.message;
  }
});

window.addEventListener('DOMContentLoaded', loadSummary);
