import { adminApi } from './admin-api.js';
import { adminAuth } from './admin-auth.js';
import { mountAdminNavbar } from './admin-navbar.js';
import { formatCurrency } from './components.js';

// Check authentication
if (!adminAuth.requireAuth()) {
  // Redirect handled by requireAuth
}

// Mount navbar
mountAdminNavbar();

// Load dashboard data
const loadDashboard = async () => {
  try {
    // Fetch orders to calculate stats
    const orders = await adminApi.getOrders();
    
    // Calculate stats
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => 
      ['PLACED', 'PAYMENT_PENDING', 'PAYMENT_VERIFIED'].includes(o.status)
    ).length;
    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length;
    const revenue = orders
      .filter(o => o.status === 'DELIVERED')
      .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
    
    // Get last 5 orders
    const recentOrders = orders
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
    
    // Render stats
    const statsContainer = document.getElementById('dashboard-stats');
    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="stat-card">
          <h3>Total Orders</h3>
          <div class="stat-value">${totalOrders}</div>
        </div>
        <div class="stat-card">
          <h3>Pending Orders</h3>
          <div class="stat-value">${pendingOrders}</div>
        </div>
        <div class="stat-card">
          <h3>Delivered</h3>
          <div class="stat-value">${deliveredOrders}</div>
        </div>
        <div class="stat-card">
          <h3>Revenue</h3>
          <div class="stat-value">${formatCurrency(revenue)}</div>
        </div>
      `;
    }
    
    // Render recent orders
    const ordersContainer = document.getElementById('recent-orders');
    if (ordersContainer) {
      if (recentOrders.length === 0) {
        ordersContainer.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:2rem;">No orders yet.</p>';
      } else {
        ordersContainer.innerHTML = recentOrders.map(order => `
          <div class="cart-item" style="cursor:pointer;" onclick="window.location.href='/admin/order-detail.html?id=${order.id}'">
            <div class="cart-item-info">
              <h3>Order #${order.order_number}</h3>
              <p>${order.email || 'N/A'}</p>
              <p><strong>${formatCurrency(order.total_amount)}</strong></p>
            </div>
            <div style="display:flex;align-items:center;">
              <span class="badge">${order.status_display || order.status}</span>
            </div>
          </div>
        `).join('');
      }
    }
    
  } catch (err) {
    console.error('Error loading dashboard:', err);
    const statsContainer = document.getElementById('dashboard-stats');
    if (statsContainer) {
      statsContainer.innerHTML = '<p style="color:var(--danger);">Error loading dashboard data.</p>';
    }
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
});
