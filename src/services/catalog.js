import api from './api';

/**
 * Получить список всех категорий
 */
export const getCategories = async (page = 1, pageSize = 100) => {
  const response = await api.get('/catalog/categories/', {
    params: { page, page_size: pageSize },
  });
  return response;
};

/**
 * Получить категорию по ID
 */
export const getCategory = async (id) => {
  const response = await api.get(`/catalog/categories/${id}/`);
  return response.data;
};

/**
 * Получить дерево категорий
 */
export const getCategoryTree = async () => {
  const response = await api.get('/catalog/categories/tree/');
  return response.data;
};

/**
 * Получить товары категории
 */
export const getCategoryProducts = async (categoryCode, page = 1, pageSize = 20) => {
  console.log('🔍 Запрос товаров для категории:', categoryCode);

  // ✅ ИСПОЛЬЗУЕМ /products/ С ФИЛЬТРОМ!
  const response = await api.get('/catalog/products/', {
    params: {
      category: categoryCode,  // ← Фильтр по code_1c
      page,
      page_size: pageSize
    },
  });

  console.log('✅ Получено товаров:', response.data);
  return response.data;
};

/**
 * Получить список товаров с фильтрами
 */
export const getProducts = async (filters = {}) => {
  const response = await api.get('/catalog/products/', {
    params: filters,
  });
  return response.data;
};

/**
 * Получить товар по ID
 */
export const getProduct = async (id) => {
  const response = await api.get(`/catalog/products/${id}/`);
  return response.data;
};

/**
 * Поиск товаров
 */
export const searchProducts = async (query, filters = {}) => {
  const response = await api.get('/catalog/products/search/', {
    params: { q: query, ...filters },
  });
  return response.data;
};

/**
 * Получить хиты продаж
 */
export const getBestsellers = async (limit = 20) => {
  const response = await api.get('/catalog/products/bestsellers/', {
    params: { limit },
  });
  return response.data;
};

/**
 * Получить новинки
 */
export const getNewProducts = async (limit = 20) => {
  const response = await api.get('/catalog/products/new/', {
    params: { limit },
  });
  return response.data;
};

/**
 * Получить рекомендации для товара
 */
export const getProductRecommendations = async (productId, limit = 10) => {
  const response = await api.get(`/catalog/products/${productId}/recommendations/`, {
    params: { limit },
  });
  return response.data;
};

/**
 * Получить статистику каталога
 */
export const getStats = async () => {
  const response = await api.get('/catalog/stats/');
  return response.data;
};

/**
 * Проверить работу API
 */
export const healthCheck = async () => {
  const response = await api.get('/catalog/health/');
  return response.data;
};