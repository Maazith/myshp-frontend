import { api } from './api.js';
import { formatCurrency } from './components.js';

const summaryEl = document.getElementById('checkout-summary');
const form = document.getElementById('checkout-form');
const errorEl = document.getElementById('checkout-error');

// Check authentication on page load
const checkAuth = async () => {
  if (!api.isAuthenticated) {
    // Redirect to login with return URL
    const currentUrl = window.location.href;
    const backendBaseUrl = api.baseUrl.replace('/api', '');
    window.location.href = `${backendBaseUrl}/login/?next=${encodeURIComponent(currentUrl)}`;
    return false;
  }
  return true;
};

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
  
  // Check authentication before submitting
  if (!api.isAuthenticated) {
    const currentUrl = window.location.href;
    const backendBaseUrl = api.baseUrl.replace('/api', '');
    window.location.href = `${backendBaseUrl}/login/?next=${encodeURIComponent(currentUrl)}`;
    return;
  }
  
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

// Extract JWT tokens from URL parameters (after Django login redirect)
const extractTokensFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const refresh = urlParams.get('refresh');
  
  if (token && refresh) {
    // Store tokens in localStorage
    localStorage.setItem('edithcloths_token', token);
    localStorage.setItem('edithcloths_refresh', refresh);
    
    // Get user info from API
    api.request('/auth/me').then(user => {
      localStorage.setItem('edithcloths_user', JSON.stringify(user));
    }).catch(() => {
      // Ignore errors
    });
    
    // Remove tokens from URL
    const newUrl = window.location.pathname + window.location.search.replace(/[?&]token=[^&]*/, '').replace(/[?&]refresh=[^&]*/, '').replace(/^\?$/, '');
    window.history.replaceState({}, '', newUrl);
  }
};

// Extract tokens immediately (before DOMContentLoaded)
extractTokensFromUrl();

window.addEventListener('DOMContentLoaded', async () => {
  // Check auth first, then load summary
  const isAuthenticated = await checkAuth();
  if (isAuthenticated) {
    loadSummary();
  }
});
