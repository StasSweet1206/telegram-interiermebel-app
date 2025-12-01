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

// ==================== API ФУНКЦИИ ====================

// Получение списка категорий с пагинацией
const getCategories = async (page = 1, pageSize = 20) => {
  const response = await api.get('/categories/', {
    params: { page, page_size: pageSize }
  });
  return response;
};

// Получение товаров категории с пагинацией
const getCategoryProducts = async (categoryId, page = 1, pageSize = 20) => {
  const response = await api.get(`/categories/${categoryId}/products/`, {
    params: { page, page_size: pageSize }
  });
  return response;
};

// Получение конкретного товара по ID
const getProduct = async (productId) => {
  const response = await api.get(`/products/${productId}/`);
  return response;
};

// Получение всех товаров с пагинацией
const getProducts = async (page = 1, pageSize = 20) => {
  const response = await api.get('/products/', {
    params: { page, page_size: pageSize }
  });
  return response;
};

// Поиск товаров
const searchProducts = async (query, page = 1, pageSize = 20) => {
  const response = await api.get('/products/search/', {
    params: { q: query, page, page_size: pageSize }
  });
  return response;
};

// Создание заказа
const createOrder = async (orderData) => {
  const response = await api.post('/orders/', orderData);
  return response;
};

// Получение заказов пользователя
const getUserOrders = async (userId) => {
  const response = await api.get(`/orders/user/${userId}/`);
  return response;
};

// Получение конкретного заказа
const getOrder = async (orderId) => {
  const response = await api.get(`/orders/${orderId}/`);
  return response;
};

// Проверка наличия товара
const checkProductAvailability = async (productId) => {
  const response = await api.get(`/products/${productId}/availability/`);
  return response;
};

// ЭКСПОРТ ВСЕХ ФУНКЦИЙ
export {
  getCategories,
  getCategoryProducts,
  getProduct,
  getProducts,
  searchProducts,
  createOrder,
  getUserOrders,
  getOrder,
  checkProductAvailability
};

export default api;