import axios from 'axios';

// Базовый URL вашего Django бэкенда на Railway
const API_URL = process.env.REACT_APP_API_URL || 'https://django-sso-production.up.railway.app/api';

// Создаем axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    console.log('📦 Response data:', response.data);
    return response.data;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.message);

    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          console.error('Unauthorized - требуется авторизация');
          break;
        case 403:
          console.error('Forbidden - доступ запрещен');
          break;
        case 404:
          console.error('Not Found - ресурс не найден');
          break;
        case 500:
          console.error('Server Error - ошибка сервера');
          break;
      }
    } else if (error.request) {
      console.error('No response from server');
    }

    return Promise.reject(error);
  }
);

export default api;