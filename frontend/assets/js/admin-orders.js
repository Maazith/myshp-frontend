import { adminAuth } from './admin-auth.js';
import { adminApi } from './admin-api.js';
import { formatCurrency } from './components.js';

if (!adminAuth.requireAuth()) return;

async function loadOrders() {
  try {
    const orders = await adminApi.getOrders();
    if (!orders) return;
    
    if (orders.length === 0) {
      document.getElementById('orders-list').innerHTML = '<p style="padding: 2rem; text-align: center; color: var(--text-light);">No orders found</p>';
      return;
    }
    
    const ordersHtml = orders.map(order => {
      const statusColor = order.status === 'DELIVERED' ? 'var(--success)' : 
                         order.status === 'CANCELLED' ? 'var(--danger)' : '#FFFFFF';
      return `
        <div style="padding: 1.5rem; border-bottom: 1px solid rgba(230,230,230,0.1);">
          <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 1rem;">
            <div style="flex: 1; min-width: 200px;">
              <p style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem;">${order.order_number}</p>
              <p style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 0.25rem;">${order.user?.username || 'Guest'}</p>
              <p style="color: var(--text-light); font-size: 0.9rem;">${new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div style="text-align: right;">
              <p style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem;">${formatCurrency(order.total_amount)}</p>
              <p style="color: ${statusColor}; font-size: 0.9rem; margin-bottom: 0.5rem;">${order.status}</p>
              <a href="order-detail.html?id=${order.id}" class="btn small">View Details</a>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    document.getElementById('orders-list').innerHTML = ordersHtml;
  } catch (error) {
    console.error('Orders load error:', error);
    document.getElementById('orders-list').innerHTML = `<p style="padding: 2rem; color: var(--danger);">Error loading orders: ${error.message}</p>`;
  }
}

loadOrders();

