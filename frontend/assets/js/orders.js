import { api } from './api.js';
import { formatCurrency, renderOrderTracker } from './components.js';

// Orders page - shows message if no auth (backend requires auth for orders)

const listEl = document.getElementById('orders-list');
const infoEl = document.getElementById('order-info');
const trackerEl = document.getElementById('tracker');
const targetId = new URLSearchParams(window.location.search).get('orderId');

let currentOrdersHash = '';
let orderPollInterval = null;
let lastOrders = [];

// Create a hash of orders to detect changes
const createOrdersHash = (orders) => {
  if (!orders || !orders.length) return '';
  // Create hash including order ID, status, payment_verified, and updated_at
  return orders.map(order => {
    const status = order.status || 'PLACED';
    const paymentVerified = order.payment_verified ? '1' : '0';
    const updatedAt = order.updated_at || order.created_at || '';
    const id = order.id || '';
    return `${id}:${status}:${paymentVerified}:${updatedAt}`;
  }).sort().join('||');
};

const renderOrders = (orders, forceRender = false) => {
  if (!listEl) return;
  
  // Create hash of current orders
  const newOrdersHash = createOrdersHash(orders || []);
  
  // Only re-render if hash changed or if forced
  const shouldRender = newOrdersHash !== currentOrdersHash || forceRender || !currentOrdersHash;
  
  if (!shouldRender && listEl.innerHTML) {
    return;
  }
  
  // Update the hash and store orders
  currentOrdersHash = newOrdersHash;
  lastOrders = orders || [];
  
  if (!orders || !orders.length) {
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
  if (!infoEl || !targetId) return;
  const order = orders.find((item) => String(item.id) === targetId);
  if (order) {
    infoEl.textContent = `Order ${order.order_number} for ${formatCurrency(order.total_amount)}.`;
  } else {
    infoEl.textContent = 'Your payment proof has been submitted successfully.';
  }
  // Always show the verification message - don't hide it
};

const loadOrders = async (forceRender = false) => {
  try {
    const orders = await api.request('/orders/my-orders');
    renderOrders(orders, forceRender);
    renderOrderSuccess(orders);
  } catch (err) {
    console.error('Error loading orders:', err);
    if (listEl) {
      if (err.message && err.message.includes('401')) {
        listEl.innerHTML = '<p style="color:var(--text-light);">Orders are not available. Please contact support for order inquiries.</p>';
      } else {
      listEl.innerHTML = `<p style="color:var(--danger);">Error loading orders: ${err.message}</p>`;
      }
    }
  }
};

const startOrderPolling = () => {
  // Clear existing interval if any
  if (orderPollInterval) {
    clearInterval(orderPollInterval);
  }
  
  // Show update indicator
  const indicator = document.getElementById('update-indicator');
  if (indicator) {
    indicator.style.display = 'block';
  }
  
  // Poll every 5 seconds for order updates
  orderPollInterval = setInterval(() => {
    // Only poll if tab is visible
    if (!document.hidden) {
      loadOrders(false);
    }
  }, 5000);
  
  // Stop polling when tab becomes hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (orderPollInterval) {
        clearInterval(orderPollInterval);
        orderPollInterval = null;
      }
      if (indicator) {
        indicator.style.display = 'none';
      }
    } else {
      // Restart polling when tab becomes visible
      startOrderPolling();
      // Load immediately when tab becomes visible
      loadOrders(true);
    }
  });
};

const hydrateOrders = async () => {
  // Load orders initially
  await loadOrders(true);
  
  // Start polling for updates
  startOrderPolling();
};

window.addEventListener('DOMContentLoaded', hydrateOrders);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (orderPollInterval) {
    clearInterval(orderPollInterval);
  }
});

