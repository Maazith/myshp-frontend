// Automatic Backend Connection Resolver
// Tries to automatically detect and connect to the backend
// Provides helpful error messages and solutions

export class ConnectionResolver {
  constructor() {
    this.possibleUrls = [
      'https://web-production-d8ef7.up.railway.app/api', // Railway backend (primary)
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

    // Get current configured URL - prefer Railway backend
    const currentUrl = window.API_BASE_URL || 'https://web-production-d8ef7.up.railway.app/api';
    
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
    
    if (hostname.includes('up.railway.app')) {
      return {
        title: 'Backend Not Deployed or Sleeping',
        message: `The backend at ${url} is not accessible.`,
        solutions: [
          {
            title: '1. Check if Backend is Deployed',
            steps: [
              'Go to Railway Dashboard',
              'Look for your backend service',
              'Check service status (should be "Live")',
            ]
          },
          {
            title: '2. Deploy Backend (if not deployed)',
            steps: [
              'Deploy your Django backend on Railway from the GitHub repo',
              'Wait a few minutes for deployment to complete',
            ]
          },
          {
            title: '3. Restart Service (if needed)',
            steps: [
              'Open your backend service in Railway',
              'Trigger a redeploy / restart',
              'Wait 1–2 minutes and try again',
            ]
          },
          {
            title: '4. Use Local Backend (for testing)',
            steps: [
              'Start local backend: cd backend && python manage.py runserver',
              'Backend will run at: http://127.0.0.1:8000',
              'Connection will automatically try local backend',
            ]
          },
          {
            title: '5. Check Service URL',
            steps: [
              'Verify the exact Railway URL in the dashboard',
              'If different from the one in the frontend, update the API URL configuration',
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
        const currentUrl = window.API_BASE_URL || 'https://web-production-d8ef7.up.railway.app/api';
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

