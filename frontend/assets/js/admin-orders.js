import { adminApi } from './admin-api.js';
import { adminAuth } from './admin-auth.js';
import { mountAdminNavbar } from './admin-navbar.js';
import { formatCurrency } from './components.js';

if (!adminAuth.requireAuth()) {
  // Redirect handled
}

mountAdminNavbar();

const loadOrders = async () => {
  try {
    const orders = await adminApi.getOrders();
    const container = document.getElementById('orders-list');
    
    if (!container) return;
    
    if (orders.length === 0) {
      container.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:2rem;">No orders found.</p>';
      return;
    }
    
    // Sort by date (newest first)
    const sortedOrders = orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    container.innerHTML = sortedOrders.map(order => `
      <div class="cart-item" style="cursor:pointer;" onclick="window.location.href='/admin/order-detail.html?id=${order.id}'">
        <div class="cart-item-info">
          <h3>Order #${order.order_number}</h3>
          <p>${order.email || 'N/A'}</p>
          <p>${order.name || 'N/A'}</p>
          <p><strong>${formatCurrency(order.total_amount)}</strong></p>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.5rem;">
          <span class="badge">${order.status_display || order.status}</span>
          <p style="font-size:0.75rem;color:var(--text-light);">${new Date(order.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    `).join('');
    
  } catch (err) {
    console.error('Error loading orders:', err);
    const container = document.getElementById('orders-list');
    if (container) {
      container.innerHTML = '<p style="color:var(--danger);">Error loading orders. Please try again.</p>';
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  loadOrders();
});
