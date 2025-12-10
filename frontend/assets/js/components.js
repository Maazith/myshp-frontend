import { api } from './api.js';

// Get base path for navigation links
const getBasePath = () => {
  const currentPath = window.location.pathname;
  if (currentPath.includes('/pages/') || currentPath.includes('pages/')) {
    return ''; // Already in pages directory
  }
  return 'pages/'; // Need to go to pages directory
};

const NAV_LINKS = [
  { href: 'index.html', label: 'Home', basePath: '' },
  { href: 'men.html', label: 'Men', basePath: 'pages/' },
  { href: 'women.html', label: 'Women', basePath: 'pages/' },
  { href: 'contact.html', label: 'Contact', basePath: 'pages/' },
  { href: 'cart.html', label: 'Cart', basePath: 'pages/' },
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
  const currentPath = window.location.pathname;
  const current = currentPath.split('/').pop() || '';
  // Handle both with and without .html extension
  const currentPage = current.replace('.html', '');
  const hrefPage = href.replace('.html', '');
  
  // Also check if we're on the home page
  if (href === 'index.html' && (currentPath === '/' || current === '' || current === 'index.html')) {
    return 'active';
  }
  
  return currentPage === hrefPage || current === href ? 'active' : '';
};

// authLinks function removed - now handled inline in mountNavbar

export const mountNavbar = async () => {
  const target = document.querySelector('[data-component="navbar"]');
  if (!target) return;
  
  // Determine correct logo path based on current page location
  const currentPath = window.location.pathname;
  const currentPage = window.location.pathname.split('/').pop() || '';
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
  
  // Always show nav links (no auth required)
  const showNavLinks = true;
  
  // Check authentication status
  const isAuthenticated = api.isAuthenticated;
  const currentUser = api.currentUser();
  
  // Get backend base URL for login/signup links
  const backendBaseUrl = api.baseUrl.replace('/api', '');
  
  // Determine correct href paths based on current location
  const getLinkHref = (link) => {
    const currentPath = window.location.pathname;
    const isInPages = currentPath.includes('/pages/') || currentPath.includes('pages/');
    const isInAdmin = currentPath.includes('/admin/') || currentPath.includes('admin/');
    const isRoot = !isInPages && !isInAdmin && (currentPath === '/' || currentPath.endsWith('index.html') || currentPath.endsWith('/'));
    
    if (link.href === 'index.html') {
      // For home, go to root index.html
      if (isRoot) return 'index.html';
      if (isInPages) return '../index.html';
      if (isInAdmin) return '../index.html';
      return 'index.html';
    }
    
    // For other pages
    if (isInPages) {
      return link.href; // Already in pages directory
    } else if (isInAdmin) {
      return `../pages/${link.href}`; // Go up from admin to pages
    } else {
      return `pages/${link.href}`; // From root, go to pages
    }
  };
  
  target.innerHTML = `
    <nav class="nav">
      <div class="nav-brand">
        <div class="logo">
          <span>EdithCloths</span>
        </div>
        ${showNavLinks ? `<button class="mobile-menu-toggle" id="mobile-menu-btn" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>` : ''}
      </div>
      ${showNavLinks ? `<div class="nav-links" id="nav-links">
        ${NAV_LINKS.map((link) => {
          return `<a class="${isActive(link.href)}" href="${getLinkHref(link)}">${link.label}</a>`;
        }).join('')}
        ${isAuthenticated 
          ? `<a href="#" id="user-logout" style="color: var(--danger);">Logout</a>` 
          : `<a href="${backendBaseUrl}/login/?next=${encodeURIComponent(window.location.href)}" id="user-login">Login</a>`
        }
      </div>` : ''}
    </nav>
  `;
  
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
      mobileMenuBtn.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navLinks.classList.remove('mobile-open');
        mobileMenuBtn.classList.remove('active');
      }
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        mobileMenuBtn.classList.remove('active');
      });
    });
  }
  
  // Handle logout button
  const logoutBtn = document.getElementById('user-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      // Clear authentication tokens
      api.logout();
      // Redirect to home page
      const currentPath = window.location.pathname;
      const isInPages = currentPath.includes('/pages/') || currentPath.includes('pages/');
      const homeUrl = isInPages ? '../index.html' : 'index.html';
      window.location.href = homeUrl;
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
      <p class="copyright" id="admin-trigger" style="cursor: pointer; user-select: none; transition: opacity 0.2s;">© ${new Date().getFullYear()} EdithCloths</p>
    </footer>
  `;
  
  // Hidden admin trigger - click on copyright text (subtle, no button appearance)
  const trigger = document.getElementById('admin-trigger');
  if (trigger) {
    trigger.addEventListener('mouseenter', () => {
      trigger.style.opacity = '0.7';
    });
    trigger.addEventListener('mouseleave', () => {
      trigger.style.opacity = '1';
    });
    trigger.addEventListener('click', () => {
      window.location.href = '/admin/login.html';
    });
  }
};

// Helper function to convert relative image URLs to absolute backend URLs
export const getAbsoluteImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // If already absolute URL (http/https), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If starts with /media/, prepend backend URL
  if (imageUrl.startsWith('/media/')) {
    const backendUrl = api.baseUrl.replace('/api', '');
    return `${backendUrl}${imageUrl}`;
  }
  
  // If relative path, try to construct absolute URL
  if (imageUrl.startsWith('/')) {
    const backendUrl = api.baseUrl.replace('/api', '');
    return `${backendUrl}${imageUrl}`;
  }
  
  // Return as is for relative paths (like ../assets/img/placeholder.jpg)
  return imageUrl;
};

export const createProductCard = (product) => {
  // Use product's hero image or first variant image
  // Support both 'name' (from serializer) and 'title' fields
  let imageUrl = product.hero_media_url || product.hero_media;
  
  // If no hero image, try to get first variant image
  if (!imageUrl && product.images && product.images.length > 0) {
    const firstImage = product.images.find(img => img.is_primary) || product.images[0];
    imageUrl = firstImage.image_url || firstImage.image;
  }
  
  // Convert to absolute URL if needed
  imageUrl = getAbsoluteImageUrl(imageUrl);
  
  // Fallback to placeholder
  if (!imageUrl) {
    imageUrl = '../assets/img/placeholder.jpg';
  }
  
  const productId = product.id;
  const price = product.base_price || 0;
  // Support both 'name' (from serializer) and 'title' fields for compatibility
  const title = product.name || product.title || 'Untitled Product';
  
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
        <img src="${imageUrl}" alt="${title}" onerror="this.src='../assets/img/placeholder.jpg'" loading="lazy" />
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

// Extract JWT tokens from URL after login redirect (runs on all pages)
const extractTokensFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const refresh = urlParams.get('refresh');
  
  if (token && refresh) {
    // Store tokens from URL (after login redirect)
    localStorage.setItem('edithcloths_token', token);
    localStorage.setItem('edithcloths_refresh', refresh);
    
    // Remove tokens from URL for cleaner URL
    const newSearch = new URLSearchParams(window.location.search);
    newSearch.delete('token');
    newSearch.delete('refresh');
    const newUrl = window.location.pathname + (newSearch.toString() ? '?' + newSearch.toString() : '');
    window.history.replaceState({}, '', newUrl);
    
    console.log('[Auth] Tokens extracted from URL and stored');
  }
};

// Run token extraction immediately (before DOMContentLoaded)
extractTokensFromUrl();

document.addEventListener('DOMContentLoaded', initComponents);
