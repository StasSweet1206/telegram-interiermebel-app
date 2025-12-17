import api from './api';
import { adaptCategory, adaptProduct } from './catalogAdapter';

/**
 * Получить категории (корневые или подкатегории)
 * @param {number|null} parentId - ID родительской категории (null = корневые)
 */
export const getCategories = async (parentId = null, page = 1, pageSize = 100) => {
  console.log('🔍 getCategories запрос:', { parentId, page, pageSize });

  const params = {
    page: page,
    page_size: pageSize
  };

  // ✅ ИСПРАВЛЕНО: Правильная фильтрация
  if (parentId !== null && parentId !== undefined) {
    params.parent_id = parentId;  // Ищем подкатегории
    console.log('📂 Запрос ПОДКАТЕГОРИЙ для parent_id:', parentId);
  } else {
    // ⚠️ УБРАЛ 'null' - Django сам вернет корневые при отсутствии parent_id
    console.log('🌳 Запрос КОРНЕВЫХ категорий');
  }

  try {
    const response = await api.get('/catalog/categories/', { params });
    console.log('📦 getCategories RAW ответ:', response.data);

    if (response.data.results && response.data.results.length > 0) {
      console.log('🔍 ПЕРВАЯ КАТЕГОРИЯ ИЗ API:', response.data.results[0]);
      console.log('🔍 ПОЛЯ:', Object.keys(response.data.results[0]));

      // ✅ ДОБАВЛЕНО: Проверка parent у всех категорий
      console.log('🔎 ПРОВЕРКА parent у всех категорий:');
      response.data.results.forEach(cat => {
        console.log(`  ID: ${cat.id}, NAME: ${cat.name}, PARENT: ${cat.parent || 'null'}`);
      });
    }

    // ✅ ДОБАВЛЕНО: Адаптация категорий
    const adaptedCategories = response.data.results.map(adaptCategory);
    console.log('✅ Адаптировано категорий:', adaptedCategories.length);

    if (adaptedCategories.length > 0) {
      console.log('📋 Первая адаптированная:', {
        id: adaptedCategories[0].id,
        name: adaptedCategories[0].name,
        parentId: adaptedCategories[0].parentId,
        hasChildren: adaptedCategories[0].hasChildren
      });
    }

    return adaptedCategories;  // ✅ Возвращаем адаптированные данные!
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

  try {
    const response = await api.get(`/catalog/categories/${id}/`);
    console.log('📦 getCategory ответ:', response.data);

    // ✅ ДОБАВЛЕНО: Адаптация
    const adapted = adaptCategory(response.data);
    return adapted;
  } catch (error) {
    console.error('❌ Ошибка загрузки категории:', error);
    throw error;
  }
};

/**
 * Получить товары категории (по code_1c)
 * @param {string} categoryCode - code_1c категории
 */
export const getCategoryProducts = async (categoryCode, page = 1, pageSize = 20) => {
  console.log('🔍 getCategoryProducts запрос:', { categoryCode, page, pageSize });

  try {
    const response = await api.get('/catalog/products/', {
      params: {
        category: categoryCode,  // ✅ Фильтр по code_1c
        page,
        page_size: pageSize
      },
    });

    console.log('📦 getCategoryProducts RAW ответ:', response.data);
    console.log('  - Товаров получено:', response.data.results?.length || 0);
    console.log('  - Всего товаров:', response.data.count);

    // ✅ ДОБАВЛЕНО: Адаптация товаров
    const adaptedProducts = response.data.results.map(adaptProduct);

    return {
      products: adaptedProducts,
      totalCount: response.data.count,
      hasMore: !!response.data.next
    };
  } catch (error) {
    console.error('❌ Ошибка загрузки товаров категории:', error);
    throw error;
  }
};

/**
 * Получить список товаров с фильтрами
 */
export const getProducts = async (filters = {}) => {
  console.log('🔍 getProducts запрос:', filters);

  try {
    const response = await api.get('/catalog/products/', {
      params: filters,
    });

    console.log('📦 getProducts ответ:', response.data);

    // ✅ ДОБАВЛЕНО: Адаптация
    const adaptedProducts = response.data.results.map(adaptProduct);

    return {
      products: adaptedProducts,
      totalCount: response.data.count,
      hasMore: !!response.data.next
    };
  } catch (error) {
    console.error('❌ Ошибка загрузки товаров:', error);
    throw error;
  }
};

/**
 * Получить товар по ID
 */
export const getProduct = async (id) => {
  console.log('🔍 getProduct запрос:', id);

  try {
    const response = await api.get(`/catalog/products/${id}/`);
    console.log('📦 getProduct ответ:', response.data);

    // ✅ ДОБАВЛЕНО: Адаптация
    const adapted = adaptProduct(response.data);
    return adapted;
  } catch (error) {
    console.error('❌ Ошибка загрузки товара:', error);
    throw error;
  }
};
/**
 * Поиск товаров
 */
export const searchProducts = async (query, filters = {}) => {
  console.log('🔍 searchProducts запрос:', { query, filters });

  try {
    const response = await api.get('/catalog/products/', {
      params: { search: query, ...filters },  // ✅ Используем 'search' как в Django
    });

    console.log('📦 searchProducts ответ:', response.data);
    console.log('  - Найдено товаров:', response.data.results?.length || 0);

    // ✅ ДОБАВЛЕНО: Адаптация товаров
    const adaptedProducts = response.data.results.map(adaptProduct);

    return {
      products: adaptedProducts,
      totalCount: response.data.count,
      hasMore: !!response.data.next
    };
  } catch (error) {
    console.error('❌ Ошибка поиска товаров:', error);
    throw error;
  }
};

/**
 * Получить дерево категорий (для меню)
 */
export const getCategoryTree = async () => {
  console.log('🔍 getCategoryTree запрос');

  try {
    const response = await api.get('/catalog/category-tree/');
    console.log('📦 getCategoryTree ответ:', response.data);

    // ✅ ДОБАВЛЕНО: Адаптация дерева категорий
    if (Array.isArray(response.data)) {
      const adaptTree = (categories) => {
        return categories.map(cat => {
          const adapted = adaptCategory(cat);
          if (cat.children && cat.children.length > 0) {
            adapted.subcategories = adaptTree(cat.children);
          }
          return adapted;
        });
      };
      return adaptTree(response.data);
    }

    return response.data;
  } catch (error) {
    console.error('❌ Ошибка загрузки дерева категорий:', error);
    throw error;
  }
};

/**
 * Получить хиты продаж
 */
export const getBestsellers = async (limit = 20) => {
  console.log('🔍 getBestsellers запрос, limit:', limit);

  try {
    const response = await api.get('/catalog/products/bestsellers/', {
      params: { limit },
    });

    console.log('📦 getBestsellers ответ:', response.data);
    console.log('  - Хитов продаж:', response.data.results?.length || response.data.length || 0);

    // ✅ ДОБАВЛЕНО: Адаптация товаров
    const products = response.data.results || response.data;
    const adaptedProducts = Array.isArray(products) ? products.map(adaptProduct) : [];

    return adaptedProducts;
  } catch (error) {
    console.error('❌ Ошибка загрузки хитов продаж:', error);
    throw error;
  }
};

/**
 * Получить новинки
 */
export const getNewProducts = async (limit = 20) => {
  console.log('🔍 getNewProducts запрос, limit:', limit);

  try {
    const response = await api.get('/catalog/products/new/', {
      params: { limit },
    });

    console.log('📦 getNewProducts ответ:', response.data);
    console.log('  - Новинок:', response.data.results?.length || response.data.length || 0);

    // ✅ ДОБАВЛЕНО: Адаптация товаров
    const products = response.data.results || response.data;
    const adaptedProducts = Array.isArray(products) ? products.map(adaptProduct) : [];

    return adaptedProducts;
  } catch (error) {
    console.error('❌ Ошибка загрузки новинок:', error);
    throw error;
  }
};

/**
 * Получить рекомендации для товара
 */
export const getProductRecommendations = async (productId, limit = 10) => {
  console.log('🔍 getProductRecommendations запрос:', { productId, limit });

  try {
    const response = await api.get(`/catalog/products/${productId}/recommendations/`, {
      params: { limit },
    });

    console.log('📦 getProductRecommendations ответ:', response.data);
    console.log('  - Рекомендаций:', response.data.results?.length || response.data.length || 0);

    // ✅ ДОБАВЛЕНО: Адаптация товаров
    const products = response.data.results || response.data;
    const adaptedProducts = Array.isArray(products) ? products.map(adaptProduct) : [];

    return adaptedProducts;
  } catch (error) {
    console.error('❌ Ошибка загрузки рекомендаций:', error);
    throw error;
  }
};

/**
 * Получить статистику каталога
 */
export const getStats = async () => {
  console.log('🔍 getStats запрос');

  try {
    const response = await api.get('/catalog/stats/');
    console.log('📦 getStats ответ:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка загрузки статистики:', error);
    throw error;
  }
};

export const healthCheck = async () => {
  console.log('🔍 healthCheck запрос');
  try {
    const response = await api.get('/catalog/health/');
    console.log('📦 healthCheck ответ:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка healthCheck:', error);
    throw error;
  }
};