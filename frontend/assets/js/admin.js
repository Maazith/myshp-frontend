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
  
  // Create mobile toggle button
  const adminGrid = document.querySelector('.admin-grid');
  if (adminGrid && !document.querySelector('.admin-mobile-toggle')) {
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'admin-mobile-toggle';
    mobileToggle.innerHTML = '☰';
    mobileToggle.setAttribute('aria-label', 'Toggle menu');
    adminGrid.insertBefore(mobileToggle, adminGrid.firstChild);
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    // Toggle sidebar on mobile
    mobileToggle.addEventListener('click', () => {
      navHost.classList.toggle('mobile-open');
      overlay.classList.toggle('active');
    });
    
    // Close sidebar when clicking overlay
    overlay.addEventListener('click', () => {
      navHost.classList.remove('mobile-open');
      overlay.classList.remove('active');
    });
    
    // Close sidebar when clicking a link
    navHost.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' || e.target.closest('a')) {
        navHost.classList.remove('mobile-open');
        overlay.classList.remove('active');
      }
    });
  }
  
  navHost.innerHTML = `
    <div class="logo" style="margin-bottom:2rem">
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
  
  const verifiedOrders = orders.filter((order) => order.payment_verified);
  const totalSales = verifiedOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  
  // Calculate monthly revenue (current month)
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyOrders = verifiedOrders.filter(order => {
    const orderDate = new Date(order.created_at);
    return orderDate >= currentMonthStart;
  });
  const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  
  // Calculate daily revenue (today)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dailyOrders = verifiedOrders.filter(order => {
    const orderDate = new Date(order.created_at);
    return orderDate >= todayStart;
  });
  const dailyRevenue = dailyOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  
  // Count orders by status
  const pendingOrders = orders.filter(o => !o.payment_verified || o.status === 'PAYMENT_PENDING').length;
  const verifiedCount = verifiedOrders.length;
  
  statsEl.innerHTML = `
    <div class="stat-card">
      <h3 style="color:var(--light-grey);font-size:0.9rem;font-weight:400;margin-bottom:0.5rem;">Total Orders</h3>
      <div class="stat-value" style="color:var(--white);font-size:2rem;font-weight:700;">${orders.length}</div>
    </div>
    <div class="stat-card">
      <h3 style="color:var(--light-grey);font-size:0.9rem;font-weight:400;margin-bottom:0.5rem;">Total Products</h3>
      <div class="stat-value" style="color:var(--white);font-size:2rem;font-weight:700;">${products.length}</div>
    </div>
    <div class="stat-card">
      <h3 style="color:var(--light-grey);font-size:0.9rem;font-weight:400;margin-bottom:0.5rem;">Total Revenue</h3>
      <div class="stat-value" style="color:var(--white);font-size:2rem;font-weight:700;">${formatCurrency(totalSales)}</div>
    </div>
    <div class="stat-card">
      <h3 style="color:var(--light-grey);font-size:0.9rem;font-weight:400;margin-bottom:0.5rem;">Monthly Revenue</h3>
      <div class="stat-value" style="color:var(--white);font-size:2rem;font-weight:700;">${formatCurrency(monthlyRevenue)}</div>
      <p style="color:var(--light-grey);font-size:0.75rem;margin-top:0.5rem;">This month</p>
    </div>
    <div class="stat-card">
      <h3 style="color:var(--light-grey);font-size:0.9rem;font-weight:400;margin-bottom:0.5rem;">Daily Revenue</h3>
      <div class="stat-value" style="color:var(--white);font-size:2rem;font-weight:700;">${formatCurrency(dailyRevenue)}</div>
      <p style="color:var(--light-grey);font-size:0.75rem;margin-top:0.5rem;">Today</p>
    </div>
    <div class="stat-card">
      <h3 style="color:var(--light-grey);font-size:0.9rem;font-weight:400;margin-bottom:0.5rem;">Verified Orders</h3>
      <div class="stat-value" style="color:var(--white);font-size:2rem;font-weight:700;">${verifiedCount}</div>
      <p style="color:var(--light-grey);font-size:0.75rem;margin-top:0.5rem;">Payment verified</p>
    </div>
  `;
  
  // Render revenue analytics
  renderRevenueAnalytics(verifiedOrders);
  
  // Render most ordered products
  renderTopProducts(orders);
  
  // Render recent orders
  const recentEl = document.getElementById('dashboard-orders');
  if (recentEl) {
    recentEl.innerHTML = `
      <h2 style="color:var(--white);font-size:1.5rem;margin-bottom:1rem;border-bottom:2px solid var(--light-grey);padding-bottom:0.5rem;">Recent Orders</h2>
      ${orders.length === 0 ? '<p style="color:var(--light-grey);text-align:center;padding:2rem;">No orders yet.</p>' : ''}
      ${orders
        .slice(0, 10)
        .map(
          (order) => `
          <div style="display:flex;justify-content:space-between;align-items:center;margin:1rem 0;padding:1rem;background:rgba(255,255,255,0.03);border-radius:var(--radius);border:1px solid rgba(255,255,255,0.1);">
            <div>
              <p class="badge" style="background:rgba(255,255,255,0.1);color:var(--white);padding:0.25rem 0.75rem;border-radius:4px;display:inline-block;margin-bottom:0.5rem;">${order.order_number}</p>
              <p style="color:var(--white);font-weight:600;font-size:1.1rem;margin:0.25rem 0;">${formatCurrency(order.total_amount)}</p>
              <p style="color:var(--light-grey);font-size:0.875rem;margin:0.25rem 0;">${new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <span class="status ${order.payment_verified ? 'paid' : 'pending'}" style="padding:0.5rem 1rem;border-radius:4px;font-weight:600;">
              ${order.payment_verified ? '✓ Paid' : '⏳ Pending'}
            </span>
          </div>
        `,
        )
        .join('')}
    `;
  }
};

const renderRevenueAnalytics = (verifiedOrders) => {
  const revenueEl = document.getElementById('revenue-analytics');
  if (!revenueEl) return;
  
  // Calculate revenue for last 7 days
  const dailyRevenue = {};
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dailyRevenue[dateKey] = 0;
    
    verifiedOrders.forEach(order => {
      const orderDate = new Date(order.created_at);
      if (orderDate.toDateString() === date.toDateString()) {
        dailyRevenue[dateKey] += Number(order.total_amount);
      }
    });
  }
  
  // Calculate monthly revenue for last 6 months
  const monthlyRevenue = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    let revenue = 0;
    
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
    
    verifiedOrders.forEach(order => {
      const orderDate = new Date(order.created_at);
      if (orderDate >= monthStart && orderDate <= monthEnd) {
        revenue += Number(order.total_amount);
      }
    });
    
    monthlyRevenue.push({ month: monthKey, revenue });
  }
  
  const maxDaily = Math.max(...Object.values(dailyRevenue), 1);
  const maxMonthly = Math.max(...monthlyRevenue.map(m => m.revenue), 1);
  
  revenueEl.innerHTML = `
    <div style="margin-top:1rem;">
      <h3 style="color:var(--white);font-size:1.1rem;margin-bottom:1rem;">Last 7 Days Revenue</h3>
      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        ${Object.entries(dailyRevenue).map(([date, revenue]) => {
          const height = Math.max((revenue / maxDaily) * 100, 5);
          return `
            <div style="display:flex;align-items:center;gap:1rem;">
              <div style="width:80px;color:var(--light-grey);font-size:0.875rem;">${date}</div>
              <div style="flex:1;background:rgba(255,255,255,0.1);border-radius:4px;height:30px;position:relative;">
                <div style="background:rgba(255,255,255,0.3);height:100%;width:${height}%;border-radius:4px;transition:width 0.3s;"></div>
                <div style="position:absolute;right:0.5rem;top:50%;transform:translateY(-50%);color:var(--white);font-weight:600;font-size:0.875rem;">${formatCurrency(revenue)}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
    <div style="margin-top:2rem;">
      <h3 style="color:var(--white);font-size:1.1rem;margin-bottom:1rem;">Last 6 Months Revenue</h3>
      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        ${monthlyRevenue.map(({ month, revenue }) => {
          const height = Math.max((revenue / maxMonthly) * 100, 5);
          return `
            <div style="display:flex;align-items:center;gap:1rem;">
              <div style="width:100px;color:var(--light-grey);font-size:0.875rem;">${month}</div>
              <div style="flex:1;background:rgba(255,255,255,0.1);border-radius:4px;height:30px;position:relative;">
                <div style="background:rgba(255,255,255,0.3);height:100%;width:${height}%;border-radius:4px;transition:width 0.3s;"></div>
                <div style="position:absolute;right:0.5rem;top:50%;transform:translateY(-50%);color:var(--white);font-weight:600;font-size:0.875rem;">${formatCurrency(revenue)}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
};

const renderTopProducts = (orders) => {
  const topProductsEl = document.getElementById('top-products');
  if (!topProductsEl) return;
  
  // Get all order items and count quantities
  const productCounts = {};
  
  const verifiedOrders = orders.filter(o => o.payment_verified);
  for (const order of verifiedOrders) {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        const productKey = item.product_title || 'Unknown Product';
        if (!productCounts[productKey]) {
          productCounts[productKey] = {
            name: productKey,
            quantity: 0,
            revenue: 0,
            orders: 0
          };
        }
        productCounts[productKey].quantity += item.quantity || 0;
        productCounts[productKey].revenue += (Number(item.price || 0) * (item.quantity || 0));
        productCounts[productKey].orders += 1;
      });
    }
  }
  
  // Sort by quantity (most ordered first)
  const topProducts = Object.values(productCounts)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);
  
  if (topProducts.length === 0) {
    topProductsEl.innerHTML = '<p style="color:var(--light-grey);text-align:center;padding:2rem;">No products ordered yet.</p>';
    return;
  }
  
  topProductsEl.innerHTML = `
    <div style="overflow-x:auto;margin-top:1rem;">
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="border-bottom:2px solid var(--light-grey);">
            <th style="text-align:left;padding:0.75rem;color:var(--white);font-weight:600;">#</th>
            <th style="text-align:left;padding:0.75rem;color:var(--white);font-weight:600;">Product</th>
            <th style="text-align:center;padding:0.75rem;color:var(--white);font-weight:600;">Qty</th>
            <th style="text-align:right;padding:0.75rem;color:var(--white);font-weight:600;">Revenue</th>
          </tr>
        </thead>
        <tbody>
          ${topProducts.map((product, index) => `
            <tr style="border-bottom:1px solid rgba(255,255,255,0.1);transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
              <td style="padding:0.75rem;color:var(--white);font-weight:600;">${index + 1}</td>
              <td style="padding:0.75rem;color:var(--white);font-weight:500;">${product.name}</td>
              <td style="text-align:center;padding:0.75rem;color:var(--white);font-weight:600;">${product.quantity}</td>
              <td style="text-align:right;padding:0.75rem;color:var(--white);font-weight:600;">${formatCurrency(product.revenue)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};

