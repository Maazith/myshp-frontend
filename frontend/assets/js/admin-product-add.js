import { adminAuth } from './admin-auth.js';
import { adminApi } from './admin-api.js';

if (!adminAuth.requireAuth()) return;


// Hero image preview
const heroMediaInput = document.getElementById('hero-media');
const heroPreviewDiv = document.getElementById('hero-image-preview');
const heroPreviewImg = document.getElementById('hero-preview-img');
const removeHeroPreviewBtn = document.getElementById('remove-hero-preview');

heroMediaInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      heroPreviewImg.src = event.target.result;
      heroPreviewDiv.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    heroPreviewDiv.style.display = 'none';
  }
});

removeHeroPreviewBtn.addEventListener('click', () => {
  heroMediaInput.value = '';
  heroPreviewDiv.style.display = 'none';
  heroPreviewImg.src = '';
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
    
    await adminApi.createProduct(formData);
    
    // Show success message
    errorEl.style.color = 'var(--success, #4CAF50)';
    errorEl.textContent = '✅ Product created successfully! Redirecting...';
    
    // Redirect with success parameter
    setTimeout(() => {
      window.location.href = 'products.html?created=true';
    }, 1500);
  } catch (error) {
    errorEl.style.color = 'var(--danger)';
    errorEl.textContent = error.message;
  }
});

// Initialize on page load

