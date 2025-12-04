import { api } from './api.js';
import { formatCurrency } from './components.js';

const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

const state = {
  product: null,
  variants: [],
  selectedSize: null,
  selectedColor: null,
};

const sizeSelect = document.getElementById('size-select');
const colorSelect = document.getElementById('color-select');
const quantityInput = document.getElementById('quantity');
const holder = {
  title: document.getElementById('product-title'),
  description: document.getElementById('product-description'),
  price: document.getElementById('product-price'),
  category: document.getElementById('product-category'),
  media: document.getElementById('product-media'),
  error: document.getElementById('detail-error'),
};

if (!productId) {
  holder.error.textContent = 'Invalid product.';
}

const renderMedia = (product) => {
  holder.media.innerHTML = `
    <img src="${product.hero_media || '../assets/img/placeholder.jpg'}" alt="${product.title}" style="width:100%;border-radius:var(--radius);" />
  `;
};

const uniqueValues = (key) => [...new Set(state.variants.map((variant) => variant[key]))];

const populateSizes = () => {
  const options = uniqueValues('size');
  if (!options.length) {
    sizeSelect.innerHTML = '<option disabled>No sizes</option>';
    colorSelect.innerHTML = '<option disabled>N/A</option>';
    state.selectedSize = null;
    state.selectedColor = null;
    return;
  }
  sizeSelect.innerHTML = options.map((opt) => `<option value="${opt}">${opt}</option>`).join('');
  state.selectedSize = options[0];
};

const populateColors = () => {
  const colors = state.variants
    .filter((variant) => variant.size === state.selectedSize)
    .map((variant) => variant.color);
  const unique = [...new Set(colors)];
  if (!unique.length) {
    colorSelect.innerHTML = '<option disabled>No colors</option>';
    state.selectedColor = null;
    return;
  }
  colorSelect.innerHTML = unique.map((color) => `<option value="${color}">${color}</option>`).join('');
  state.selectedColor = unique[0];
};

const currentVariant = () =>
  state.variants.find(
    (variant) => variant.size === state.selectedSize && variant.color === state.selectedColor,
  );

const updatePrice = () => {
  const variant = currentVariant();
  if (variant) {
    holder.price.textContent = formatCurrency(variant.price);
  }
};

const loadProduct = async () => {
  if (!productId) return;
  try {
    const product = await api.request(`/products/${productId}/`);
    state.product = product;
    state.variants = product.variants || [];
    holder.title.textContent = product.title;
    holder.description.textContent = product.description;
    holder.category.textContent = product.category?.name || 'EdithCloths';
    renderMedia(product);
    populateSizes();
    populateColors();
    updatePrice();
  } catch (err) {
    holder.error.textContent = err.message;
  }
};

sizeSelect?.addEventListener('change', (event) => {
  state.selectedSize = event.target.value;
  populateColors();
  updatePrice();
});

colorSelect?.addEventListener('change', (event) => {
  state.selectedColor = event.target.value;
  updatePrice();
});

document.getElementById('add-to-cart')?.addEventListener('click', async () => {
  if (!api.accessToken) {
    window.location.href = 'login.html';
    return;
  }
  const variant = currentVariant();
  if (!variant) {
    holder.error.textContent = 'Choose a valid variant.';
    return;
  }
  try {
    await api.request('/cart/add', {
      method: 'POST',
      body: {
        variant_id: variant.id,
        quantity: Number(quantityInput.value) || 1,
      },
    });
    holder.error.style.color = 'var(--success)';
    holder.error.textContent = 'Added to cart!';
    setTimeout(() => (window.location.href = 'cart.html'), 600);
  } catch (err) {
    holder.error.style.color = 'var(--danger)';
    holder.error.textContent = err.message;
  }
});

window.addEventListener('DOMContentLoaded', loadProduct);

