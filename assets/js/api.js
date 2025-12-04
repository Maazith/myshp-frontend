const API_BASE = 'http://127.0.0.1:8000/api';
const ACCESS_KEY = 'edithcloths_token';
const REFRESH_KEY = 'edithcloths_refresh';

const buildHeaders = (options = {}) => {
  const headers = { ...options };
  if (!headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem(ACCESS_KEY);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  baseUrl: API_BASE,
  get accessToken() {
    return localStorage.getItem(ACCESS_KEY);
  },
  currentUser() {
    const user = localStorage.getItem('edithcloths_user');
    return user ? JSON.parse(user) : null;
  },
  logout() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem('edithcloths_user');
  },
  async request(path, { method = 'GET', body, isForm = false } = {}) {
    const options = { method, headers: buildHeaders() };
    if (isForm) {
      options.headers = buildHeaders({});
      delete options.headers['Content-Type'];
      options.body = body;
    } else if (body) {
      options.body = JSON.stringify(body);
    }
    const response = await fetch(`${API_BASE}${path}`, options);
    if (response.status === 204) return null;
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.detail || data.message || 'Something went wrong');
    }
    return data;
  },
  async login({ username, password }) {
    const payload = await this.request('/auth/login', {
      method: 'POST',
      body: { username, password },
    });
    localStorage.setItem(ACCESS_KEY, payload.access);
    localStorage.setItem(REFRESH_KEY, payload.refresh);
    localStorage.setItem('edithcloths_user', JSON.stringify(payload.user));
    return payload;
  },
};
// API Base URL - Replace with your backend URL
// For local development, use: http://127.0.0.1:8000
const API_BASE = "http://127.0.0.1:8000"; // Change this to your Django backend URL
const API_BASE = 'http://127.0.0.1:8000/api';
const ACCESS_KEY = 'edithcloths_token';
const REFRESH_KEY = 'edithcloths_refresh';

const buildHeaders = (extra = {}) => {
  const headers = { ...extra };
  if (!(headers instanceof Headers)) {
    if (!headers['Content-Type'] && !(extra instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
  }
  const token = localStorage.getItem(ACCESS_KEY);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  baseUrl: API_BASE,
  get accessToken() {
    return localStorage.getItem(ACCESS_KEY);
  },
  async request(path, { method = 'GET', body, isForm = false } = {}) {
    const options = { method, headers: buildHeaders({}) };
    if (isForm) {
      delete options.headers['Content-Type'];
      options.body = body;
    } else if (body) {
      options.body = JSON.stringify(body);
    }
    const res = await fetch(`${API_BASE}${path}`, options);
    if (res.status === 204) return null;
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail || 'Something went wrong');
    }
    return data;
  },
  async login({ username, password }) {
    const payload = await this.request('/auth/login', {
      method: 'POST',
      body: { username, password },
    });
    localStorage.setItem(ACCESS_KEY, payload.access);
    localStorage.setItem(REFRESH_KEY, payload.refresh);
    localStorage.setItem('edithcloths_user', JSON.stringify(payload.user));
    return payload;
  },
  logout() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem('edithcloths_user');
  },
  currentUser() {
    const user = localStorage.getItem('edithcloths_user');
    return user ? JSON.parse(user) : null;
  },
};
// Get auth token from localStorage
function getAuthToken() {
    return localStorage.getItem("access");
}

// Get refresh token from localStorage
function getRefreshToken() {
    return localStorage.getItem("refresh");
}

// Get headers with auth token
function getHeaders(includeAuth = true, contentType = 'application/json') {
    const headers = {
        'Content-Type': contentType
    };
    
    if (includeAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    
    return headers;
}

// GET request
async function get(endpoint, includeAuth = true) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'GET',
            headers: getHeaders(includeAuth)
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                // Token expired, try to refresh
                const refreshed = await refreshToken();
                if (refreshed) {
                    return get(endpoint, includeAuth);
                } else {
                    // Redirect to login
                    window.location.href = '/login.html';
                    throw new Error('Unauthorized');
                }
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('GET request failed:', error);
        throw error;
    }
}

// POST request
async function post(endpoint, data, includeAuth = true, contentType = 'application/json') {
    try {
        const body = contentType === 'application/json' ? JSON.stringify(data) : data;
        
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(includeAuth, contentType),
            body: body
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                const refreshed = await refreshToken();
                if (refreshed) {
                    return post(endpoint, data, includeAuth, contentType);
                } else {
                    window.location.href = '/login.html';
                    throw new Error('Unauthorized');
                }
            }
            const errorData = await response.json().catch(() => ({ detail: `HTTP error! status: ${response.status}` }));
            throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('POST request failed:', error);
        throw error;
    }
}

// PATCH request
async function patch(endpoint, data, includeAuth = true) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'PATCH',
            headers: getHeaders(includeAuth),
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                const refreshed = await refreshToken();
                if (refreshed) {
                    return patch(endpoint, data, includeAuth);
                } else {
                    window.location.href = '/login.html';
                    throw new Error('Unauthorized');
                }
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('PATCH request failed:', error);
        throw error;
    }
}

// DELETE request
async function destroy(endpoint, includeAuth = true) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders(includeAuth)
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                const refreshed = await refreshToken();
                if (refreshed) {
                    return destroy(endpoint, includeAuth);
                } else {
                    window.location.href = '/login.html';
                    throw new Error('Unauthorized');
                }
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Some DELETE endpoints might not return JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }
        return { success: true };
    } catch (error) {
        console.error('DELETE request failed:', error);
        throw error;
    }
}

// Refresh token
async function refreshToken() {
    const refresh = getRefreshToken();
    if (!refresh) {
        return false;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/auth/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refresh: refresh })
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("access", data.access);
            return true;
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
    }
    
    // Clear tokens if refresh fails
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    return false;
}

// Export functions
window.api = {
    get,
    post,
    patch,
    destroy,
    getAuthToken,
    getRefreshToken
};

// Make API_BASE available globally
window.API_BASE = API_BASE;

