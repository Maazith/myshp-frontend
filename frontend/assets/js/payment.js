import { api } from './api.js';
import { formatCurrency } from './components.js';

// No auth required - payment works without login

const params = new URLSearchParams(window.location.search);
const orderId = params.get('orderId');
const amount = params.get('amount');
const amountEl = document.getElementById('payment-amount');
const qrEl = document.getElementById('upi-qr');
const upiIdEl = document.querySelector('.upi-id');
const upiLink = document.getElementById('upi-link');
const form = document.getElementById('payment-proof');
const errorEl = document.getElementById('payment-error');

const hydratePage = async () => {
  if (!orderId || !amount) {
    amountEl.textContent = 'Missing order context.';
    form.querySelector('button').disabled = true;
    return;
  }
  
  amountEl.textContent = `Total Amount: ${formatCurrency(amount)}`;
  
  // Load site settings for UPI ID and QR code
  try {
    const settings = await api.getSettings();
    const upiId = settings?.upi_id || 'maazith.md@oksbi';
    
    // Update UPI ID display
    if (upiIdEl) {
      upiIdEl.textContent = `UPI ID: ${upiId}`;
    }
    
    // Update QR code image - try from settings first, then fallback to local
    if (qrEl) {
      let qrCodeUrl = '../assets/images/qr.jpg'; // Default to local QR image
      
      // Try to get QR code from settings if available
      if (settings?.qr_code_image_url) {
        qrCodeUrl = settings.qr_code_image_url;
      }
      
      qrEl.src = qrCodeUrl;
      qrEl.style.display = 'block';
      qrEl.style.width = '100%';
      qrEl.style.height = '100%';
      qrEl.style.objectFit = 'contain';
      qrEl.style.borderRadius = 'var(--radius)';
      
      // Fallback if image fails to load
      qrEl.onerror = function() {
        this.src = '../assets/images/qr.jpg';
        this.style.display = 'block';
        this.style.width = '100%';
        this.style.height = '100%';
        this.style.objectFit = 'contain';
      };
    }
    
    // Update UPI payment link
    const link = `upi://pay?pa=${upiId}&pn=EdithCloths&am=${amount}&cu=INR`;
    if (upiLink) {
      upiLink.href = link;
    }
  } catch (err) {
    console.error('Error loading settings:', err);
    // Fallback - use local QR code and default UPI ID
    if (qrEl) {
      qrEl.src = '../assets/images/qr.jpg';
      qrEl.style.display = 'block';
      qrEl.style.width = '100%';
      qrEl.style.height = '100%';
      qrEl.style.objectFit = 'contain';
      qrEl.style.borderRadius = 'var(--radius)';
    }
    if (upiIdEl) {
      upiIdEl.textContent = 'UPI ID: maazith.md@oksbi';
    }
    if (upiLink) {
      upiLink.href = `upi://pay?pa=maazith.md@oksbi&pn=EdithCloths&am=${amount}&cu=INR`;
    }
  }
};

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorEl.textContent = '';
  if (!orderId) {
    errorEl.textContent = 'Missing order reference.';
    return;
  }
  
  // Validate required fields
  if (!form.reference.value.trim()) {
    errorEl.textContent = 'UPI Reference ID is required.';
    return;
  }
  
  if (!form.proof.files[0]) {
    errorEl.textContent = 'Payment screenshot is required.';
    return;
  }
  
  const formData = new FormData();
  formData.append('order', orderId);
  formData.append('reference_id', form.reference.value.trim());
  formData.append('proof_file', form.proof.files[0]);
  try {
    await api.request('/orders/confirm-payment', {
      method: 'POST',
      body: formData,
      isForm: true,
    });
    window.location.href = `order_success.html?orderId=${orderId}`;
  } catch (err) {
    errorEl.textContent = err.message;
  }
});

window.addEventListener('DOMContentLoaded', hydratePage);

