import { adminAuth } from './admin-auth.js';
import { adminApi } from './admin-api.js';

if (!adminAuth.requireAuth()) return;

async function loadBanners() {
  try {
    const banners = await adminApi.getBanners();
    if (!banners) return;
    
    if (banners.length === 0) {
      document.getElementById('banners-list').innerHTML = '<p style="padding: 2rem; text-align: center; color: var(--text-light);">No banners found</p>';
      return;
    }
    
    const bannersHtml = banners.map(banner => {
      const imageUrl = banner.image_url || banner.image || '../assets/img/placeholder.jpg';
      return `
        <div style="padding: 1.5rem; border-bottom: 1px solid rgba(230,230,230,0.1); display: grid; grid-template-columns: 200px 1fr auto; gap: 1.5rem; align-items: center;">
          <img src="${imageUrl}" alt="Banner" style="width: 200px; height: 100px; object-fit: cover; border-radius: var(--radius);">
          <div>
            <p style="font-weight: 600; margin-bottom: 0.5rem;">${banner.title || 'No title'}</p>
            <p style="color: var(--text-light); font-size: 0.9rem;">${banner.subtitle || 'No subtitle'}</p>
            ${banner.link ? `<p style="color: var(--text-light); font-size: 0.9rem;">Link: ${banner.link}</p>` : ''}
          </div>
          <button class="btn small ghost" onclick="deleteBanner(${banner.id})">Delete</button>
        </div>
      `;
    }).join('');
    
    document.getElementById('banners-list').innerHTML = bannersHtml;
  } catch (error) {
    console.error('Banners load error:', error);
    document.getElementById('banners-list').innerHTML = `<p style="padding: 2rem; color: var(--danger);">Error: ${error.message}</p>`;
  }
}

window.deleteBanner = async (id) => {
  if (!confirm('Are you sure you want to delete this banner?')) return;
  try {
    await adminApi.deleteBanner(id);
    loadBanners();
  } catch (error) {
    alert('Error deleting banner: ' + error.message);
  }
};

document.getElementById('banner-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById('banner-error');
  errorEl.textContent = '';
  
  try {
    const formData = new FormData();
    formData.append('image', document.getElementById('banner-image').files[0]);
    const title = document.getElementById('banner-title').value;
    const subtitle = document.getElementById('banner-subtitle').value;
    const link = document.getElementById('banner-link').value;
    const order = document.getElementById('banner-order').value;
    
    if (title) formData.append('title', title);
    if (subtitle) formData.append('subtitle', subtitle);
    if (link) formData.append('link', link);
    if (order) formData.append('order', order);
    
    await adminApi.uploadBanner(formData);
    document.getElementById('banner-form').reset();
    loadBanners();
    errorEl.textContent = 'Banner uploaded successfully!';
    errorEl.style.color = 'var(--success)';
    setTimeout(() => errorEl.textContent = '', 3000);
  } catch (error) {
    errorEl.textContent = error.message;
  }
});

loadBanners();

