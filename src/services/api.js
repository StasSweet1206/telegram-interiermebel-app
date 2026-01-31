import axios from 'axios';

// В Create React App используется process.env, а не import.meta.env
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://positively-nationwide-akita.cloudpub.ru/rashitova_mebelen1';
const USERNAME = process.env.REACT_APP_API_USERNAME;
const PASSWORD = process.env.REACT_APP_API_PASSWORD;

console.log('🔐 API Configuration:', {
  baseURL: BASE_URL,
  hasUsername: !!USERNAME,
  hasPassword: !!PASSWORD,
});

// Создаем базовую конфигурацию
const config = {
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
};

// Добавляем авторизацию только если есть логин И пароль
if (USERNAME && PASSWORD) {
  config.auth = {
    username: USERNAME,
    password: PASSWORD
  };
  console.log('✅ Авторизация добавлена');
} else {
  console.warn('⚠️ Работаем без авторизации');
}

// Создаем экземпляр axios
const api = axios.create(config);

// Функция получения категорий
export const getCategories = async () => {
  try {
    const response = await api.get('/hs/catalog/categories/');
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка при получении категорий:', error);
    throw error;
  }
};

// Функция получения товаров категории
export const getCategoryProducts = async (categoryId) => {
  try {
    const response = await api.get(`/hs/catalog/products/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка при получении товаров категории:', error);
    throw error;
  }
};

// Функция получения товара по ID
export const getProductById = async (productId) => {
  try {
    const response = await api.get(`/hs/catalog/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка при получении товара:', error);
    throw error;
  }
};

export default api;