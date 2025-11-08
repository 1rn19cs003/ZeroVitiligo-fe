import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const authService = {
  register: async (userData) => {
    const response = await api.post('/doctor/register', userData);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/doctor/login', credentials);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      window.dispatchEvent(new Event('authChanged'));
    }
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('authChanged'));
    router.push('/'); 
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('authToken');
  },

  // Get current user
  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};