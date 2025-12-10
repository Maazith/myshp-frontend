import { adminAuth } from './admin-auth.js';
import { adminApi } from './admin-api.js';

if (!adminAuth.requireAuth()) return;

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

if (!productId) {
  window.location.href = 'products.html';
}

async function loadProduct() {
  try {
    const product = await adminApi.getProduct(productId);
    if (!product) return;
    
    document.getElementById('title').value = product.title || '';
    document.getElementById('description').value = product.description || '';
    document.getElementById('gender').value = product.gender || 'M';
    document.getElementById('base-price').value = product.base_price || 0;
    document.getElementById('is-active').checked = product.is_active !== false;
    
    // Show current hero image if available
    if (product.hero_media_url) {
      const currentPreview = document.getElementById('current-hero-preview');
      const currentImg = document.getElementById('current-hero-img');
      currentImg.src = product.hero_media_url;
      currentPreview.style.display = 'block';
    }
  } catch (error) {
    console.error('Product load error:', error);
    document.getElementById('form-error').textContent = error.message;
  }
}

// Hero image preview for new upload
const heroMediaInput = document.getElementById('hero-media');
const newHeroPreviewDiv = document.getElementById('new-hero-image-preview');
const newHeroPreviewImg = document.getElementById('new-hero-preview-img');
const removeNewHeroPreviewBtn = document.getElementById('remove-new-hero-preview');

heroMediaInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      newHeroPreviewImg.src = event.target.result;
      newHeroPreviewDiv.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    newHeroPreviewDiv.style.display = 'none';
  }
});

removeNewHeroPreviewBtn.addEventListener('click', () => {
  heroMediaInput.value = '';
  newHeroPreviewDiv.style.display = 'none';
  newHeroPreviewImg.src = '';
});

document.getElementById('product-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById('form-error');
  errorEl.textContent = '';
  
  try {
    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('gender', document.getElementById('gender').value);
    formData.append('base_price', document.getElementById('base-price').value);
    formData.append('is_active', document.getElementById('is-active').checked);
    
    const heroFile = document.getElementById('hero-media').files[0];
    if (heroFile) {
      formData.append('hero_media', heroFile);
    }
    
    await adminApi.updateProduct(productId, formData);
    window.location.href = 'products.html';
  } catch (error) {
    errorEl.textContent = error.message;
  }
});

loadProduct();

