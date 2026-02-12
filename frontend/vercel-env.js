// Vercel Environment Configuration
// This file is used to inject environment variables into the frontend
// Vercel will replace %NEXT_PUBLIC_API_URL% with the actual value during build (via build command or framework)

(function() {
  'use strict';
  
  // Set API Base URL from Vercel environment variable
  // This allows Vercel to override the API URL via environment variables
  if (typeof window !== 'undefined') {
    // Check for Vercel environment variable (set during build)
    const apiBaseUrl = '%NEXT_PUBLIC_API_URL%';
    
    // Only set if it's not the placeholder (meaning Vercel replaced it)
    if (apiBaseUrl && apiBaseUrl !== '%NEXT_PUBLIC_API_URL%') {
      window.API_BASE_URL = apiBaseUrl;
      window.VERCEL_ENV_API_BASE_URL = apiBaseUrl;
    } else {
      // Production fallback to Railway backend
      window.API_BASE_URL = window.API_BASE_URL || 'https://web-production-d8ef7.up.railway.app/api';
      window.VERCEL_ENV_API_BASE_URL = window.VERCEL_ENV_API_BASE_URL || window.API_BASE_URL;
    }
  }
})();

