import { adminApi } from './admin-api.js';
import { adminAuth } from './admin-auth.js';
import { mountAdminNavbar } from './admin-navbar.js';

// Page-specific check - only run on categories page
const isCategoriesPage = () => {
  const path = window.location.pathname;
  return path.includes('categories.html');
};

if (!isCategoriesPage()) {
  console.warn('[Admin Categories] This script should only run on categories page');
} else {
  if (!adminAuth.requireAuth()) {
    // Redirect handled
  } else {
    mountAdminNavbar();

    const loadCategories = async () => {
  try {
    console.log('[Admin Categories] Loading categories...');
    const categories = await adminApi.request('/categories/');
    const container = document.getElementById('categories-list');
    
    if (!container) {
      console.error('[Admin Categories] Container not found');
      return;
    }
    
    console.log('[Admin Categories] Categories fetched:', categories?.length || 0);
    
    if (!categories || categories.length === 0) {
      container.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:2rem;">No categories found.</p>';
      return;
    }
    
    container.innerHTML = categories.map(category => `
      <div class="cart-item">
        <div class="cart-item-info">
          <h3>${category.name || 'Untitled'}</h3>
          <p>${category.description || 'No description'}</p>
          <p style="font-size:0.75rem;color:var(--text-light);">Slug: ${category.slug || 'N/A'}</p>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.5rem;align-items:flex-end;">
          <div style="display:flex;gap:0.5rem;">
            <button class="btn small" onclick="editCategory(${category.id}, '${category.name}', '${(category.description || '').replace(/'/g, "\\'")}')">Edit</button>
            <button class="btn small ghost" onclick="deleteCategory(${category.id}, '${category.name}')">Delete</button>
          </div>
        </div>
      </div>
    `).join('');
    
  } catch (err) {
    console.error('[Admin Categories] Error loading categories:', {
      error: err,
      message: err.message,
      stack: err.stack,
      apiBaseUrl: adminApi.baseUrl,
      hasToken: !!adminApi.accessToken
    });
    const container = document.getElementById('categories-list');
    if (container) {
      container.innerHTML = `<div class="form-card" style="background:var(--danger);color:#fff;padding:1.5rem;">
        <h3>Error Loading Categories</h3>
        <p><strong>Error:</strong> ${err.message || 'Unknown error'}</p>
        <p style="font-size:0.85rem;margin-top:0.5rem;">Check browser console for details. API Base URL: ${adminApi.baseUrl}</p>
      </div>`;
    }
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const errorEl = document.getElementById('form-error');
  const categoryId = form.dataset.categoryId;
  
  if (errorEl) errorEl.textContent = '';
  
  try {
    const formData = {
      name: document.getElementById('category-name').value.trim(),
      description: document.getElementById('category-description').value.trim() || '',
    };
    
    if (!formData.name) {
      throw new Error('Category name is required.');
    }
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = categoryId ? 'Updating...' : 'Creating...';
    }
    
    if (categoryId) {
      await adminApi.request(`/categories/${categoryId}/`, {
        method: 'PUT',
        body: formData,
      });
      alert('Category updated successfully!');
    } else {
      await adminApi.request('/categories/add', {
        method: 'POST',
        body: formData,
      });
      alert('Category created successfully!');
    }
    
    form.reset();
    form.dataset.categoryId = '';
    document.getElementById('form-title').textContent = 'Add Category';
    loadCategories();
    
  } catch (err) {
    if (errorEl) {
      errorEl.textContent = err.message || 'Error saving category. Please try again.';
    }
    console.error('[Admin Categories] Error saving category:', err);
    
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = categoryId ? 'Update Category' : 'Create Category';
    }
  }
};

window.editCategory = (id, name, description) => {
  document.getElementById('category-name').value = name;
  document.getElementById('category-description').value = description || '';
  document.getElementById('category-form').dataset.categoryId = id;
  document.getElementById('form-title').textContent = 'Edit Category';
  document.getElementById('category-form').scrollIntoView({ behavior: 'smooth' });
};

window.deleteCategory = async (id, name) => {
  if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
    return;
  }
  
  try {
    await adminApi.request(`/categories/${id}/`, {
      method: 'DELETE',
    });
    alert('Category deleted successfully!');
    loadCategories();
  } catch (err) {
    alert('Error deleting category: ' + (err.message || 'Unknown error'));
    console.error('[Admin Categories] Error deleting category:', err);
  }
};

    document.addEventListener('DOMContentLoaded', () => {
      console.log('[Admin Categories] Initializing categories page');
      loadCategories();
      
      const form = document.getElementById('category-form');
      if (form) {
        form.addEventListener('submit', handleSubmit);
      }
    });
  }
}

