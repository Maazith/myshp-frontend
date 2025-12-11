import { api } from './api.js';
import { formatCurrency } from './components.js';

const summaryEl = document.getElementById('checkout-summary');
const form = document.getElementById('checkout-form');
const errorEl = document.getElementById('checkout-error');

// Check authentication on page load
const checkAuth = async () => {
  if (!api.isAuthenticated) {
    // Save intended destination in localStorage - after login, stay on checkout
    localStorage.setItem('returnUrl', 'checkout.html');
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
    const cart = await api.request('/cart/', { cacheBust: true });
    renderSummary(cart);
  } catch (err) {
    console.error('[Checkout] Error loading cart:', err);
    if (summaryEl) {
      summaryEl.innerHTML = `<p style="color:var(--danger);">Unable to load cart. Please refresh the page.</p>`;
    }
  }
};

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorEl.textContent = '';
  
  // Check authentication before submitting
  if (!api.isAuthenticated) {
    // Save intended destination in localStorage - after login, stay on checkout
    localStorage.setItem('returnUrl', 'checkout.html');
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
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn?.textContent;
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Placing Order...';
    }
    
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
    console.error('[Checkout] Error placing order:', err);
    
    // Better error messages
    let errorMessage = 'Failed to place order. Please try again.';
    if (err.message) {
      if (err.message.includes('Unable to load orders')) {
        errorMessage = 'Unable to connect to server. Please check your connection and try again.';
      } else if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        errorMessage = 'Your session has expired. Please login again.';
      } else if (err.message.includes('cart') || err.message.includes('empty')) {
        errorMessage = 'Your cart is empty. Please add items to cart first.';
      } else {
        errorMessage = err.message;
      }
    }
    
    errorEl.textContent = errorMessage;
    
    // Re-enable submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Place Order';
    }
  }
});

// Extract JWT tokens from URL parameters (after Django login redirect)
// Returns true if tokens were found and processed, false otherwise
const extractTokensFromUrl = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const refresh = urlParams.get('refresh');
  
  if (token && refresh) {
    // Store tokens in localStorage immediately
    localStorage.setItem('edithcloths_token', token);
    localStorage.setItem('edithcloths_refresh', refresh);
    
    // Get user info from API to update authentication status
    try {
      const user = await api.request('/auth/me');
      localStorage.setItem('edithcloths_user', JSON.stringify(user));
    } catch (err) {
      console.error('[Checkout] Error fetching user info:', err);
      // Continue even if this fails
    }
    
    // Remove tokens from URL immediately
    const newUrl = window.location.pathname + window.location.search.replace(/[?&]token=[^&]*/, '').replace(/[?&]refresh=[^&]*/, '').replace(/^\?$/, '');
    window.history.replaceState({}, '', newUrl);
    
    // Check returnUrl and handle redirect if needed
    const returnUrl = localStorage.getItem('returnUrl');
    if (returnUrl) {
      localStorage.removeItem('returnUrl');
      
      // Get current page name for comparison
      const currentPage = window.location.pathname.split('/').pop() || '';
      const currentPath = window.location.pathname;
      
      // Normalize returnUrl - if it's just a filename, it should match the current page filename
      // If returnUrl is different from current page, redirect
      if (returnUrl !== currentPage && !currentPath.includes(returnUrl.replace('.html', ''))) {
        // Redirect to intended page
        window.location.href = returnUrl;
        return true; // Indicate redirect is happening
      } else {
        // Already on target page (checkout.html), just stay here
        // Don't redirect, tokens are processed and user is authenticated
        return true; // Tokens were processed
      }
    } else {
      // No returnUrl, tokens processed, stay on current page
      return true; // Tokens were processed
    }
  } else {
    // No tokens in URL, check if we have returnUrl and are authenticated
    // This handles the case where tokens were already extracted on a previous page load
    const returnUrl = localStorage.getItem('returnUrl');
    if (returnUrl && api.isAuthenticated) {
      const currentPage = window.location.pathname.split('/').pop() || '';
      if (returnUrl !== currentPage && returnUrl !== window.location.pathname) {
        localStorage.removeItem('returnUrl');
        window.location.href = returnUrl;
        return true; // Redirect is happening
      } else {
        // Already on target page, just remove returnUrl
        localStorage.removeItem('returnUrl');
        return false;
      }
    }
    return false; // No tokens found
  }
};

// Extract tokens immediately (before DOMContentLoaded) and wait for completion
// This prevents checkAuth from running before tokens are processed
const initCheckout = async () => {
  // First, extract and process any tokens from URL
  const tokensProcessed = await extractTokensFromUrl();
  
  // If tokens were processed and a redirect is happening, don't proceed
  if (tokensProcessed && (window.location.href.includes('/login') || window.location.href !== window.location.pathname + window.location.search)) {
    return; // Redirect is happening, don't load page
  }
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    await new Promise(resolve => window.addEventListener('DOMContentLoaded', resolve));
  }
  
  // Now check authentication - tokens should be processed by now
  // Only redirect to login if we're NOT authenticated and NO tokens were just processed
  if (!api.isAuthenticated && !tokensProcessed) {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return; // Redirected to login
    }
  }
  
  // Load summary if authenticated
  if (api.isAuthenticated) {
    loadSummary();
  }
};

// Start initialization immediately
initCheckout();
