// Admin Panel Configuration
// This file sets the API base URL for all admin pages
// Supports Vercel environment variables and production fallback

(function() {
  'use strict';
  
  // Get API base URL with priority:
  // 1. Vercel environment variable (NEXT_PUBLIC_API_URL)
  // 2. Window variable set by HTML script tag
  // 3. Production fallback (Render backend)
  
  const getApiBaseUrl = () => {
    // Check for Vercel environment variable (set in Vercel dashboard)
    if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    
    // Check for window variable (set by HTML script tag)
    if (typeof window !== 'undefined' && window.API_BASE_URL) {
      return window.API_BASE_URL;
    }
    
    // Production fallback - Render backend
    return 'https://myshp-backend.onrender.com/api';
  };
  
  // Set API base URL globally
  if (typeof window !== 'undefined') {
    window.API_BASE_URL = getApiBaseUrl();
    window.BACKEND_BASE_URL = window.API_BASE_URL.replace('/api', '');
    
    // Log for debugging (only in development)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('[Admin Config] API Base URL:', window.API_BASE_URL);
      console.log('[Admin Config] Backend Base URL:', window.BACKEND_BASE_URL);
    }
  }
})();

