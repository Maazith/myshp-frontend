export const mountAdminNavbar = () => {
  const target = document.querySelector('[data-component="admin-navbar"]');
  if (!target) return;
  
  const currentPath = window.location.pathname;
  const isLogin = currentPath.includes('login.html');
  
  if (isLogin) {
    target.innerHTML = '';
    return;
  }
  
  const navLinks = [
    { href: 'dashboard.html', label: 'Dashboard' },
    { href: 'orders.html', label: 'Orders' },
    { href: 'products.html', label: 'Products' },
    { href: 'banners.html', label: 'Banners' },
    { href: 'users.html', label: 'Users' },
  ];
  
  const getLinkHref = (href) => {
    if (currentPath.includes('/admin/')) {
      return href;
    }
    return `admin/${href}`;
  };
  
  const isActive = (href) => {
    const current = currentPath.split('/').pop() || '';
    return current === href ? 'active' : '';
  };
  
  target.innerHTML = `
    <nav class="nav">
      <div class="nav-brand">
        <div class="logo">
          <a href="${getLinkHref('dashboard.html')}" style="color: inherit; text-decoration: none;">EdithCloths Admin</a>
        </div>
        <button class="mobile-menu-toggle" id="mobile-menu-btn" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div class="nav-links" id="nav-links">
        ${navLinks.map(link => `
          <a class="${isActive(link.href)}" href="${getLinkHref(link.href)}">${link.label}</a>
        `).join('')}
        <a href="#" id="admin-logout" style="color: var(--danger);">Logout</a>
      </div>
    </nav>
  `;
  
  // Mobile menu toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navLinksEl = document.getElementById('nav-links');
  if (menuBtn && navLinksEl) {
    menuBtn.addEventListener('click', () => {
      navLinksEl.classList.toggle('mobile-open');
    });
  }
  
  // Logout
  const logoutBtn = document.getElementById('admin-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        // Import adminAuth to clear auth
        const { adminAuth } = await import('./admin-auth.js');
        adminAuth.clearAuth();
        
        // Also clear via api.logout() for consistency
        const { api } = await import('./api.js');
        api.logout();
        
        // Redirect to login page
        const currentPath = window.location.pathname;
        const isInAdmin = currentPath.includes('/admin/') || currentPath.includes('admin/');
        const loginPath = isInAdmin ? 'login.html' : '/admin/login.html';
        window.location.href = loginPath;
      } catch (error) {
        console.error('Logout error:', error);
        // Fallback: clear localStorage and redirect
        localStorage.clear();
        window.location.href = 'login.html';
      }
    });
  }
};