// Store all products for filtering
let allProducts = [];
let selectedCategory = null;
let searchQuery = '';
let selectedGender = '';

const renderProductsTable = (products) => {
  const container = document.getElementById('products-table');
  if (!container) return;
  
  // Store products globally for filtering
  allProducts = products || [];
  
  // Apply filters
  let filteredProducts = [...allProducts];
  
  if (selectedCategory) {
    // Normalize to string for comparison (HTML data attributes are always strings)
    const selectedCategoryStr = String(selectedCategory);
    filteredProducts = filteredProducts.filter(p => {
      const productCategoryId = p.category?.id;
      if (productCategoryId == null) return false;
      // Compare as strings to handle type mismatches
      return String(productCategoryId) === selectedCategoryStr;
    });
  }
  
  if (selectedGender) {
    filteredProducts = filteredProducts.filter(p => p.gender === selectedGender);
  }
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.category?.name?.toLowerCase().includes(query)
    );
  }
  
  if (!filteredProducts.length) {
    container.innerHTML = `
      <div style="text-align:center;padding:3rem;color:var(--light-grey);">
        <p style="font-size:1.2rem;margin-bottom:0.5rem;">No products found</p>
        <p>${allProducts.length > 0 ? 'Try adjusting your filters or search query.' : 'Start by adding your first product.'}</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = `
    <div style="overflow-x:auto;">
      <table class="table" style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="border-bottom:2px solid var(--light-grey);">
            <th style="text-align:left;padding:1rem;color:var(--white);font-weight:600;">Product</th>
            <th style="text-align:left;padding:1rem;color:var(--white);font-weight:600;">Category</th>
            <th style="text-align:center;padding:1rem;color:var(--white);font-weight:600;">Gender</th>
            <th style="text-align:right;padding:1rem;color:var(--white);font-weight:600;">Price</th>
            <th style="text-align:center;padding:1rem;color:var(--white);font-weight:600;">Action</th>
          </tr>
        </thead>
        <tbody>
          ${filteredProducts
            .map(
              (product) => `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.1);transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
                  <td style="padding:1rem;color:var(--white);font-weight:500;">${product.title}</td>
                  <td style="padding:1rem;color:var(--light-grey);">
                    <span class="badge" style="background:rgba(255,255,255,0.1);color:var(--white);padding:0.25rem 0.75rem;border-radius:4px;font-size:0.875rem;">
                      ${product.category?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td style="text-align:center;padding:1rem;color:var(--light-grey);">
                    <span style="padding:0.25rem 0.75rem;border-radius:4px;font-size:0.875rem;background:rgba(255,255,255,0.1);">
                      ${product.gender || 'UNISEX'}
                    </span>
                  </td>
                  <td style="text-align:right;padding:1rem;color:var(--white);font-weight:600;">${formatCurrency(product.base_price)}</td>
                  <td style="text-align:center;padding:1rem;">
                    <button class="btn ghost small" data-action="delete-product" data-id="${product.id}" style="color:var(--danger);">
                      Delete
                    </button>
                  </td>
                </tr>
              `,
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
  
  // Update stats
  renderProductStats(filteredProducts);
};

const renderCategoryTabs = (categories, products) => {
  const tabsContainer = document.getElementById('category-tabs');
  if (!tabsContainer) return;
  
  // Count products per category - normalize IDs to strings for consistency
  const categoryCounts = {};
  products.forEach(product => {
    const catId = product.category?.id;
    // Use string key for consistency (HTML dataset attributes are strings)
    const categoryKey = catId != null ? String(catId) : 'uncategorized';
    categoryCounts[categoryKey] = (categoryCounts[categoryKey] || 0) + 1;
  });
  
  // Create "All" tab
  const totalCount = products.length;
  tabsContainer.innerHTML = `
    <button 
      class="category-tab ${!selectedCategory ? 'active' : ''}" 
      data-category=""
      style="padding:0.75rem 1.5rem;background:${!selectedCategory ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'};border:1px solid var(--light-grey);border-radius:var(--radius);color:var(--white);cursor:pointer;transition:all 0.2s;font-weight:${!selectedCategory ? '600' : '400'};"
      onmouseover="if(!this.classList.contains('active')) this.style.background='rgba(255,255,255,0.1)'"
      onmouseout="if(!this.classList.contains('active')) this.style.background='rgba(255,255,255,0.05)'"
    >
      All Products <span style="background:rgba(255,255,255,0.2);padding:0.125rem 0.5rem;border-radius:12px;font-size:0.875rem;margin-left:0.5rem;">${totalCount}</span>
    </button>
    ${categories.map(cat => {
      // Normalize category ID to string for consistent counting
      const categoryKey = String(cat.id);
      const count = categoryCounts[categoryKey] || 0;
      // Compare as strings (selectedCategory comes from HTML dataset which is always a string)
      const isActive = selectedCategory != null && String(selectedCategory) === String(cat.id);
      return `
        <button 
          class="category-tab ${isActive ? 'active' : ''}" 
          data-category="${cat.id}"
          style="padding:0.75rem 1.5rem;background:${isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'};border:1px solid var(--light-grey);border-radius:var(--radius);color:var(--white);cursor:pointer;transition:all 0.2s;font-weight:${isActive ? '600' : '400'};"
          onmouseover="if(!this.classList.contains('active')) this.style.background='rgba(255,255,255,0.1)'"
          onmouseout="if(!this.classList.contains('active')) this.style.background='rgba(255,255,255,0.05)'"
        >
          ${cat.name} <span style="background:rgba(255,255,255,0.2);padding:0.125rem 0.5rem;border-radius:12px;font-size:0.875rem;margin-left:0.5rem;">${count}</span>
        </button>
      `;
    }).join('')}
  `;
  
  // Add click handlers
  tabsContainer.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const categoryValue = tab.dataset.category;
      // Convert empty string to null, and ensure proper type handling
      selectedCategory = categoryValue && categoryValue !== '' ? categoryValue : null;
      renderCategoryTabs(categories, allProducts);
      renderProductsTable(allProducts);
    });
  });
};

