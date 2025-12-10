import { adminApi } from './admin-api.js';
import { adminAuth } from './admin-auth.js';
import { mountAdminNavbar } from './admin-navbar.js';

if (!adminAuth.requireAuth()) {
  // Redirect handled
}

mountAdminNavbar();

const loadBanners = async () => {
  try {
    const banners = await adminApi.getBanners();
    const container = document.getElementById('banners-list');
    
    if (!container) return;
    
    if (banners.length === 0) {
      container.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:2rem;">No banners found.</p>';
      return;
    }
    
    // Sort by display_order
    const sortedBanners = banners.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    
    container.innerHTML = sortedBanners.map(banner => `
      <div class="cart-item">
        ${banner.media_url ? `
          <img src="${banner.media_url}" alt="${banner.title}" style="width:120px;height:80px;object-fit:cover;border-radius:var(--radius);" />
        ` : '<div style="width:120px;height:80px;background:rgba(255,255,255,0.1);border-radius:var(--radius);"></div>'}
        <div class="cart-item-info">
          <h3>${banner.title || 'Untitled'}</h3>
          <p>${banner.subtitle || ''}</p>
          <p>Order: ${banner.display_order || 0}</p>
          ${banner.link ? `<p><a href="${banner.link}" target="_blank">${banner.link}</a></p>` : ''}
        </div>
        <div style="display:flex;flex-direction:column;gap:0.5rem;align-items:flex-end;">
          <span class="badge">${banner.is_active ? 'Active' : 'Inactive'}</span>
          <button class="btn small ghost" onclick="deleteBanner(${banner.id}, '${banner.title || 'Banner'}')">Delete</button>
        </div>
      </div>
    `).join('');
    
  } catch (err) {
    console.error('Error loading banners:', err);
    const container = document.getElementById('banners-list');
    if (container) {
      container.innerHTML = '<p style="color:var(--danger);">Error loading banners. Please try again.</p>';
    }
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const errorEl = document.getElementById('form-error');
  
  if (errorEl) errorEl.textContent = '';
  
  try {
    const formData = {
      title: document.getElementById('title').value.trim(),
      subtitle: document.getElementById('subtitle').value.trim(),
      button_text: document.getElementById('button_text').value.trim() || null,
      link: document.getElementById('link').value.trim() || null,
      display_order: parseInt(document.getElementById('display_order').value) || 0,
      is_active: document.getElementById('is_active').checked,
      media: document.getElementById('media').files[0] || null,
    };
    
    if (!formData.media) {
      throw new Error('Please upload a banner image.');
    }
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Uploading...';
    }
    
    await adminApi.createBanner(formData);
    
    alert('Banner uploaded successfully!');
    form.reset();
    loadBanners();
    
  } catch (err) {
    if (errorEl) {
      errorEl.textContent = err.message || 'Error uploading banner. Please try again.';
    }
    console.error('Error uploading banner:', err);
    
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Upload Banner';
    }
  }
};

window.deleteBanner = async (id, name) => {
  if (!confirm(`Are you sure you want to delete "${name}"?`)) {
    return;
  }
  
  try {
    await adminApi.deleteBanner(id);
    alert('Banner deleted successfully!');
    loadBanners();
  } catch (err) {
    alert('Error deleting banner: ' + (err.message || 'Unknown error'));
  }
};

document.addEventListener('DOMContentLoaded', () => {
  loadBanners();
  
  const form = document.getElementById('banner-form');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
});
