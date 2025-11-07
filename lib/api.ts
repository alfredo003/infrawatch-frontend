import axios from 'axios';
import { refreshToken } from '../services/authService';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  let token = localStorage.getItem('authToken');
  const expiresIn = localStorage.getItem('expires_in');

  if (expiresIn && Date.now() > Number(expiresIn)) {
    token = await refreshToken();
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
