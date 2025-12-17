import api from './api';

/**
 * Получить категории (корневые или подкатегории)
 * @param {string|null} parentCode - код родительской категории (null = корневые)
 */
export const getCategories = async (parentCode = null, page = 1, pageSize = 100) => {
  console.log('🔍 getCategories запрос:', { parentCode, page, pageSize });

  const params = { page, page_size: pageSize };

  // ✅ Добавляем параметр parent как в Django
  if (parentCode === null) {
    params.parent = 'root';  // Корневые категории
  } else {
    params.parent = parentCode;  // Подкатегории
  }

  const response = await api.get('/catalog/categories/', { params });

  console.log('📦 getCategories RAW ответ:', response.data);
  return response.data;
};

/**
 * Получить категорию по ID
 */
export const getCategory = async (id) => {
  console.log('🔍 getCategory запрос:', id);

  const response = await api.get(`/catalog/categories/${id}/`);

  console.log('📦 getCategory ответ:', response.data);
  return response.data;
};

/**
 * Получить товары категории (по code_1c)
 * @param {string} categoryCode - code_1c категории
 */
export const getCategoryProducts = async (categoryCode, page = 1, pageSize = 20) => {
  console.log('🔍 getCategoryProducts запрос:', { categoryCode, page, pageSize });

  const response = await api.get('/catalog/products/', {
    params: {
      category: categoryCode,  // ✅ Фильтр по code_1c как в Django
      page,
      page_size: pageSize
    },
  });

  console.log('📦 getCategoryProducts ответ:', response.data);
  return response.data;
};

/**
 * Получить список товаров с фильтрами
 */
export const getProducts = async (filters = {}) => {
  console.log('🔍 getProducts запрос:', filters);

  const response = await api.get('/catalog/products/', {
    params: filters,
  });

  console.log('📦 getProducts ответ:', response.data);
  return response.data;
};

/**
 * Получить товар по ID
 */
export const getProduct = async (id) => {
  console.log('🔍 getProduct запрос:', id);

  const response = await api.get(`/catalog/products/${id}/`);

  console.log('📦 getProduct ответ:', response.data);
  return response.data;
};

/**
 * Поиск товаров
 */
export const searchProducts = async (query, filters = {}) => {
  console.log('🔍 searchProducts запрос:', { query, filters });

  const response = await api.get('/catalog/products/', {
    params: { search: query, ...filters },  // ✅ Используем 'search' как в Django
  });

  console.log('📦 searchProducts ответ:', response.data);
  return response.data;
};

/**
 * Получить дерево категорий (для меню)
 */
export const getCategoryTree = async () => {
  console.log('🔍 getCategoryTree запрос');

  const response = await api.get('/catalog/category-tree/');  // ✅ Правильный endpoint

  console.log('📦 getCategoryTree ответ:', response.data);
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