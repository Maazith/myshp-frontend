// Central Backend Configuration
// This file provides a single source of truth for backend connection settings

// Backend API Configuration
export const BACKEND_CONFIG = {
  // Production backend URL (Render deployment)
  PRODUCTION_URL: 'https://api.edithcloths.com/api',
  
  // Local development URL (for testing)
  LOCAL_URL: 'http://127.0.0.1:8000/api',
  
  // Determine which URL to use
  get API_BASE_URL() {
    // Check for environment variable (Vercel/deployment)
    if (typeof window !== 'undefined' && window.API_BASE_URL) {
      return window.API_BASE_URL;
    }
    
    // Check for Vercel environment variable
    if (typeof window !== 'undefined' && window.VERCEL_ENV_API_BASE_URL) {
      return window.VERCEL_ENV_API_BASE_URL;
    }
    
    // Check if running locally (localhost or 127.0.0.1)
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') {
        return this.LOCAL_URL;
      }
    }
    
    // Production fallback
    return this.PRODUCTION_URL;
  },
  
  // Get backend base URL (without /api)
  get BACKEND_BASE_URL() {
    return this.API_BASE_URL.replace('/api', '');
  },
  
  // Media URL (for images, files)
  get MEDIA_URL() {
    return `${this.BACKEND_BASE_URL}/media`;
  },
  
  // Static files URL
  get STATIC_URL() {
    return `${this.BACKEND_BASE_URL}/static`;
  },
  
  // Admin panel URL
  get ADMIN_URL() {
    return `${this.BACKEND_BASE_URL}/admin`;
  }
};

// Export API base URL for easy access
export const API_BASE_URL = BACKEND_CONFIG.API_BASE_URL;

// Log configuration (helpful for debugging)
if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
  console.log('🔗 Backend Configuration:', {
    apiBaseUrl: BACKEND_CONFIG.API_BASE_URL,
    backendBaseUrl: BACKEND_CONFIG.BACKEND_BASE_URL,
    mediaUrl: BACKEND_CONFIG.MEDIA_URL,
    isLocal: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  });
}

