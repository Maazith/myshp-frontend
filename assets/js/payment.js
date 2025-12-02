import { api } from './api.js';
import { formatCurrency } from './components.js';

if (!api.accessToken) {
  window.location.href = 'login.html';
}

const params = new URLSearchParams(window.location.search);
const orderId = params.get('orderId');
const amount = params.get('amount');
const amountEl = document.getElementById('payment-amount');
const qrEl = document.getElementById('upi-qr');
const upiLink = document.getElementById('upi-link');
const form = document.getElementById('payment-proof');
const errorEl = document.getElementById('payment-error');

const upiUrl = (value) =>
  `upi://pay?pa=rsudhan886@okicici&pn=EdithCloths&am=${value}&cu=INR`;

const hydratePage = () => {
  if (!orderId || !amount) {
    amountEl.textContent = 'Missing order context.';
    form.querySelector('button').disabled = true;
    return;
  }
  amountEl.textContent = `Total Amount: ${formatCurrency(amount)}`;
  const link = upiUrl(amount);
  upiLink.href = link;
  qrEl.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(link)}`;
};

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorEl.textContent = '';
  if (!orderId) {
    errorEl.textContent = 'Missing order reference.';
    return;
  }
  const formData = new FormData();
  formData.append('order', orderId);
  formData.append('reference_id', form.reference.value.trim());
  if (form.proof.files[0]) {
    formData.append('proof_file', form.proof.files[0]);
  }
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

