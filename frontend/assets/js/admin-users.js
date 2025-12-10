import { adminAuth } from './admin-auth.js';
import { adminApi } from './admin-api.js';

if (!adminAuth.requireAuth()) return;

async function loadUsers() {
  try {
    const users = await adminApi.getUsers();
    if (!users) return;
    
    if (users.length === 0) {
      document.getElementById('users-list').innerHTML = '<p style="padding: 2rem; text-align: center; color: var(--text-light);">No users found</p>';
      return;
    }
    
    const usersHtml = users.map(user => {
      const joinDate = new Date(user.date_joined || user.id).toLocaleDateString();
      const isStaff = user.is_staff ? '<span style="color: var(--success); font-size: 0.85rem; margin-left: 0.5rem;">(Admin)</span>' : '';
      return `
        <div style="padding: 1.5rem; border-bottom: 1px solid rgba(230,230,230,0.1);">
          <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 1rem;">
            <div style="flex: 1; min-width: 200px;">
              <p style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem;">
                ${user.username}${isStaff}
              </p>
              <p style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 0.25rem;">${user.email || 'No email'}</p>
              <p style="color: var(--text-light); font-size: 0.85rem;">Joined: ${joinDate}</p>
              ${user.first_name || user.last_name ? `
              <p style="color: var(--text-light); font-size: 0.85rem; margin-top: 0.25rem;">
                ${user.first_name || ''} ${user.last_name || ''}
              </p>
              ` : ''}
            </div>
            <div style="text-align: right;">
              <p style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 0.5rem;">User ID: ${user.id}</p>
              <p style="color: ${user.is_staff ? 'var(--success)' : 'var(--text-light)'}; font-size: 0.9rem;">
                ${user.is_staff ? 'Admin User' : 'Regular User'}
              </p>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    document.getElementById('users-list').innerHTML = `
      <div style="margin-bottom: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: var(--radius);">
        <p style="color: var(--text-light); font-size: 0.9rem;">
          Total Users: <strong style="color: var(--white);">${users.length}</strong>
        </p>
      </div>
      ${usersHtml}
    `;
  } catch (error) {
    console.error('Users load error:', error);
    document.getElementById('users-list').innerHTML = `<p style="padding: 2rem; color: var(--danger);">Error loading users: ${error.message}</p>`;
  }
}

loadUsers();

