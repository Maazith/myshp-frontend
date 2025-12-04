import { api } from './api.js';

const setError = (selector, message) => {
  const el = document.querySelector(selector);
  if (el) {
    el.textContent = message || '';
    el.style.display = message ? 'block' : 'none';
    if (message) {
      el.className = 'error-message';
    }
  }
};

const setSuccess = (selector, message) => {
  const el = document.querySelector(selector);
  if (el) {
    el.textContent = message || '';
    el.style.display = message ? 'block' : 'none';
    if (message) {
      el.className = 'success-message';
    }
  }
};

const clearMessages = () => {
  setError('#login-error', '');
  setError('#register-error', '');
  setSuccess('#login-success', '');
  setSuccess('#register-success', '');
};

const handleLogin = () => {
  const form = document.getElementById('login-form');
  if (!form) return;
  
  // Check for success message from registration
  const urlParams = new URLSearchParams(window.location.search);
  const registered = urlParams.get('registered');
  if (registered === 'true') {
    setSuccess('#login-success', 'Registration successful! Please login with your credentials.');
    // Remove query parameter from URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
  
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearMessages();
    
    const payload = {
      username: form.username.value.trim(),
      password: form.password.value.trim(),
    };
    
    // Validate inputs
    if (!payload.username || !payload.password) {
      setError('#login-error', 'Please enter both username and password.');
      return;
    }
    
    try {
      await api.login(payload);
      window.location.href = 'index.html';
    } catch (err) {
      // Check for specific error types
      let errorMessage = err.message || 'Login failed. Please try again.';
      
      // Check if user doesn't exist (401 or 404)
      if (err.message && (
        err.message.includes('401') || 
        err.message.includes('404') ||
        err.message.includes('No active account') ||
        err.message.includes('Invalid credentials') ||
        err.message.includes('Unable to log in')
      )) {
        errorMessage = 'Account not found. Please register first before logging in.';
      }
      
      setError('#login-error', errorMessage);
      console.error('Login error:', err);
    }
  });
};

const handleRegister = () => {
  const form = document.getElementById('register-form');
  if (!form) return;
  
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearMessages();
    
    const payload = {
      username: form.username.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value.trim(),
    };
    
    // Validate inputs
    if (!payload.username || !payload.email || !payload.password) {
      setError('#register-error', 'Please fill in all fields.');
      return;
    }
    
    if (payload.password.length < 6) {
      setError('#register-error', 'Password must be at least 6 characters long.');
      return;
    }
    
    try {
      // Register user
      await api.request('/auth/register', { method: 'POST', body: payload });
      
      // Show success message
      setSuccess('#register-success', 'Registration successful! Redirecting to login...');
      
      // Auto-login after registration
      try {
        await api.login({ username: payload.username, password: payload.password });
        // Redirect to home page
        window.location.href = 'index.html';
      } catch (loginErr) {
        // If auto-login fails, redirect to login page with success message
        setSuccess('#register-success', 'Registration successful! Please login with your credentials.');
        setTimeout(() => {
          window.location.href = 'login.html?registered=true';
        }, 2000);
      }
    } catch (err) {
      // Display error message - handle multiline errors from validation
      let errorText = err.message || 'Registration failed. Please try again.';
      
      // Format common error messages
      if (errorText.includes('username')) {
        errorText = 'Username already exists. Please choose a different username.';
      } else if (errorText.includes('email')) {
        errorText = 'Email already registered. Please use a different email or login.';
      }
      
      setError('#register-error', errorText);
      console.error('Registration error:', err);
    }
  });
};

const authPage = document.body.dataset.auth;
if (authPage === 'login') handleLogin();
if (authPage === 'register') handleRegister();