const renderProductStats = (products) => {
  const statsContainer = document.getElementById('products-stats');
  if (!statsContainer) return;
  
  const totalProducts = allProducts.length;
  const filteredCount = products.length;
  
  // Count by category
  const categoryStats = {};
  allProducts.forEach(product => {
    const catName = product.category?.name || 'Uncategorized';
    categoryStats[catName] = (categoryStats[catName] || 0) + 1;
  });
  
  // Count by gender
  const genderStats = { MEN: 0, WOMEN: 0, UNISEX: 0 };
  allProducts.forEach(product => {
    if (genderStats[product.gender] !== undefined) {
      genderStats[product.gender]++;
    }
  });
  
  statsContainer.innerHTML = `
    <div style="display:flex;gap:2rem;flex-wrap:wrap;align-items:center;">
      <div style="color:var(--light-grey);">
        <span style="color:var(--white);font-weight:600;font-size:1.2rem;">${totalProducts}</span> Total Products
      </div>
      ${filteredCount !== totalProducts ? `
        <div style="color:var(--light-grey);">
          <span style="color:var(--white);font-weight:600;font-size:1.2rem;">${filteredCount}</span> Showing (filtered)
        </div>
      ` : ''}
      <div style="color:var(--light-grey);">
        <span style="color:var(--white);font-weight:600;font-size:1.2rem;">${Object.keys(categoryStats).length}</span> Categories
      </div>
    </div>
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
          <th>Actions</th>
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
                  <button class="btn ghost small" data-action="view-details" data-id="${order.id}" style="margin-right:0.5rem;">View Details</button>
                  ${!order.payment_verified ? `<button class="btn ghost small" data-action="mark-paid" data-id="${order.id}">Mark Paid</button>` : ''}
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
  try {
    const [products, categories] = await Promise.all([
      api.request('/products/'),
      api.request('/categories/')
    ]);
    
    // Render category tabs with product counts
    if (categories && Array.isArray(categories)) {
      renderCategoryTabs(categories, products || []);
    }
    
    // Render products table
    renderProductsTable(products || []);
  } catch (err) {
    console.error('Error fetching products:', err);
    const container = document.getElementById('products-table');
    if (container) {
      container.innerHTML = `<p style="color:var(--danger);">Error loading products: ${err.message}</p>`;
    }
  }
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
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.request(`/products/${id}/delete`, { method: 'DELETE' });
      refreshProductsTableFn?.();
    // Refresh category tabs after deletion to update counts
    const categories = await api.request('/categories/').catch(() => []);
    if (categories && Array.isArray(categories)) {
      renderCategoryTabs(categories, allProducts);
    }
    } catch (err) {
      alert(`Error deleting product: ${err.message}`);
    }
  },
  async deleteCategory(id) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.request(`/categories/${id}/`, { method: 'DELETE' });
      refreshCategoriesFn?.();
    } catch (err) {
      alert(`Error deleting category: ${err.message}`);
    }
  },
  async markPaid(id) {
    try {
      await api.request(`/orders/${id}/mark-paid`, { method: 'POST' });
      refreshOrdersFn?.();
    } catch (err) {
      alert(`Error marking order as paid: ${err.message}`);
    }
  },
  async updateStatus(id, status) {
    try {
      await api.request(`/orders/${id}/status`, { method: 'POST', body: { status } });
      refreshOrdersFn?.();
    } catch (err) {
      alert(`Error updating order status: ${err.message}`);
    }
  },
  async deleteBanner(id) {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      await api.request(`/banners/${id}/`, { method: 'DELETE' });
      refreshBannersFn?.();
    } catch (err) {
      alert(`Error deleting banner: ${err.message}`);
    }
  },
};

const showOrderDetails = async (orderId) => {
  try {
    // Fetch all orders to get the full order details
    const orders = await api.request('/orders/');
    const order = orders.find(o => String(o.id) === String(orderId));
    
    if (!order) {
      alert('Order not found');
      return;
    }
    
    renderOrderDetailsModal(order);
    document.getElementById('order-detail-modal').style.display = 'block';
  } catch (err) {
    alert(`Error loading order details: ${err.message}`);
  }
};

const renderOrderDetailsModal = (order) => {
  const content = document.getElementById('order-detail-content');
  if (!content) return;
  
  const paymentProof = order.payment_proof || {};
  const items = order.items || [];
  const user = order.user || {};
  
  content.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:2rem;">
      <!-- Order Information -->
      <div style="background:rgba(255,255,255,0.05);border:1px solid var(--light-grey);border-radius:var(--radius);padding:1.5rem;">
        <h3 style="color:#FFFFFF;margin-bottom:1rem;border-bottom:1px solid var(--light-grey);padding-bottom:0.5rem;">Order Information</h3>
        <p style="color:#E6E6E6;margin-bottom:0.5rem;"><strong>Order Number:</strong> ${order.order_number}</p>
        <p style="color:#E6E6E6;margin-bottom:0.5rem;"><strong>Total Amount:</strong> ${formatCurrency(order.total_amount)}</p>
        <p style="color:#E6E6E6;margin-bottom:0.5rem;"><strong>Status:</strong> ${order.status_display || order.status}</p>
        <p style="color:#E6E6E6;margin-bottom:0.5rem;"><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
        <p style="color:#E6E6E6;"><strong>Payment Verified:</strong> ${order.payment_verified ? '✅ Yes' : '❌ No'}</p>
      </div>
      
      <!-- Customer Information -->
      <div style="background:rgba(255,255,255,0.05);border:1px solid var(--light-grey);border-radius:var(--radius);padding:1.5rem;">
        <h3 style="color:#FFFFFF;margin-bottom:1rem;border-bottom:1px solid var(--light-grey);padding-bottom:0.5rem;">Customer Information</h3>
        <p style="color:#E6E6E6;margin-bottom:0.5rem;"><strong>Name:</strong> ${user.first_name || ''} ${user.last_name || ''} ${!user.first_name && !user.last_name ? user.username : ''}</p>
        <p style="color:#E6E6E6;margin-bottom:0.5rem;"><strong>Email:</strong> ${user.email || 'N/A'}</p>
        <p style="color:#E6E6E6;margin-bottom:0.5rem;"><strong>Username:</strong> ${user.username || 'N/A'}</p>
      </div>
    </div>
    
    <!-- Shipping Address -->
    <div style="background:rgba(255,255,255,0.05);border:1px solid var(--light-grey);border-radius:var(--radius);padding:1.5rem;margin-top:1.5rem;">
      <h3 style="color:#FFFFFF;margin-bottom:1rem;border-bottom:1px solid var(--light-grey);padding-bottom:0.5rem;">Shipping Address</h3>
      ${order.name || order.phone_number || order.address ? `
        <div style="color:#E6E6E6;line-height:1.8;">
          ${order.name ? `<p style="margin-bottom:0.5rem;"><strong>Name:</strong> ${order.name}</p>` : ''}
          ${order.phone_number ? `<p style="margin-bottom:0.5rem;"><strong>Phone:</strong> ${order.phone_number}</p>` : ''}
          ${order.address ? `<p style="margin-bottom:0.5rem;"><strong>Address:</strong> ${order.address}</p>` : ''}
          ${order.street_name ? `<p style="margin-bottom:0.5rem;"><strong>Street:</strong> ${order.street_name}</p>` : ''}
          ${order.city_town || order.district || order.pin_code ? `
            <p style="margin-bottom:0.5rem;">
              <strong>Location:</strong> 
              ${order.city_town || ''}${order.city_town && order.district ? ', ' : ''}${order.district || ''}${(order.city_town || order.district) && order.pin_code ? ' - ' : ''}${order.pin_code || ''}
            </p>
          ` : ''}
        </div>
      ` : `
        <p style="color:#E6E6E6;white-space:pre-wrap;">${order.shipping_address || 'No address provided'}</p>
      `}
    </div>
    
    <!-- Payment Information -->
    <div style="background:rgba(255,255,255,0.05);border:1px solid var(--light-grey);border-radius:var(--radius);padding:1.5rem;margin-top:1.5rem;">
      <h3 style="color:#FFFFFF;margin-bottom:1rem;border-bottom:1px solid var(--light-grey);padding-bottom:0.5rem;">Payment Information</h3>
      <p style="color:#E6E6E6;margin-bottom:0.5rem;"><strong>UPI Reference ID:</strong> ${paymentProof.reference_id || order.upi_reference || 'Not provided'}</p>
      ${paymentProof.proof_file_url ? `
        <div style="margin-top:1rem;">
          <p style="color:#E6E6E6;margin-bottom:0.5rem;"><strong>Payment Screenshot:</strong></p>
          <img src="${paymentProof.proof_file_url}" alt="Payment Screenshot" style="max-width:100%;border-radius:var(--radius);border:1px solid var(--light-grey);cursor:pointer;" onclick="window.open('${paymentProof.proof_file_url}', '_blank')" />
          <p style="color:#E6E6E6;font-size:0.85rem;margin-top:0.5rem;">Click image to view full size</p>
        </div>
      ` : '<p style="color:#E6E6E6;">No payment screenshot uploaded</p>'}
    </div>
    
    <!-- Order Items -->
    <div style="background:rgba(255,255,255,0.05);border:1px solid var(--light-grey);border-radius:var(--radius);padding:1.5rem;margin-top:1.5rem;">
      <h3 style="color:#FFFFFF;margin-bottom:1rem;border-bottom:1px solid var(--light-grey);padding-bottom:0.5rem;">Order Items</h3>
      ${items.length > 0 ? `
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid var(--light-grey);">
              <th style="text-align:left;color:#FFFFFF;padding:0.5rem;">Product</th>
              <th style="text-align:center;color:#FFFFFF;padding:0.5rem;">Size</th>
              <th style="text-align:center;color:#FFFFFF;padding:0.5rem;">Color</th>
              <th style="text-align:center;color:#FFFFFF;padding:0.5rem;">Quantity</th>
              <th style="text-align:right;color:#FFFFFF;padding:0.5rem;">Price</th>
              <th style="text-align:right;color:#FFFFFF;padding:0.5rem;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
                <td style="color:#E6E6E6;padding:0.75rem;">${item.product_title || 'N/A'}</td>
                <td style="text-align:center;color:#E6E6E6;padding:0.75rem;">${item.size || 'N/A'}</td>
                <td style="text-align:center;color:#E6E6E6;padding:0.75rem;">${item.color || 'N/A'}</td>
                <td style="text-align:center;color:#E6E6E6;padding:0.75rem;">${item.quantity || 1}</td>
                <td style="text-align:right;color:#E6E6E6;padding:0.75rem;">${formatCurrency(item.price || 0)}</td>
                <td style="text-align:right;color:#FFFFFF;font-weight:700;padding:0.75rem;">${formatCurrency((item.price || 0) * (item.quantity || 1))}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5" style="text-align:right;color:#FFFFFF;font-weight:700;padding:0.75rem;border-top:2px solid var(--light-grey);">Total:</td>
              <td style="text-align:right;color:#FFFFFF;font-weight:700;padding:0.75rem;border-top:2px solid var(--light-grey);">${formatCurrency(order.total_amount)}</td>
            </tr>
          </tfoot>
        </table>
      ` : '<p style="color:#E6E6E6;">No items found</p>'}
    </div>
  `;
};

