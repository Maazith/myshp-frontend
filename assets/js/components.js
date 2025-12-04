import { api } from './api.js';

const NAV_LINKS = [
  { href: 'index.html', label: 'Home' },
  { href: 'men.html', label: 'Men' },
  { href: 'women.html', label: 'Women' },
  { href: 'myorders.html', label: 'My Orders', auth: true },
];

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value || 0);

export const orderStages = [
  { key: 'PLACED', label: 'Order Placed' },
  { key: 'SHIPPED', label: 'Shipped' },
  { key: 'REACHED', label: 'Reached Local Transport Office' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { key: 'DELIVERED', label: 'Delivered' },
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

export const mountNavbar = () => {
  const target = document.querySelector('[data-component="navbar"]');
  if (!target) return;
  target.innerHTML = `
    <nav class="nav">
      <div class="logo">
        <img src="../assets/images/logo.png" alt="EdithCloths logo" />
        <span>EdithCloths</span>
      </div>
      <div class="nav-links">
        ${NAV_LINKS.map((link) => {
          if (link.auth && !api.accessToken) return '';
          return `<a class="${isActive(link.href)}" href="${link.href}">${link.label}</a>`;
        }).join('')}
      </div>
      <div class="nav-actions">
        ${authLinks()}
      </div>
    </nav>
  `;
  const logoutBtn = document.getElementById('nav-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      api.logout();
      window.location.href = 'login.html';
    });
  }
};

export const mountFooter = () => {
  const target = document.querySelector('[data-component="footer"]');
  if (!target) return;
  target.innerHTML = `
    <footer class="footer">
      <div>
        <h3>EdithCloths</h3>
        <p>Luxury in every stitch.</p>
      </div>
      <div>
        <p>Customer Care</p>
        <a href="mailto:support@edithcloths.com">support@edithcloths.com</a>
      </div>
      <p class="copyright">© ${new Date().getFullYear()} EdithCloths</p>
    </footer>
  `;
};

export const createProductCard = (product) => `
  <article class="product-card" data-id="${product.id}">
    <div class="product-media">
      <img src="${product.hero_media || '../assets/img/placeholder.jpg'}" alt="${product.title}" />
    </div>
    <div class="product-meta">
      <h4>${product.title}</h4>
      <p>${formatCurrency(product.base_price)}</p>
      <button class="btn small" data-action="view" data-product="${product.id}">
        View Details
      </button>
    </div>
  </article>
`;

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

export const initComponents = () => {
  mountNavbar();
  mountFooter();
  initCarousels();
};

document.addEventListener('DOMContentLoaded', initComponents);
