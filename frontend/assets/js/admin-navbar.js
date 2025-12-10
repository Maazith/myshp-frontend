// Admin navbar component
export const mountAdminNavbar = () => {
  const navbar = document.querySelector('[data-component="admin-navbar"]');
  if (!navbar) return;
  
  const currentPath = window.location.pathname;
  const isActive = (path) => currentPath.includes(path) ? 'active' : '';
  
  navbar.innerHTML = `
    <nav class="nav">
      <div class="nav-brand">
        <a href="/admin/dashboard.html" class="logo">EDITHCLOTHS</a>
        <span class="badge" style="margin-left: 1rem;">Admin</span>
      </div>
      <div class="nav-actions">
        <a href="/admin/dashboard.html" class="btn ghost small ${isActive('dashboard')}">Dashboard</a>
        <a href="/admin/orders.html" class="btn ghost small ${isActive('orders')}">Orders</a>
        <a href="/admin/products.html" class="btn ghost small ${isActive('products')}">Products</a>
        <a href="/admin/categories.html" class="btn ghost small ${isActive('categories')}">Categories</a>
        <a href="/admin/banners.html" class="btn ghost small ${isActive('banners')}">Banners</a>
        <button class="btn small" id="admin-logout-btn">Logout</button>
      </div>
    </nav>
  `;
  
  // Handle logout
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('admin_access');
        localStorage.removeItem('admin_refresh');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/login.html';
      }
    });
  }
};
