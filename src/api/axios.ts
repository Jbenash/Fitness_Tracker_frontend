import axios from 'axios';
import { store } from '../store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.token;
  const userId = state.auth.userId;

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  config.headers['X-User-Id'] = userId;
  
  return config;
});

export default api;
