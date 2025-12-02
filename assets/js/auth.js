import { api } from './api.js';

const setError = (selector, message) => {
  const el = document.querySelector(selector);
  if (el) el.textContent = message || '';
};

const handleLogin = () => {
  const form = document.getElementById('login-form');
  if (!form) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setError('#login-error', '');
    const payload = {
      username: form.username.value.trim(),
      password: form.password.value.trim(),
    };
    try {
      await api.login(payload);
      window.location.href = 'index.html';
    } catch (err) {
      setError('#login-error', err.message);
    }
  });
};

const handleRegister = () => {
  const form = document.getElementById('register-form');
  if (!form) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setError('#register-error', '');
    const payload = {
      username: form.username.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value.trim(),
    };
    try {
      await api.request('/auth/register', { method: 'POST', body: payload });
      await api.login({ username: payload.username, password: payload.password });
      window.location.href = 'index.html';
    } catch (err) {
      setError('#register-error', err.message);
    }
  });
};

const authPage = document.body.dataset.auth;
if (authPage === 'login') handleLogin();
if (authPage === 'register') handleRegister();
