// Shared API Configuration Script
// Include this script in all HTML pages BEFORE loading other scripts
// Sets up the backend API URL automatically

(function() {
  'use strict';
  
  // Production backend URL
  const PRODUCTION_API_URL = 'https://api.edithcloths.com/api';
  
  // Local development URL
  const LOCAL_API_URL = 'http://127.0.0.1:8000/api';
  
  // Function to determine which URL to use
  function getApiBaseUrl() {
    // 1. Check if already set (from environment or other script)
    if (window.API_BASE_URL) {
      return window.API_BASE_URL;
    }
    
    // 2. Check for Vercel environment variable
    if (window.VERCEL_ENV_API_BASE_URL) {
      return window.VERCEL_ENV_API_BASE_URL;
    }
    
    // 3. Check if running locally
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') {
      return LOCAL_API_URL;
    }
    
    // 4. Production fallback
    return PRODUCTION_API_URL;
  }
  
  // Set the API base URL
  window.API_BASE_URL = getApiBaseUrl();
  
  // Also set backend base URL (without /api) for media/static files
  window.BACKEND_BASE_URL = window.API_BASE_URL.replace('/api', '');
  
  // Log for debugging (only in non-production)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔗 Backend API URL:', window.API_BASE_URL);
    console.log('🔗 Backend Base URL:', window.BACKEND_BASE_URL);
  }
})();

