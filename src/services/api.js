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

/**
 * Получение списка категорий с пагинацией
 * @param {number} page - номер страницы
 * @param {number} pageSize - количество элементов на странице
 */
export const getCategories = async (page = 1, pageSize = 20) => {
  try {
    const response = await api.get('/categories/', {
      params: {
        page,
        page_size: pageSize
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Получение товаров категории с пагинацией
 * @param {number} categoryId - ID категории
 * @param {number} page - номер страницы
 * @param {number} pageSize - количество элементов на странице
 */
export const getCategoryProducts = async (categoryId, page = 1, pageSize = 20) => {
  try {
    const response = await api.get(`/categories/${categoryId}/products/`, {
      params: {
        page,
        page_size: pageSize
      }
    });
    return response;
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    throw error;
  }
};

/**
 * Получение конкретного товара по ID
 * @param {number} productId - ID товара
 */
export const getProduct = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}/`);
    return response;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    throw error;
  }
};

/**
 * Получение всех товаров с пагинацией
 * @param {number} page - номер страницы
 * @param {number} pageSize - количество элементов на странице
 */
export const getProducts = async (page = 1, pageSize = 20) => {
  try {
    const response = await api.get('/products/', {
      params: {
        page,
        page_size: pageSize
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Поиск товаров
 * @param {string} query - поисковый запрос
 * @param {number} page - номер страницы
 * @param {number} pageSize - количество элементов на странице
 */
export const searchProducts = async (query, page = 1, pageSize = 20) => {
  try {
    const response = await api.get('/products/search/', {
      params: {
        q: query,
        page,
        page_size: pageSize
      }
    });
    return response;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

/**
 * Создание заказа
 * @param {object} orderData - данные заказа
 */
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders/', orderData);
    return response;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Получение заказов пользователя
 * @param {number} userId - ID пользователя Telegram
 */
export const getUserOrders = async (userId) => {
  try {
    const response = await api.get(`/orders/user/${userId}/`);
    return response;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

/**
 * Получение конкретного заказа
 * @param {number} orderId - ID заказа
 */
export const getOrder = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}/`);
    return response;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Проверка наличия товара
 * @param {number} productId - ID товара
 */
export const checkProductAvailability = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}/availability/`);
    return response;
  } catch (error) {
    console.error(`Error checking availability for product ${productId}:`, error);
    throw error;
  }
};

// Экспортируем axios instance для кастомных запросов
export default api;