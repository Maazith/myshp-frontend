import { api } from './api.js';

const NAV_LINKS = [
  { href: 'index.html', label: 'Home' },
  { href: 'men.html', label: 'Men' },
  { href: 'women.html', label: 'Women' },
  { href: 'myorders.html', label: 'My Orders', auth: true },
  { href: 'contact.html', label: 'Contact' },
];

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value || 0);

export const orderStages = [
  { key: 'PLACED', label: 'Placed' },
  { key: 'PAYMENT_PENDING', label: 'Payment Pending' },
  { key: 'PAYMENT_VERIFIED', label: 'Payment Verified' },
  { key: 'SHIPPED', label: 'Shipped' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { key: 'DELIVERED', label: 'Delivered' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

const isActive = (href) => {
  const current = window.location.pathname.split('/').pop();
  return current === href ? 'active' : '';
};

const authLinks = () => {
  if (api.accessToken) {
    return `
      <button class="btn ghost" id="nav-logout">Logout</button>
      <a class="icon-link" href="cart.html" title="Cart">
        &#128717;
      </a>`;
  }
  return `
    <a class="btn" href="login.html">Login</a>
    <a class="btn ghost" href="register.html">Register</a>`;
};

export const mountNavbar = async () => {
  const target = document.querySelector('[data-component="navbar"]');
  if (!target) return;
  
  // Determine correct logo path based on current page location
  const currentPath = window.location.pathname;
  const currentPage = window.location.pathname.split('/').pop() || '';
  const isAuthPage = currentPage === 'login.html' || currentPage === 'register.html';
  const isInPages = currentPath.includes('/pages/') || currentPath.includes('pages/');
  const isInAdmin = currentPath.includes('/admin/') || currentPath.includes('admin/');
  
  // Determine logo path based on location
  let defaultLogoPath;
  if (isInPages) {
    defaultLogoPath = '../assets/images/logo.jpg';
  } else if (isInAdmin) {
    defaultLogoPath = '../assets/images/logo.jpg';
  } else {
    defaultLogoPath = 'assets/images/logo.jpg';
  }
  
  let logoPath = defaultLogoPath;
  
  // Load logo from settings if available
  try {
    const settings = await api.getSettings();
    if (settings && settings.logo_url) {
      logoPath = settings.logo_url;
    }
  } catch (err) {
    // Use default logo path - continue with determined path
  }
  
  // Hide nav links on login/register pages or when not authenticated
  const showNavLinks = !isAuthPage && api.accessToken;
  // Hide auth actions (logout/cart) on auth pages
  const showAuthActions = !isAuthPage;
  
  target.innerHTML = `
    <nav class="nav">
      <div class="logo">
        <span>EdithCloths</span>
      </div>
      ${showNavLinks ? `<div class="nav-links">
        ${NAV_LINKS.map((link) => {
          if (link.auth && !api.accessToken) return '';
          return `<a class="${isActive(link.href)}" href="${link.href}">${link.label}</a>`;
        }).join('')}
      </div>` : ''}
      ${showAuthActions ? `<div class="nav-actions">
        ${authLinks()}
      </div>` : ''}
    </nav>
  `;
  const logoutBtn = document.getElementById('nav-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      api.logout();
    });
  }
};

export const mountFooter = async () => {
  const target = document.querySelector('[data-component="footer"]');
  if (!target) return;
  
  // Load email from SiteSettings
  let supportEmail = 'edith0530s@gmail.com'; // Default fallback
  try {
    const settings = await api.getSettings();
    if (settings?.contact_email) {
      supportEmail = settings.contact_email;
    }
  } catch (err) {
    // Use default if error loading settings
  }
  
  target.innerHTML = `
    <footer class="footer">
      <div>
        <h3>EdithCloths</h3>
        <p>Luxury in every stitch.</p>
      </div>
      <div>
        <p>Customer Care</p>
        <a href="mailto:${supportEmail}">${supportEmail}</a>
      </div>
      <p class="copyright">© ${new Date().getFullYear()} EdithCloths</p>
    </footer>
  `;
};

export const createProductCard = (product) => {
  // Use product's hero image or first variant image
  let imageUrl = product.hero_media_url || product.hero_media;
  
  // If no hero image, try to get first variant image
  if (!imageUrl && product.images && product.images.length > 0) {
    const firstImage = product.images.find(img => img.is_primary) || product.images[0];
    imageUrl = firstImage.image_url || firstImage.image;
  }
  
  // Fallback to placeholder
  if (!imageUrl) {
    imageUrl = '../assets/img/placeholder.jpg';
  }
  
  const productId = product.id;
  const price = product.base_price || 0;
  const title = product.title || 'Untitled Product';
  
  // Show price range if multiple variants with different prices
  let priceDisplay = formatCurrency(price);
  if (product.variants && product.variants.length > 0) {
    const prices = product.variants
      .map(v => parseFloat(v.price_override || product.base_price || 0))
      .filter(p => p > 0);
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (minPrice !== maxPrice) {
        priceDisplay = `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
      } else {
        priceDisplay = formatCurrency(minPrice);
      }
    }
  }
  
  return `
    <article class="product-card" data-id="${productId}">
      <div class="product-media">
        <img src="${imageUrl}" alt="${title}" onerror="this.src='../assets/img/placeholder.jpg'" />
      </div>
      <div class="product-meta">
        <h4>${title}</h4>
        <p>${priceDisplay}</p>
        <button class="btn small" data-action="view" data-product="${productId}">
          View Details
        </button>
      </div>
    </article>
  `;
};

export const renderOrderTracker = (status) => {
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

export const initCarousels = () => {
  document.querySelectorAll('.horizontal-scroll').forEach((container) => {
    container.addEventListener('wheel', (event) => {
      if (event.deltaY === 0) return;
      event.preventDefault();
      container.scrollTo({
        left: container.scrollLeft + event.deltaY,
        behavior: 'smooth',
      });
    });
  });
};

export const initComponents = async () => {
  await mountNavbar();
  await mountFooter();
  initCarousels();
};

document.addEventListener('DOMContentLoaded', initComponents);
