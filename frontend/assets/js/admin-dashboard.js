import { adminAuth } from './admin-auth.js';
import { adminApi } from './admin-api.js';
import { formatCurrency } from './components.js';

if (!adminAuth.requireAuth()) return;

async function loadDashboard() {
  try {
    const orders = await adminApi.getOrders();
    if (!orders) return;
    
    const total = orders.length;
    const pending = orders.filter(o => ['PLACED', 'PAYMENT_PENDING', 'PAYMENT_VERIFIED'].includes(o.status)).length;
    const completed = orders.filter(o => o.status === 'DELIVERED').length;
    const revenue = orders.filter(o => o.payment_verified).reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);
    
    document.getElementById('total-orders').textContent = total;
    document.getElementById('pending-orders').textContent = pending;
    document.getElementById('completed-orders').textContent = completed;
    document.getElementById('total-revenue').textContent = formatCurrency(revenue);
    
    const recent = orders.slice(0, 5);
    const recentHtml = recent.length ? recent.map(order => `
      <div style="padding: 1rem; border-bottom: 1px solid rgba(230,230,230,0.1); display: flex; justify-content: space-between; align-items: center;">
        <div>
          <p style="font-weight: 600;">${order.order_number}</p>
          <p style="color: var(--text-light); font-size: 0.9rem;">${order.user?.username || 'Guest'}</p>
        </div>
        <div style="text-align: right;">
          <p style="font-weight: 600;">${formatCurrency(order.total_amount)}</p>
          <p style="color: var(--text-light); font-size: 0.9rem;">${order.status}</p>
        </div>
      </div>
    `).join('') : '<p style="padding: 1rem; color: var(--text-light);">No orders yet</p>';
    document.getElementById('recent-orders').innerHTML = recentHtml;
  } catch (error) {
    console.error('Dashboard load error:', error);
  }
}

loadDashboard();
