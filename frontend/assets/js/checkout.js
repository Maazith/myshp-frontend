import { api } from './api.js';
import { formatCurrency } from './components.js';

const summaryEl = document.getElementById('checkout-summary');
const form = document.getElementById('checkout-form');
const errorEl = document.getElementById('checkout-error');

// No auth required - checkout works without login

const renderSummary = (cart) => {
  if (!cart?.items?.length) {
    summaryEl.innerHTML = '<p>Add items to cart first.</p>';
    form.querySelector('button').disabled = true;
    return;
  }
  form.querySelector('button').disabled = false;
  summaryEl.innerHTML = `
    <h2>Order Summary</h2>
    ${cart.items
      .map(
        (item) => `
          <div style="display:flex;justify-content:space-between;margin:.5rem 0;">
            <span>${item.variant?.product_title || ''} (${item.quantity})</span>
            <strong>${formatCurrency(item.subtotal)}</strong>
          </div>
        `,
      )
      .join('')}
    <hr style="margin:1rem 0;border-color:rgba(255,255,255,.1)" />
    <p style="display:flex;justify-content:space-between">
      <span>Total</span>
      <strong>${formatCurrency(cart.total_amount)}</strong>
    </p>
  `;
};

const loadSummary = async () => {
  try {
    const cart = await api.request('/cart/');
    renderSummary(cart);
  } catch (err) {
    summaryEl.innerHTML = `<p>${err.message}</p>`;
  }
};

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorEl.textContent = '';
  
  // Validate all required fields
  const name = form.querySelector('#name').value.trim();
  const email = form.querySelector('#email').value.trim();
  const phone_number = form.querySelector('#phone_number').value.trim();
  const address = form.querySelector('#address').value.trim();
  const street_name = form.querySelector('#street_name').value.trim();
  const city_town = form.querySelector('#city_town').value.trim();
  const district = form.querySelector('#district').value.trim();
  const pin_code = form.querySelector('#pin_code').value.trim();
  
  // Client-side validation
  if (!name || !email || !phone_number || !address || !street_name || !city_town || !district || !pin_code) {
    errorEl.textContent = 'Please fill all required fields marked with *.';
    return;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorEl.textContent = 'Please enter a valid email address.';
    return;
  }
  
  // Validate phone number (10 digits)
  if (!/^\d{10}$/.test(phone_number)) {
    errorEl.textContent = 'Please enter a valid 10-digit phone number.';
    return;
  }
  
  // Validate PIN code (6 digits)
  if (!/^\d{6}$/.test(pin_code)) {
    errorEl.textContent = 'Please enter a valid 6-digit PIN code.';
    return;
  }
  
  try {
    const order = await api.request('/orders/checkout', {
      method: 'POST',
      body: {
        name: name,
        email: email,
        phone_number: phone_number,
        address: address,
        street_name: street_name,
        city_town: city_town,
        district: district,
        pin_code: pin_code,
      },
    });
    sessionStorage.setItem('latestOrder', JSON.stringify(order));
    window.location.href = `payment.html?orderId=${order.id}&amount=${order.total_amount}`;
  } catch (err) {
    errorEl.textContent = err.message || 'Failed to place order. Please check all fields and try again.';
  }
});

window.addEventListener('DOMContentLoaded', loadSummary);
