import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Add JWT token to all requests if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
