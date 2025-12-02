import { api } from './api.js';
import { formatCurrency, orderStages } from './components.js';

const page = document.body.dataset.admin;
const ADMIN_LINKS = [
  { key: 'dashboard', label: 'Dashboard', href: 'dashboard.html' },
  { key: 'products', label: 'Products', href: 'products.html' },
  { key: 'add-product', label: 'Add Product', href: 'add_product.html' },
  { key: 'orders', label: 'Orders', href: 'orders.html' },
  { key: 'banners', label: 'Banners', href: 'banners.html' },
];

let refreshProductsTableFn;
let refreshCategoriesFn;
let refreshOrdersFn;
let refreshBannersFn;
let categoryFormBound = false;
let productFormBound = false;
let bannerFormBound = false;

const getMe = async () => {
  try {
    return await api.request('/auth/me');
  } catch {
    return null;
  }
};

const requireAdmin = async () => {
  if (page === 'login') return null;
  if (!api.accessToken) {
    window.location.href = 'login.html';
    return null;
  }
  const me = await getMe();
  if (!me?.is_staff) {
    api.logout();
    window.location.href = 'login.html';
    return null;
  }
  return me;
};

const mountAdminNav = (activeKey) => {
  const navHost = document.querySelector('[data-admin-nav]');
  if (!navHost) return;
  navHost.innerHTML = `
    <div class="logo" style="margin-bottom:2rem">
      <img src="../assets/images/logo.png" alt="logo" />
      <span>Admin</span>
    </div>
    ${ADMIN_LINKS.map(
      (link) => `<a href="${link.href}" class="${link.key === activeKey ? 'active' : ''}">${link.label}</a>`,
    ).join('')}
    <button class="btn ghost" id="admin-logout" style="margin-top:2rem;width:100%">Logout</button>
  `;
  document.getElementById('admin-logout')?.addEventListener('click', () => {
    api.logout();
    window.location.href = 'login.html';
  });
};

const renderStats = (orders, products) => {
  const statsEl = document.getElementById('dashboard-stats');
  if (!statsEl) return;
  const totalSales = orders
    .filter((order) => order.payment_verified)
    .reduce((sum, order) => sum + Number(order.total_amount), 0);
  statsEl.innerHTML = `
    <div class="stat-card"><h3>Total Orders</h3><div class="stat-value">${orders.length}</div></div>
    <div class="stat-card"><h3>Total Products</h3><div class="stat-value">${products.length}</div></div>
    <div class="stat-card"><h3>Revenue</h3><div class="stat-value">${formatCurrency(totalSales)}</div></div>
  `;
  const recentEl = document.getElementById('dashboard-orders');
  if (recentEl) {
    recentEl.innerHTML = `
      <h2>Recent Orders</h2>
      ${orders
        .slice(0, 5)
        .map(
          (order) => `
          <div style="display:flex;justify-content:space-between;margin:1rem 0;border-bottom:1px solid rgba(255,255,255,.08);padding-bottom:1rem">
            <div>
              <p class="badge">${order.order_number}</p>
              <h3>${formatCurrency(order.total_amount)}</h3>
            </div>
            <span class="status ${order.payment_verified ? 'paid' : 'pending'}">${order.payment_verified ? 'Paid' : 'Pending'}</span>
          </div>
        `,
        )
        .join('')}
    `;
  }
};

