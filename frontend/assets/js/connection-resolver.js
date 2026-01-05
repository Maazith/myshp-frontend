// Automatic Backend Connection Resolver
// Tries to automatically detect and connect to the backend
// Provides helpful error messages and solutions

export class ConnectionResolver {
  constructor() {
    this.possibleUrls = [
      'https://myshp-backend-1.onrender.com/api', // Render backend (primary)
      'https://api.edithcloths.com/api', // Custom domain (if configured)
      'http://127.0.0.1:8000/api', // Local development
      'http://localhost:8000/api', // Local development
    ];
    this.currentUrl = null;
    this.workingUrl = null;
  }

  // Try to find a working backend URL
  async findWorkingBackend() {
    // Check if we already know a working URL
    const savedUrl = localStorage.getItem('working_backend_url');
    if (savedUrl) {
      if (await this.testConnection(savedUrl)) {
        this.workingUrl = savedUrl;
        return savedUrl;
      }
    }

    // Get current configured URL - prefer Render backend
    const currentUrl = window.API_BASE_URL || 'https://myshp-backend-1.onrender.com/api';
    
    // Try current URL first
    if (await this.testConnection(currentUrl)) {
      this.workingUrl = currentUrl;
      localStorage.setItem('working_backend_url', currentUrl);
      return currentUrl;
    }

    // Try all possible URLs
    for (const url of this.possibleUrls) {
      if (await this.testConnection(url)) {
        this.workingUrl = url;
        localStorage.setItem('working_backend_url', url);
        // Update the API base URL
        window.API_BASE_URL = url;
        return url;
      }
      // Small delay between attempts
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return null;
  }

  // Test if a backend URL is accessible
  async testConnection(url, timeout = 5000) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(`${url}/`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  // Get helpful error message with solutions
  getErrorMessage(url) {
    const hostname = new URL(url).hostname;
    
    if (hostname.includes('onrender.com')) {
      return {
        title: 'Backend Not Deployed or Sleeping',
        message: `The backend at ${url} is not accessible.`,
        solutions: [
          {
            title: '1. Check if Backend is Deployed',
            steps: [
              'Go to Render Dashboard: https://dashboard.render.com',
              'Look for service: myshp-backend-1',
              'Check service status (should be "Live")',
            ]
          },
          {
            title: '2. Deploy Backend (if not deployed)',
            steps: [
              'Go to Render Dashboard → "New +" → "Blueprint"',
              'Select your GitHub repository',
              'Render will use backend/render.yaml',
              'Wait 10 minutes for deployment',
            ]
          },
          {
            title: '3. Wake Up Service (if sleeping)',
            steps: [
              'Go to Render Dashboard → myshp-backend-1 service',
              'Click "Manual Deploy" → "Deploy latest commit"',
              'Wait 1-2 minutes for service to wake up',
            ]
          },
          {
            title: '4. Use Local Backend (for testing)',
            steps: [
              'Start local backend: cd backend && python manage.py runserver',
              'Backend will run at: http://127.0.0.1:8000',
              'Connection will automatically use local backend',
            ]
          },
          {
            title: '5. Check Service Name',
            steps: [
              'Verify service name in Render Dashboard',
              'If different from "myshp-backend", update frontend URL',
              'Or rename service in Render to match',
            ]
          }
        ]
      };
    } else if (hostname === '127.0.0.1' || hostname === 'localhost') {
      return {
        title: 'Local Backend Not Running',
        message: `Cannot connect to local backend at ${url}.`,
        solutions: [
          {
            title: 'Start Local Backend',
            steps: [
              'Open terminal in backend directory',
              'Run: python manage.py runserver',
              'Backend should start on port 8000',
              'Refresh this page',
            ]
          },
          {
            title: 'Check Backend is Running',
            steps: [
              'Open: http://127.0.0.1:8000/api/ in browser',
              'Should show JSON response',
              'If error, check backend logs',
            ]
          }
        ]
      };
    }

    return {
      title: 'Connection Failed',
      message: `Cannot connect to backend at ${url}.`,
      solutions: [
        {
          title: 'Check Backend Status',
          steps: [
            'Verify backend is running',
            'Check network connection',
            'Review browser console for errors',
          ]
        }
      ]
    };
  }

  // Auto-resolve connection and update API URL
  async autoResolve() {
    console.log('🔍 Auto-resolving backend connection...');
    
    const workingUrl = await this.findWorkingBackend();
    
    if (workingUrl) {
      console.log('✅ Found working backend:', workingUrl);
      window.API_BASE_URL = workingUrl;
      window.BACKEND_BASE_URL = workingUrl.replace('/api', '');
      return {
        success: true,
        url: workingUrl,
        message: `Connected to backend at ${workingUrl}`
      };
    } else {
      console.error('❌ No working backend found');
      const currentUrl = window.API_BASE_URL || 'https://myshp-backend-1.onrender.com/api';
      const errorInfo = this.getErrorMessage(currentUrl);
      return {
        success: false,
        url: currentUrl,
        error: errorInfo,
        message: 'Backend connection failed. See solutions below.'
      };
    }
  }
}

// Auto-resolve on import (if in browser)
if (typeof window !== 'undefined') {
  window.ConnectionResolver = ConnectionResolver;
}

