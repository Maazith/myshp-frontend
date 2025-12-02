import { api } from './api.js';
import { formatCurrency, renderOrderTracker } from './components.js';

const requiresAuth = document.body.dataset.requiresAuth;
if (requiresAuth && !api.accessToken) {
  window.location.href = 'login.html';
}

const listEl = document.getElementById('orders-list');
const infoEl = document.getElementById('order-info');
const trackerEl = document.getElementById('tracker');
const targetId = new URLSearchParams(window.location.search).get('orderId');

const renderOrders = (orders) => {
  if (!listEl) return;
  if (!orders.length) {
    listEl.innerHTML = '<p>No orders yet.</p>';
    return;
  }
  listEl.innerHTML = orders
    .map(
      (order) => `
        <article class="glass-card" style="margin-bottom:1rem">
          <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:1rem">
            <div>
              <p class="badge">${order.order_number}</p>
              <h3>${formatCurrency(order.total_amount)}</h3>
            </div>
            <div>
              <span class="status ${order.payment_verified ? 'paid' : 'pending'}">
                ${order.payment_verified ? 'Paid' : 'Pending'}
              </span>
            </div>
          </div>
          ${renderOrderTracker(order.status)}
        </article>
      `,
    )
    .join('');
};

const renderOrderSuccess = (orders) => {
  if (!infoEl || !trackerEl || !targetId) return;
  const order = orders.find((item) => String(item.id) === targetId);
  if (!order) {
    infoEl.textContent = 'Order processed. Awaiting confirmation.';
    return;
  }
  infoEl.textContent = `Order ${order.order_number} for ${formatCurrency(order.total_amount)}.`;
  trackerEl.innerHTML = renderOrderTracker(order.status);
};

const hydrateOrders = async () => {
  if (!api.accessToken) return;
  try {
    const orders = await api.request('/orders/my-orders');
    renderOrders(orders);
    renderOrderSuccess(orders);
  } catch (err) {
    if (listEl) listEl.innerHTML = `<p>${err.message}</p>`;
  }
};

window.addEventListener('DOMContentLoaded', hydrateOrders);