const renderProductsTable = (products) => {
  const container = document.getElementById('products-table');
  if (!container) return;
  if (!products.length) {
    container.innerHTML = '<p>No products available.</p>';
    return;
  }
  container.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Category</th>
          <th>Gender</th>
          <th>Price</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${products
          .map(
            (product) => `
              <tr>
                <td>${product.title}</td>
                <td>${product.category?.name || ''}</td>
                <td>${product.gender}</td>
                <td>${formatCurrency(product.base_price)}</td>
                <td><button class="btn ghost small" data-action="delete-product" data-id="${product.id}">Delete</button></td>
              </tr>
            `,
          )
          .join('')}
      </tbody>
    </table>
  `;
};

const renderCategories = (categories) => {
  const list = document.getElementById('categories-list');
  if (!list) return;
  list.innerHTML = categories
    .map(
      (cat) => `
        <li style="display:flex;justify-content:space-between;margin-bottom:.5rem">
          <span>${cat.name}</span>
          <button class="btn ghost small" data-action="delete-category" data-id="${cat.id}">Remove</button>
        </li>
      `,
    )
    .join('');
};

const renderOrdersTable = (orders) => {
  const container = document.getElementById('orders-table');
  if (!container) return;
  if (!orders.length) {
    container.innerHTML = '<p>No orders yet.</p>';
    return;
  }
  container.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Order</th>
          <th>Total</th>
          <th>Status</th>
          <th>Payment</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${orders
          .map(
            (order) => `
              <tr>
                <td>${order.order_number}</td>
                <td>${formatCurrency(order.total_amount)}</td>
                <td>
                  <select data-action="update-status" data-id="${order.id}">
                    ${orderStages
                      .map(
                        (stage) => `
                          <option value="${stage.key}" ${stage.key === order.status ? 'selected' : ''}>${stage.label}</option>
                        `,
                      )
                      .join('')}
                  </select>
                </td>
                <td>
                  <span class="status ${order.payment_verified ? 'paid' : 'pending'}">
                    ${order.payment_verified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td>
                  <button class="btn ghost small" data-action="mark-paid" data-id="${order.id}">Mark Paid</button>
                </td>
              </tr>
            `,
          )
          .join('')}
      </tbody>
    </table>
  `;
};

const renderBanners = (banners) => {
  const container = document.getElementById('banners-list');
  if (!container) return;
  container.innerHTML = banners
    .map(
      (banner) => `
        <div style="display:flex;justify-content:space-between;margin-bottom:1rem;border-bottom:1px solid rgba(255,255,255,.08);padding-bottom:1rem">
          <div>
            <p class="badge">${banner.title}</p>
            <p>${banner.subtitle || ''}</p>
          </div>
          <button class="btn ghost small" data-action="delete-banner" data-id="${banner.id}">Delete</button>
        </div>
      `,
    )
    .join('');
};

const fetchProductsTable = async () => {
  const products = await api.request('/products/');
  renderProductsTable(products);
};

const fetchOrdersTable = async () => {
  const orders = await api.request('/orders/');
  renderOrdersTable(orders);
};

const fetchBannersList = async () => {
  const banners = await api.request('/banners/');
  renderBanners(banners);
};

const adminActions = {
  async deleteProduct(id) {
    await api.request(`/products/${id}/`, { method: 'DELETE' });
    refreshProductsTableFn?.();
  },
  async deleteCategory(id) {
    await api.request(`/categories/${id}/`, { method: 'DELETE' });
    refreshCategoriesFn?.();
  },
  async markPaid(id) {
    await api.request(`/orders/${id}/mark-paid`, { method: 'POST' });
    refreshOrdersFn?.();
  },
  async updateStatus(id, status) {
    await api.request(`/orders/${id}/status`, { method: 'POST', body: { status } });
    refreshOrdersFn?.();
  },
  async deleteBanner(id) {
    await api.request(`/banners/${id}/`, { method: 'DELETE' });
    refreshBannersFn?.();
  },
};

document.body.addEventListener('click', (event) => {
  const action = event.target.dataset.action;
  const id = event.target.dataset.id;
  if (!action || !id) return;
  if (action === 'delete-product') adminActions.deleteProduct(id);
  if (action === 'delete-category') adminActions.deleteCategory(id);
  if (action === 'mark-paid') adminActions.markPaid(id);
  if (action === 'delete-banner') adminActions.deleteBanner(id);
});

document.body.addEventListener('change', (event) => {
  const select = event.target.closest('select[data-action="update-status"]');
  if (!select) return;
  adminActions.updateStatus(select.dataset.id, select.value);
});

const loadCategories = async () => {
  const categories = await api.request('/categories/');
  renderCategories(categories);
  const select = document.getElementById('category-id');
  if (select) {
    select.innerHTML = categories.map((cat) => `<option value="${cat.id}">${cat.name}</option>`).join('');
  }
  return categories;
};

const handleCategoryForm = () => {
  const form = document.getElementById('category-form');
  if (!form || categoryFormBound) return;
  categoryFormBound = true;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    await api.request('/categories/add', { method: 'POST', body: { name: form.name.value } });
    form.reset();
    refreshCategoriesFn?.();
  });
};

const handleProductForm = () => {
  const form = document.getElementById('product-form');
  if (!form || productFormBound) return;
  productFormBound = true;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    if (form.variants.value.trim()) {
      formData.append('variants', form.variants.value.trim());
    }
    const message = document.getElementById('product-message');
    try {
      await api.request('/products/add', { method: 'POST', body: formData, isForm: true });
      message.style.color = 'var(--success)';
      message.textContent = 'Product saved';
      form.reset();
    } catch (err) {
      message.style.color = 'var(--danger)';
      message.textContent = err.message;
    }
  });
};

const handleBannerForm = () => {
  const form = document.getElementById('banner-form');
  if (!form || bannerFormBound) return;
  bannerFormBound = true;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const message = document.getElementById('banner-message');
    try {
      await api.request('/banners/upload', { method: 'POST', body: formData, isForm: true });
      message.style.color = 'var(--success)';
      message.textContent = 'Banner uploaded';
      form.reset();
      refreshBannersFn?.();
    } catch (err) {
      message.style.color = 'var(--danger)';
      message.textContent = err.message;
    }
  });
};

const handleAdminLogin = () => {
  const form = document.getElementById('admin-login-form');
  if (!form) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const errorEl = document.getElementById('admin-login-error');
    try {
      const payload = await api.login({ username: form.username.value, password: form.password.value });
      if (!payload.user?.is_staff) {
        errorEl.textContent = 'Not authorized as admin.';
        api.logout();
        return;
      }
      window.location.href = 'dashboard.html';
    } catch (err) {
      errorEl.textContent = err.message;
    }
  });
};

const initPage = async () => {
  if (page === 'login') {
    handleAdminLogin();
    return;
  }
  const admin = await requireAdmin();
  if (!admin) return;
  mountAdminNav(page);
  if (page === 'dashboard') {
    const [orders, products] = await Promise.all([api.request('/orders/'), api.request('/products/')]);
    renderStats(orders, products);
  }
  if (page === 'products') {
    refreshProductsTableFn = fetchProductsTable;
    refreshCategoriesFn = () => loadCategories();
    await Promise.all([fetchProductsTable(), loadCategories()]);
    handleCategoryForm();
  }
  if (page === 'add-product') {
    refreshCategoriesFn = () => loadCategories();
    await loadCategories();
    handleProductForm();
  }
  if (page === 'orders') {
    refreshOrdersFn = fetchOrdersTable;
    await fetchOrdersTable();
  }
  if (page === 'banners') {
    refreshBannersFn = fetchBannersList;
    handleBannerForm();
    await fetchBannersList();
  }
};

initPage();

