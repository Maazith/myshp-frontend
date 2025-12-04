import { api } from './api.js';
import { createProductCard, initCarousels, mountNavbar, mountFooter } from './components.js';

const sliderEl = document.getElementById('banner-slider');
const menWrapper = document.getElementById('men-carousel');
const womenWrapper = document.getElementById('women-carousel');

const sliderState = {
  index: 0,
  slides: [],
};

let currentBannerHash = '';
let bannerPollInterval = null;

const rotateSlider = () => {
  if (!sliderState.slides.length) return;
  sliderState.index = (sliderState.index + 1) % sliderState.slides.length;
  sliderState.slides.forEach((slide, idx) => slide.classList.toggle('active', idx === sliderState.index));
};

// Create a hash of banner content to detect any changes
const createBannerHash = (banners) => {
  if (!banners || !banners.length) return '';
  // Create a comprehensive hash including ID, URL, title, subtitle, and updated timestamp
  return banners.map(b => {
    const mediaUrl = b.media_url || b.media || '';
    const title = b.title || '';
    const subtitle = b.subtitle || '';
    const updatedAt = b.updated_at || b.created_at || '';
    const id = b.id || '';
    // Include filename to detect file changes
    const filename = mediaUrl ? mediaUrl.split('/').pop().split('?')[0] : '';
    // Create hash with all relevant data
    return `${id}:${filename}:${title}:${subtitle}:${updatedAt}`;
  }).sort().join('||');
};

const renderBanners = (banners) => {
  if (!sliderEl) return;
  
  // Create hash of current banner content
  const newBannerHash = createBannerHash(banners || []);
  
  // Always re-render if hash changed or if it's the first load
  const shouldRender = newBannerHash !== currentBannerHash || !currentBannerHash;
  
  if (!shouldRender && sliderEl.innerHTML) {
    return;
  }
  
  // Update the hash
  currentBannerHash = newBannerHash;
  
  if (!banners || !banners.length) {
    sliderEl.innerHTML = '';
    return;
  }
  
  sliderEl.innerHTML = banners
    .map(
      (banner, idx) => {
        // Add cache-busting parameter to force image refresh on updates
        let mediaUrl = banner.media_url || banner.media || '';
        if (mediaUrl) {
          // Use updated_at timestamp or current time for cache-busting
          const timestamp = banner.updated_at ? new Date(banner.updated_at).getTime() : Date.now();
          const separator = mediaUrl.includes('?') ? '&' : '?';
          // Add both updated_at timestamp and random number for aggressive cache-busting
          mediaUrl = `${mediaUrl}${separator}t=${timestamp}&r=${Math.random().toString(36).substr(2, 9)}`;
        }
        
        return `
        <div class="hero-slide ${idx === 0 ? 'active' : ''}" style="background-image:url('${mediaUrl}')">
          <div class="hero-overlay">
            <p class="badge">${banner.title || ''}</p>
            <h1>${banner.subtitle || ''}</h1>
          </div>
        </div>
      `;
      }
    )
    .join('');
  sliderState.slides = Array.from(sliderEl.querySelectorAll('.hero-slide'));
  sliderState.index = 0;
  
  // Clear any existing interval
  if (sliderState.interval) {
    clearInterval(sliderState.interval);
    sliderState.interval = null;
  }
  
  // Only auto-rotate if there are multiple banners (2 or more)
  if (banners.length > 1) {
    sliderState.interval = setInterval(rotateSlider, 5000);
  }
};

const renderProducts = (items, container) => {
  if (!container) return;
  if (!items.length) {
    container.innerHTML = '<p>No products yet.</p>';
    return;
  }
  container.innerHTML = items.map((item) => createProductCard(item)).join('');
  initCarousels();
};

const loadBanners = async () => {
  try {
    const banners = await api.request('/banners/');
    renderBanners(banners || []);
  } catch (err) {
    console.error('Error loading banners:', err);
  }
};

const bootstrapHome = async () => {
  try {
    const [banners, men, women] = await Promise.all([
      api.request('/banners/'),
      api.request('/products/?gender=MEN&expand_by_color=false'),
      api.request('/products/?gender=WOMEN&expand_by_color=false'),
    ]);
    renderBanners(banners || []);
    renderProducts(men || [], menWrapper);
    renderProducts(women || [], womenWrapper);
    
    // Start polling for banner updates every 5 seconds for instant updates
    if (bannerPollInterval) clearInterval(bannerPollInterval);
    bannerPollInterval = setInterval(loadBanners, 5000);
  } catch (err) {
    console.error(err);
  }
};

// Clean up interval when page is hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (bannerPollInterval) {
      clearInterval(bannerPollInterval);
      bannerPollInterval = null;
    }
  } else {
    // Resume polling when page becomes visible
    if (!bannerPollInterval) {
      loadBanners(); // Load immediately
      bannerPollInterval = setInterval(loadBanners, 5000);
    }
  }
});

document.body.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action="view"]');
  if (button) {
    const id = button.dataset.product;
    // Navigate to product detail page (color selection happens on detail page)
    window.location.href = `product_detail.html?id=${id}`;
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  await mountNavbar();
  await mountFooter();
  bootstrapHome();
});

