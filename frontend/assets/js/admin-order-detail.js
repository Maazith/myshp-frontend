import { adminApi } from './admin-api.js';
import { adminAuth } from './admin-auth.js';
import { mountAdminNavbar } from './admin-navbar.js';
import { formatCurrency, orderStages } from './components.js';

// Page-specific check - only run on order detail page
const isOrderDetailPage = () => {
  const path = window.location.pathname;
  return path.includes('order-detail.html');
};

if (!isOrderDetailPage()) {
  console.warn('[Admin Order Detail] This script should only run on order detail page');
} else {
  if (!adminAuth.requireAuth()) {
    // Redirect handled
  } else {
    mountAdminNavbar();

const getOrderId = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
};

const renderOrderTracker = (status) => {
  const activeIndex = orderStages.findIndex((stage) => stage.key === status);
  return `
    <div class="order-tracker">
      ${orderStages
        .map(
          (stage, idx) => `
          <div class="tracker-node ${idx <= activeIndex ? 'active' : ''}">
            <span>${stage.label}</span>
          </div>
        `,
        )
        .join('')}
    </div>
  `;
};

const loadOrderDetail = async () => {
  const orderId = getOrderId();
  if (!orderId) {
    window.location.href = '/admin/orders.html';
    return;
  }
  
  try {
    const order = await adminApi.getOrder(orderId);
    
    // Render order info
    const orderInfo = document.getElementById('order-info');
    if (orderInfo) {
      orderInfo.innerHTML = `
        <div class="form-card">
          <p class="badge">Order Details</p>
          <h2>Order #${order.order_number}</h2>
          <div style="margin-top: 1.5rem;">
            <p><strong>Status:</strong> <span class="badge">${order.status_display || order.status}</span></p>
            <p><strong>Total:</strong> ${formatCurrency(order.total_amount)}</p>
            <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
            ${order.user ? `<p><strong>User:</strong> ${order.user.username} (${order.user.email})</p>` : ''}
          </div>
        </div>
      `;
    }
    
    // Render status tracker
    const trackerContainer = document.getElementById('status-tracker');
    if (trackerContainer) {
      trackerContainer.innerHTML = `
        <div class="form-card">
          <p class="badge">Order Status</p>
          ${renderOrderTracker(order.status)}
        </div>
      `;
    }
    
    // Render items
    const itemsContainer = document.getElementById('order-items');
    if (itemsContainer) {
      if (order.items && order.items.length > 0) {
        itemsContainer.innerHTML = order.items.map(item => `
          <div class="cart-item">
            <img src="${item.product_image_url || '../assets/img/placeholder.jpg'}" alt="${item.product_title}" style="width:80px;height:80px;object-fit:cover;border-radius:var(--radius);" />
            <div class="cart-item-info">
              <h3>${item.product_title}</h3>
              <p>Size: ${item.size || 'N/A'}</p>
              <p>Color: ${item.color || 'N/A'}</p>
              <p>Quantity: ${item.quantity}</p>
            </div>
            <div style="display:flex;align-items:center;">
              <strong>${formatCurrency(item.price)}</strong>
            </div>
          </div>
        `).join('');
      } else {
        itemsContainer.innerHTML = '<p style="color:var(--text-light);">No items found.</p>';
      }
    }
    
    // Render shipping address
    const addressContainer = document.getElementById('shipping-address');
    if (addressContainer) {
      addressContainer.innerHTML = `
        <div class="form-card">
          <p class="badge">Shipping Address</p>
          <div style="margin-top: 1rem;">
            <p><strong>${order.name}</strong></p>
            <p>${order.email}</p>
            <p>${order.phone_number}</p>
            <p style="margin-top: 1rem;">${order.address || order.shipping_address || 'N/A'}</p>
            <p>${order.street_name || ''}</p>
            <p>${order.city_town || ''}, ${order.district || ''}</p>
            <p>PIN: ${order.pin_code || 'N/A'}</p>
          </div>
        </div>
      `;
    }
    
    // Render payment proof if exists
    if (order.payment_proof) {
      const paymentContainer = document.getElementById('payment-proof');
      if (paymentContainer) {
        paymentContainer.innerHTML = `
          <div class="form-card">
            <p class="badge">Payment Proof</p>
            <div style="margin-top: 1rem;">
              <p><strong>Reference ID:</strong> ${order.payment_proof.reference_id || 'N/A'}</p>
              <p><strong>Verified:</strong> ${order.payment_proof.verified ? 'Yes' : 'No'}</p>
              ${order.payment_proof.proof_file_url ? `
                <a href="${order.payment_proof.proof_file_url}" target="_blank" class="btn small" style="margin-top: 1rem;">View Proof</a>
              ` : ''}
            </div>
          </div>
        `;
      }
    }
    
    // Render status update buttons
    const statusButtons = document.getElementById('status-buttons');
    if (statusButtons) {
      const statusFlow = ['PLACED', 'PAYMENT_VERIFIED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
      const currentIndex = statusFlow.indexOf(order.status);
      
      statusButtons.innerHTML = `
        <div class="form-card">
          <p class="badge">Update Status</p>
          <div style="display:flex;flex-wrap:wrap;gap:1rem;margin-top:1rem;">
            ${currentIndex < statusFlow.length - 1 ? `
              <button class="btn" onclick="updateStatus('${statusFlow[currentIndex + 1]}')">
                Mark as ${statusFlow[currentIndex + 1].replace('_', ' ')}
              </button>
            ` : ''}
            ${!order.payment_verified && order.status !== 'DELIVERED' ? `
              <button class="btn ghost" onclick="markPaid()">Mark as Paid</button>
            ` : ''}
          </div>
        </div>
      `;
    }
    
  } catch (err) {
    console.error('Error loading order:', err);
    alert('Error loading order details. Please try again.');
    window.location.href = '/admin/orders.html';
  }
};

window.updateStatus = async (status) => {
  const orderId = getOrderId();
  if (!orderId) return;
  
  if (!confirm(`Update order status to ${status.replace('_', ' ')}?`)) {
    return;
  }
  
  try {
    await adminApi.updateOrderStatus(orderId, status);
    alert('Order status updated successfully!');
    loadOrderDetail();
  } catch (err) {
    alert('Error updating order status: ' + (err.message || 'Unknown error'));
  }
};

window.markPaid = async () => {
  const orderId = getOrderId();
  if (!orderId) return;
  
  if (!confirm('Mark this order as paid?')) {
    return;
  }
  
  try {
    await adminApi.markOrderPaid(orderId);
    alert('Order marked as paid!');
    loadOrderDetail();
  } catch (err) {
    alert('Error marking order as paid: ' + (err.message || 'Unknown error'));
  }
};

    document.addEventListener('DOMContentLoaded', () => {
      console.log('[Admin Order Detail] Initializing order detail page');
      loadOrderDetail();
    });
  }
}