document.body.addEventListener('click', (event) => {
  const action = event.target.dataset.action;
  const id = event.target.dataset.id;
  if (!action || !id) return;
  if (action === 'delete-product') adminActions.deleteProduct(id);
  if (action === 'delete-category') adminActions.deleteCategory(id);
  if (action === 'mark-paid') adminActions.markPaid(id);
  if (action === 'delete-banner') adminActions.deleteBanner(id);
  if (action === 'view-details') showOrderDetails(id);
});

// Close modal handlers
document.addEventListener('click', (event) => {
  const modal = document.getElementById('order-detail-modal');
  if (!modal) return;
  
  if (event.target.id === 'close-order-modal' || event.target === modal) {
    modal.style.display = 'none';
  }
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

// Variant management
let variantCounter = 0;
const variants = [];

const addVariantUI = () => {
  const container = document.getElementById('variants-container');
  if (!container) return;
  
  const variantId = `variant-${variantCounter++}`;
  const variantDiv = document.createElement('div');
  variantDiv.className = 'variant-item';
  variantDiv.id = variantId;
  variantDiv.style.cssText = 'background:rgba(255,255,255,0.05);border:1px solid var(--light-grey);border-radius:var(--radius);padding:1.5rem;margin-bottom:1rem;';
  
  variantDiv.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
      <h4 style="color:#FFFFFF;margin:0;">Color Variant</h4>
      <button type="button" class="btn ghost small" onclick="removeVariant('${variantId}')">Remove</button>
    </div>
    <div class="form-group">
      <label>Color Name</label>
      <input type="text" class="variant-color" placeholder="e.g., Red, Blue, Black" required />
    </div>
    <div class="form-group">
      <label>Sizes Available</label>
      <div style="display:flex;gap:1rem;flex-wrap:wrap;">
        <label style="display:flex;align-items:center;gap:0.5rem;">
          <input type="checkbox" value="S" class="variant-size" /> S
        </label>
        <label style="display:flex;align-items:center;gap:0.5rem;">
          <input type="checkbox" value="M" class="variant-size" /> M
        </label>
        <label style="display:flex;align-items:center;gap:0.5rem;">
          <input type="checkbox" value="L" class="variant-size" /> L
        </label>
        <label style="display:flex;align-items:center;gap:0.5rem;">
          <input type="checkbox" value="XL" class="variant-size" /> XL
        </label>
      </div>
    </div>
    <div class="form-group">
      <label>Stock Quantity</label>
      <input type="number" class="variant-stock" min="0" value="0" />
    </div>
    <div class="form-group">
      <label>Price Override (Optional - Different price for this color)</label>
      <input type="number" name="price_override" class="variant-price-override" step="0.01" min="0" placeholder="Leave empty to use default" />
      <small style="color:#E6E6E6;font-size:0.85rem;display:block;margin-top:0.5rem;">Set a different price for this color variant (e.g., Orange = 1800, Yellow = 1500)</small>
    </div>
    <div class="form-group">
      <label>Images for this Color (Multiple images allowed)</label>
      <input type="file" class="variant-images" multiple accept="image/png,image/jpeg,image/jpg,image/gif,image/webp" />
      <small style="color:#E6E6E6;font-size:0.85rem;display:block;margin-top:0.5rem;">Select one or more images for this color</small>
      <div class="variant-images-preview" style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:1rem;"></div>
    </div>
  `;
  
  container.appendChild(variantDiv);
  
  // Add image preview handler
  const imageInput = variantDiv.querySelector('.variant-images');
  const previewDiv = variantDiv.querySelector('.variant-images-preview');
  imageInput.addEventListener('change', (e) => {
    previewDiv.innerHTML = '';
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target.result;
        img.style.cssText = 'max-width:100px;max-height:100px;border-radius:var(--radius);border:1px solid var(--light-grey);object-fit:cover;';
        previewDiv.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  });
};

window.removeVariant = (variantId) => {
  const variant = document.getElementById(variantId);
  if (variant) variant.remove();
};

const handleProductForm = () => {
  const form = document.getElementById('product-form');
  if (!form || productFormBound) return;
  productFormBound = true;
  
  // Add variant button handler
  const addVariantBtn = document.getElementById('add-variant-btn');
  if (addVariantBtn) {
    addVariantBtn.addEventListener('click', addVariantUI);
  }
  
  
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = document.getElementById('product-message');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Validate required fields
    const title = document.getElementById('title').value.trim();
    if (!title) {
      message.style.color = 'var(--danger)';
      message.textContent = 'Please enter a product title.';
      return;
    }
    
    const categoryId = document.getElementById('category-id').value;
    if (!categoryId) {
      message.style.color = 'var(--danger)';
      message.textContent = 'Please select a category.';
      return;
    }
    
    // Validate that at least one variant is added
    const variantItems = document.querySelectorAll('.variant-item');
    if (variantItems.length === 0) {
      message.style.color = 'var(--danger)';
      message.textContent = 'Please add at least one color variant with sizes.';
      return;
    }
    
    // Validate variants have required data
    let hasValidVariant = false;
    variantItems.forEach(variantItem => {
      const color = variantItem.querySelector('.variant-color')?.value.trim();
      const sizes = Array.from(variantItem.querySelectorAll('.variant-size:checked'));
      if (color && sizes.length > 0) {
        hasValidVariant = true;
      }
    });
    
    if (!hasValidVariant) {
      message.style.color = 'var(--danger)';
      message.textContent = 'Please add at least one color variant with at least one size selected.';
      return;
    }
    
    // Build FormData manually to ensure all fields are correct
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category_id', categoryId);
    formData.append('gender', document.getElementById('gender').value || 'UNISEX');
    
    // Calculate base_price from first variant's price override, or use 0 (backend will calculate from variants)
    let basePrice = 0;
    variantItems.forEach((variantItem) => {
      const priceOverrideInput = variantItem.querySelector('input[name="price_override"]');
      if (priceOverrideInput && priceOverrideInput.value && parseFloat(priceOverrideInput.value) > 0) {
        basePrice = parseFloat(priceOverrideInput.value);
        return;
      }
    });
    formData.append('base_price', basePrice);
    
    const description = document.getElementById('description').value.trim();
    if (description) {
      formData.append('description', description);
    }
    
    // Handle checkbox
    const isFeatured = document.querySelector('input[name="is_featured"]').checked;
    formData.append('is_featured', isFeatured ? 'true' : 'false');
    
    // Collect variants data (reuse variantItems from validation above)
    const variantsData = [];
    
    variantItems.forEach((variantItem, idx) => {
      const color = variantItem.querySelector('.variant-color')?.value.trim();
      if (!color) return; // Skip if no color specified
      
      const sizes = Array.from(variantItem.querySelectorAll('.variant-size:checked')).map(cb => cb.value);
      const stock = parseInt(variantItem.querySelector('.variant-stock')?.value || '0');
      const priceOverrideInput = variantItem.querySelector('.variant-price-override');
      const priceOverride = priceOverrideInput && priceOverrideInput.value ? parseFloat(priceOverrideInput.value) : null;
      const images = variantItem.querySelector('.variant-images')?.files || [];
      
      // Create variant for each size
      sizes.forEach(size => {
        variantsData.push({
          color: color,
          size: size,
          stock: stock,
          price: priceOverride, // Include price override for this color
          images: Array.from(images)
        });
      });
      
      // Add images for this color variant
      Array.from(images).forEach((imageFile, imgIdx) => {
        formData.append(`variant_${idx}_color_${color}_image_${imgIdx}`, imageFile);
      });
    });
    
    // Add variants JSON if any variants were added
    if (variantsData.length > 0) {
      formData.append('variants', JSON.stringify(variantsData.map(v => ({
        color: v.color,
        size: v.size,
        stock: v.stock,
        price: v.price || null // Include price override if set
      }))));
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    message.textContent = '';
    
    try {
      console.log('Creating product:', {
        title: title,
        categoryId: categoryId,
        basePrice: basePrice,
        gender: document.getElementById('gender').value,
        isFeatured: isFeatured,
        variantCount: variantsData.length
      });
      
      const result = await api.request('/products/add', { 
        method: 'POST', 
        body: formData, 
        isForm: true 
      });
      
      console.log('Product created successfully:', result);
      message.style.color = 'var(--success)';
      message.textContent = `✅ Product "${result.title || title}" saved successfully! ID: ${result.id}`;
      
      form.reset();
      
      // Reset category dropdown
      if (refreshCategoriesFn) {
        await refreshCategoriesFn();
      }
      
      // Show product details in console for debugging
      console.log('Created product details:', {
        id: result.id,
        title: result.title,
        gender: result.gender,
        is_active: result.is_active,
        category: result.category?.name
      });
      
      // Reset button after 5 seconds (longer to read message)
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Product';
        message.textContent = '';
      }, 5000);
    } catch (err) {
      console.error('Product creation error:', err);
      message.style.color = 'var(--danger)';
      const errorMsg = err.message || 'Failed to create product. Please check: 1) Backend is running, 2) All required fields are filled, 3) You are logged in as admin.';
      message.textContent = errorMsg;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Save Product';
    }
  });
};

const handleBannerForm = () => {
  const form = document.getElementById('banner-form');
  if (!form || bannerFormBound) return;
  bannerFormBound = true;
  
  // File preview handler
  const fileInput = document.getElementById('banner-media');
  const previewDiv = document.getElementById('file-preview');
  const previewImg = document.getElementById('preview-image');
  const fileInfo = document.getElementById('file-info');
  
  if (fileInput && previewDiv) {
    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImg.src = e.target.result;
          previewDiv.style.display = 'block';
          const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
          fileInfo.textContent = `File: ${file.name} (${fileSizeMB} MB)`;
        };
        reader.readAsDataURL(file);
      } else {
        previewDiv.style.display = 'none';
      }
    });
  }
  
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = document.getElementById('banner-message');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Validate required fields
    const title = document.getElementById('banner-title').value.trim();
    if (!title) {
      message.style.color = 'var(--danger)';
      message.textContent = 'Please enter a banner title.';
      return;
    }
    
    // Validate file is selected
    const fileInput = document.getElementById('banner-media');
    if (!fileInput.files || !fileInput.files[0]) {
      message.style.color = 'var(--danger)';
      message.textContent = 'Please select an image file to upload.';
      return;
    }
    
    const file = fileInput.files[0];
    
    // Check file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      message.style.color = 'var(--danger)';
      message.textContent = `Invalid file type: ${file.type}. Please select PNG, JPG, JPEG, GIF, or WEBP.`;
      return;
    }
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      message.style.color = 'var(--danger)';
      message.textContent = 'File size too large. Please select an image smaller than 10MB.';
      return;
    }
    
    // Build FormData manually to ensure correct field names
    const formData = new FormData();
    formData.append('title', title);
    const subtitle = document.getElementById('banner-subtitle').value.trim();
    if (subtitle) {
      formData.append('subtitle', subtitle);
    }
    formData.append('media', file);
    formData.append('is_active', 'true');
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Uploading...';
    message.textContent = '';
    
    try {
      console.log('Uploading banner:', {
        title: title,
        subtitle: subtitle,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });
      
      const result = await api.request('/banners/upload', { 
        method: 'POST', 
        body: formData, 
        isForm: true 
      });
      
      console.log('Banner upload successful:', result);
      message.style.color = 'var(--success)';
      message.textContent = '✅ Banner uploaded successfully!';
      
      // Clear preview
      if (previewDiv) previewDiv.style.display = 'none';
      form.reset();
      
      // Refresh banner list
      if (refreshBannersFn) {
        await refreshBannersFn();
      }
      
      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Upload Banner';
        message.textContent = '';
      }, 3000);
    } catch (err) {
      console.error('Banner upload error:', err);
      message.style.color = 'var(--danger)';
      const errorMsg = err.message || 'Failed to upload banner. Please check: 1) Backend is running, 2) File is valid image, 3) You are logged in as admin.';
      message.textContent = errorMsg;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Upload Banner';
    }
  });
};

const handleAdminLogin = () => {
  const form = document.getElementById('admin-login-form');
  if (!form) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const errorEl = document.getElementById('admin-login-error');
    if (errorEl) errorEl.textContent = ''; // Clear previous errors
    
    try {
      const username = document.getElementById('admin-user').value.trim();
      const password = document.getElementById('admin-pass').value.trim();
      
      if (!username || !password) {
        if (errorEl) errorEl.textContent = 'Please enter both username and password.';
        return;
      }
      
      const payload = await api.login({ username, password });
      
      // Check if user data is returned
      if (!payload || !payload.user) {
        throw new Error('Login successful but user data not returned. Please try again.');
      }
      
      // Check if user has admin privileges
      if (!payload.user.is_staff) {
        api.logout(); // Clear invalid token
        if (errorEl) {
          errorEl.textContent = 'Access denied. This account does not have admin privileges. Please contact an administrator.';
          errorEl.style.display = 'block';
          errorEl.style.color = 'var(--danger)';
        }
        return;
      }
      
      // Success - redirect to dashboard
      window.location.href = 'dashboard.html';
    } catch (err) {
      if (errorEl) {
        let errorMsg = err.message || 'Login failed. Please check your credentials and try again.';
        
        // More specific error messages
        if (errorMsg.includes('Failed to connect') || errorMsg.includes('fetch')) {
          errorMsg = 'Cannot connect to server. Please check your internet connection and ensure the backend is running.';
        } else if (errorMsg.includes('401') || errorMsg.includes('Unauthorized') || errorMsg.includes('No active account')) {
          errorMsg = 'Invalid username or password. Please check your credentials.';
        } else if (errorMsg.includes('404')) {
          errorMsg = 'API endpoint not found. Check if backend is running.';
        } else if (errorMsg.includes('500')) {
          errorMsg = 'Server error. Check backend console for details.';
        }
        
        errorEl.textContent = errorMsg;
        errorEl.style.display = 'block';
        errorEl.style.color = 'var(--danger)';
      }
      console.error('Admin login error:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
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
    
    // Setup search and filter functionality
    const searchInput = document.getElementById('search-products');
    const genderFilter = document.getElementById('filter-gender');
    const clearFiltersBtn = document.getElementById('clear-filters');
    
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderProductsTable(allProducts);
      });
    }
    
    if (genderFilter) {
      genderFilter.addEventListener('change', (e) => {
        selectedGender = e.target.value;
        renderProductsTable(allProducts);
      });
    }
    
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        selectedCategory = null;
        selectedGender = '';
        searchQuery = '';
        if (searchInput) searchInput.value = '';
        if (genderFilter) genderFilter.value = '';
        
        // Re-render category tabs
        loadCategories().then(categories => {
          renderCategoryTabs(categories || [], allProducts);
        });
        renderProductsTable(allProducts);
      });
    }
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

