// Enhanced API client with error handling, retry logic, and validation

import { handleApiError, withRetry, logError } from './errorHandler';

const BASE_URL = import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

const buildHeaders = (extra = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...extra,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json().catch(() => ({})) : null;
  
  if (!response.ok) {
    const error = new Error(data?.message || `Request failed with status ${response.status}`);
    error.response = { status: response.status, data };
    throw error;
  }
  
  return data;
};

const request = async (path, options = {}) => {
  const url = path.startsWith('http') ? path : `${BASE_URL}/${path.replace(/^\//, '')}`;
  
  try {
    const response = await fetch(url, options);
    return await handleResponse(response);
  } catch (error) {
    logError(error, { path, options });
    throw handleApiError(error);
  }
};

export const apiClient = {
  get: (path, { headers, signal } = {}) =>
    withRetry(() => request(path, { method: 'GET', headers: buildHeaders(headers), signal })),

  post: (path, body, { headers, signal } = {}) => {
    const isFormData = body instanceof FormData;
    const requestHeaders = isFormData ? {} : buildHeaders(headers);
    const requestBody = isFormData ? body : JSON.stringify(body);
    
    return withRetry(() => request(path, { 
      method: 'POST', 
      headers: requestHeaders, 
      body: requestBody, 
      signal 
    }));
  },

  put: (path, body, { headers, signal } = {}) => {
    const isFormData = body instanceof FormData;
    const requestHeaders = isFormData ? {} : buildHeaders(headers);
    const requestBody = isFormData ? body : JSON.stringify(body);
    
    return withRetry(() => request(path, { 
      method: 'PUT', 
      headers: requestHeaders, 
      body: requestBody, 
      signal 
    }));
  },

  patch: (path, body, { headers, signal } = {}) => {
    const isFormData = body instanceof FormData;
    const requestHeaders = isFormData ? {} : buildHeaders(headers);
    const requestBody = isFormData ? body : JSON.stringify(body);
    
    return withRetry(() => request(path, { 
      method: 'PATCH', 
      headers: requestHeaders, 
      body: requestBody, 
      signal 
    }));
  },

  delete: (path, { headers, signal } = {}) =>
    withRetry(() => request(path, { method: 'DELETE', headers: buildHeaders(headers), signal })),

  // Upload file with progress tracking
  uploadFile: (path, file, onProgress = null) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (e) {
            resolve(xhr.responseText);
          }
        } else {
          reject(handleApiError(new Error(`Upload failed: ${xhr.statusText}`)));
        }
      });

      xhr.addEventListener('error', () => {
        reject(handleApiError(new Error('Upload failed')));
      });

      const token = localStorage.getItem('token');
      const url = path.startsWith('http') ? path : `${BASE_URL}/${path.replace(/^\//, '')}`;
      xhr.open('POST', url);
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.send(formData);
    });
  },

  // Set authentication token
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },

  // Get authentication token
  getToken: () => localStorage.getItem('token'),

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
};

export const withApiBase = (possiblyRelativeUrl) => {
  const origin = (import.meta?.env?.VITE_API_ORIGIN) || 'http://localhost:5000';
  if (!possiblyRelativeUrl) return possiblyRelativeUrl;
  if (typeof possiblyRelativeUrl !== 'string') return possiblyRelativeUrl;

  // Normalize legacy/bad paths from older backend responses
  let url = possiblyRelativeUrl.trim();

  // Fix: some older auction image paths were saved like "/api/auctions//uploads/auctions/..."
  url = url.replace(/^\/api\/auctions\/{1,}uploads\//, '/api/auctions/uploads/');

  // Fix: if auction image paths were accidentally prefixed with "/api/auctions/" before "/uploads/"
  // e.g., "/api/auctions//uploads/auctions/<file>" → "/api/auctions/uploads/auctions/<file>"
  url = url.replace(/^\/api\/auctions\/{1,}\/?uploads\//, '/api/auctions/uploads/');

  // Collapse duplicate slashes but keep protocol intact later
  url = url.replace(/\/{2,}/g, '/');

  // If already absolute, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  return `${origin}${url}`;
};

export default apiClient;


