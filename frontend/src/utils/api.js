// src/utils/api.js
// API Configuration & Service Layer

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token Management
export const tokenManager = {
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },
  
  getToken: () => localStorage.getItem('token'),
  
  clearToken: () => localStorage.removeItem('token')
};

// Base Request Handler
const request = async (url, options = {}) => {
  const token = tokenManager.getToken();
  
  const config = {
    ...options,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  try {
    const response = await fetch(`${API_URL}${url}`, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }
    
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (email, password) => 
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  
  register: (name, email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    })
};

// Transactions API
export const transactionsAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return request(`/transactions?${params}`);
  },
  
  getById: (id) => request(`/transactions/${id}`),
  
  create: async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    
    const token = tokenManager.getToken();
    const response = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create transaction');
    }
    
    return response.json();
  },
  
  delete: (id) => request(`/transactions/${id}`, { method: 'DELETE' })
};

// Categories API
export const categoriesAPI = {
  getAll: () => request('/categories'),
  create: (data) => request('/categories', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  delete: (id) => request(`/categories/${id}`, { method: 'DELETE' })
};

// Accounts API
export const accountsAPI = {
  getAll: () => request('/accounts'),
  create: (data) => request('/accounts', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => request(`/accounts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => request(`/accounts/${id}`, { method: 'DELETE' })
};

// Analytics API
export const analyticsAPI = {
  getSummary: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return request(`/analytics/summary?${params}`);
  },
  
  getByCategory: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return request(`/analytics/by-category?${params}`);
  },
  
  getTrend: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return request(`/analytics/trend?${params}`);
  }
};

// Goals API - FIXED: use request() instead of apiCall()
export const goalsAPI = {
  getAll: () => request('/goals'),
  
  getById: (id) => request(`/goals/${id}`),
  
  create: (goalData) => request('/goals', {
    method: 'POST',
    body: JSON.stringify(goalData)
  }),
  
  update: (id, goalData) => request(`/goals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(goalData)
  }),
  
  delete: (id) => request(`/goals/${id}`, {
    method: 'DELETE'
  }),
  
  contribute: (id, amount) => request(`/goals/${id}/contribute`, {
    method: 'POST',
    body: JSON.stringify({ amount })
  })
};

// Export API_URL for image URLs
export { API_URL };