import { api } from './api.js';
import { createProductCard, initCarousels } from './components.js';

const container = document.getElementById('products-list');
const gender = document.body.dataset.gender;

const fetchProducts = async () => {
  if (!container) return;
  try {
    const query = gender ? `?gender=${gender}` : '';
    const data = await api.request(`/products/${query}`);
    if (!data.length) {
      container.innerHTML = '<p>No products yet.</p>';
      return;
    }
    container.innerHTML = data.map((product) => createProductCard(product)).join('');
    initCarousels();
  } catch (err) {
    container.innerHTML = `<p>Error: ${err.message}</p>`;
  }
};

document.body.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action="view"]');
  if (target) {
    const id = target.dataset.product;
    window.location.href = `product_detail.html?id=${id}`;
  }
});

window.addEventListener('DOMContentLoaded', fetchProducts);
