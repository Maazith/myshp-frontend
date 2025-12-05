import { adminAuth } from './admin-auth.js';
import { adminApi } from './admin-api.js';
import { formatCurrency, orderStages } from './components.js';

if (!adminAuth.requireAuth()) return;

const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('id');

if (!orderId) {
  window.location.href = 'orders.html';
}

async function loadOrderDetail() {
  try {
    const order = await adminApi.getOrder(orderId);
    if (!order) return;
    
    const statusOptions = orderStages.map(stage => 
      `<option value="${stage.key}" ${order.status === stage.key ? 'selected' : ''}>${stage.label}</option>`
    ).join('');
    
    const itemsHtml = order.items?.map(item => `
      <div style="padding: 1rem; border-bottom: 1px solid rgba(230,230,230,0.1); display: flex; justify-content: space-between; align-items: center;">
        <div>
          <p style="font-weight: 600;">${item.product_title}</p>
          <p style="color: var(--text-light); font-size: 0.9rem;">Size: ${item.size || 'N/A'} | Color: ${item.color || 'N/A'}</p>
        </div>
        <div style="text-align: right;">
          <p style="font-weight: 600;">${formatCurrency(item.price)}</p>
          <p style="color: var(--text-light); font-size: 0.9rem;">Qty: ${item.quantity}</p>
        </div>
      </div>
    `).join('') || '<p>No items</p>';
    
    const html = `
      <div class="glass-card" style="margin-bottom: 1.5rem;">
        <h2 style="margin-bottom: 1rem;">Order Information</h2>
        <div class="form-group">
          <label>Order Number</label>
          <input type="text" value="${order.order_number}" readonly style="background: rgba(255,255,255,0.02);">
        </div>
        <div class="form-group">
          <label>Customer</label>
          <input type="text" value="${order.user?.username || 'Guest'} (${order.user?.email || 'N/A'})" readonly style="background: rgba(255,255,255,0.02);">
        </div>
        <div class="form-group">
          <label>Status</label>
          <select id="order-status">
            ${statusOptions}
          </select>
        </div>
        <div class="form-group">
          <label>Total Amount</label>
          <input type="text" value="${formatCurrency(order.total_amount)}" readonly style="background: rgba(255,255,255,0.02);">
        </div>
        <div class="form-group">
          <label>Payment Verified</label>
          <input type="text" value="${order.payment_verified ? 'Yes' : 'No'}" readonly style="background: rgba(255,255,255,0.02);">
        </div>
        <button class="btn" id="update-status">Update Status</button>
        <p id="status-error" style="color: var(--danger); margin-top: 1rem;"></p>
      </div>
      <div class="glass-card" style="margin-bottom: 1.5rem;">
        <h2 style="margin-bottom: 1rem;">Order Items</h2>
        ${itemsHtml}
      </div>
      ${order.payment_proof ? `
      <div class="glass-card">
        <h2 style="margin-bottom: 1rem;">Payment Proof</h2>
        <img src="${order.payment_proof.proof_file_url || order.payment_proof.proof_file || ''}" alt="Payment Proof" style="max-width: 100%; border-radius: var(--radius);" onerror="this.style.display='none'">
        ${order.payment_proof.reference_id ? `<p style="margin-top: 1rem;"><strong>Reference ID:</strong> ${order.payment_proof.reference_id}</p>` : ''}
      </div>
      ` : ''}
    `;
    
    document.getElementById('order-detail-content').innerHTML = html;
    
    const updateBtn = document.getElementById('update-status');
    if (updateBtn) {
      updateBtn.addEventListener('click', async () => {
        const newStatus = document.getElementById('order-status').value;
        const errorEl = document.getElementById('status-error');
        errorEl.textContent = '';
        try {
          await adminApi.updateOrderStatus(orderId, newStatus);
          errorEl.textContent = 'Status updated successfully!';
          errorEl.style.color = 'var(--success)';
          setTimeout(() => loadOrderDetail(), 1000);
        } catch (error) {
          errorEl.textContent = error.message;
        }
      });
    }
  } catch (error) {
    console.error('Order detail error:', error);
    document.getElementById('order-detail-content').innerHTML = `<p style="color: var(--danger);">Error: ${error.message}</p>`;
  }
}

loadOrderDetail();

