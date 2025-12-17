import api from './api';

/**
 * Получить категории (корневые или подкатегории)
 * @param {number|null} parentId - ID родительской категории (null = корневые)
 */
export const getCategories = async (parentId = null, page = 1, pageSize = 100) => {
  console.log('🔍 getCategories запрос:', { parentId, page, pageSize });

  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString()
  });

  // ✅ Фильтруем по parent_id
  if (parentId !== null && parentId !== undefined) {
    params.append('parent_id', parentId.toString());
  } else {
    // Запрос корневых категорий (где parent_id IS NULL)
    params.append('parent_id', 'null');
  }

  try {
    const response = await api.get(`/catalog/categories/?${params}`);
    console.log('📦 getCategories RAW ответ:', response.data);

    if (response.data.results && response.data.results.length > 0) {
      console.log('🔍 ПЕРВАЯ КАТЕГОРИЯ ИЗ API:', response.data.results[0]);
      console.log('🔍 ПОЛЯ:', Object.keys(response.data.results[0]));
    }

    return response.data;
  } catch (error) {
    console.error('❌ Ошибка загрузки категорий:', error);
    throw error;
  }
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