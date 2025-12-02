import { api } from './api.js';
import { createProductCard, initCarousels } from './components.js';

const sliderEl = document.getElementById('banner-slider');
const menWrapper = document.getElementById('men-carousel');
const womenWrapper = document.getElementById('women-carousel');

const sliderState = {
  index: 0,
  slides: [],
};

const rotateSlider = () => {
  if (!sliderState.slides.length) return;
  sliderState.index = (sliderState.index + 1) % sliderState.slides.length;
  sliderState.slides.forEach((slide, idx) => slide.classList.toggle('active', idx === sliderState.index));
};

const renderBanners = (banners) => {
  if (!sliderEl || !banners.length) return;
  sliderEl.innerHTML = banners
    .map(
      (banner, idx) => `
        <div class="hero-slide ${idx === 0 ? 'active' : ''}" style="background-image:url('${banner.media || ''}')">
          <div class="hero-overlay">
            <p class="badge">${banner.title}</p>
            <h1>${banner.subtitle || ''}</h1>
            <div style="margin-top:1.5rem;display:flex;gap:1rem;flex-wrap:wrap">
              ${banner.cta_link ? `<a class="btn" href="${banner.cta_link}">${banner.cta_text || 'Explore'}</a>` : ''}
            </div>
          </div>
        </div>
      `,
    )
    .join('');
  sliderState.slides = Array.from(sliderEl.querySelectorAll('.hero-slide'));
  sliderState.index = 0;
  if (sliderState.interval) clearInterval(sliderState.interval);
  sliderState.interval = setInterval(rotateSlider, 5000);
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

const bootstrapHome = async () => {
  try {
    const [banners, men, women] = await Promise.all([
      api.request('/banners/'),
      api.request('/products/?gender=MEN'),
      api.request('/products/?gender=WOMEN'),
    ]);
    renderBanners(banners || []);
    renderProducts(men || [], menWrapper);
    renderProducts(women || [], womenWrapper);
  } catch (err) {
    console.error(err);
  }
};

document.body.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action="view"]');
  if (button) {
    const id = button.dataset.product;
    window.location.href = `product_detail.html?id=${id}`;
  }
});

window.addEventListener('DOMContentLoaded', bootstrapHome);

