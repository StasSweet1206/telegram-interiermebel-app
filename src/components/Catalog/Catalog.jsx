import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCard from './CategoryCard';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
import Breadcrumbs from './Breadcrumbs';
import Pagination from './Pagination';
import {
  getCategories,
  getCategoryProducts,
  getProduct
} from '../../services/catalog';
import './Catalog.css';

const Catalog = () => {
  const navigate = useNavigate();

  // State
  const [categories, setCategories] = useState([]);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [navigationPath, setNavigationPath] = useState([]);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Пагинация только для товаров
  const [productsPage, setProductsPage] = useState(1);
  const [productsTotalPages, setProductsTotalPages] = useState(1);

  // Адаптация данных категории
  const adaptCategory = (category) => ({
    id: category.id,
    name: category.name,
    code1c: category.code_1c,
    parentId: category.parent_code_1c,
    imageUrl: category.image || null,
    description: category.description || '',
    productsCount: category.products_count || 0,
    hasChildren: category.has_children || false,  // ← НОВОЕ ПОЛЕ!
    order: category.order || 0
  });

  // Адаптация данных товара
  const adaptProduct = (product) => ({
    id: product.id,
    name: product.name,
    price: parseFloat(product.price),
    imageUrl: product.image || null,
    description: product.description || '',
    category: product.category || null,
    stock: product.stock || 0,
    code1c: product.code_1c || null
  });

  // Загрузка КОРНЕВЫХ категорий
  const loadRootCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📂 Загружаем КОРНЕВЫЕ категории');

      const response = await getCategories(null); // ✅ ИСПРАВЛЕНО: null = корневые
      console.log('📦 Получено корневых категорий:', response);

      // ✅ response.results - так возвращает getCategories
      const rootCategories = response.results || response;
      const adaptedCategories = rootCategories.map(adaptCategory);
      setCategories(adaptedCategories);

      console.log('✅ Корневые категории загружены:', adaptedCategories.length);

    } catch (err) {
      console.error('❌ Ошибка загрузки корневых категорий:', err);
      setError('Не удалось загрузить каталог');
    } finally {
      setLoading(false);
    }
  };

  // Загрузка ПОДКАТЕГОРИЙ по code1c родителя
  const loadSubcategories = async (parentCode1c) => {
    try {
      console.log('📂 Загружаем подкатегории для:', parentCode1c);

      const response = await getCategories(parentCode1c); // ✅ ИСПРАВЛЕНО
      console.log('📦 Получено подкатегорий:', response);

      // ✅ response.data.results - так возвращает getCategories
      const subcategories = response.results || response;
      const adaptedSubcategories = subcategories.map(adaptCategory);

      // ✅ ДОБАВЛЯЕМ к существующим, НЕ заменяем!
      setCategories(prev => [...prev, ...adaptedSubcategories]);

      console.log('✅ Подкатегории загружены:', adaptedSubcategories.length);

      return adaptedSubcategories;

    } catch (err) {
      console.error('❌ Ошибка загрузки подкатегорий:', err);
      return [];
    }
  };

  // Загрузка товаров категории
  const loadCategoryProducts = async (categoryCode, page = 1) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🛒 Загружаем товары категории:', categoryCode, 'страница:', page);

      const response = await getCategoryProducts(categoryCode, page);
      console.log('📦 Получено товаров:', response);

      const adaptedProducts = response.results.map(adaptProduct);
      setCurrentProducts(adaptedProducts);
      setProductsPage(page);
      setProductsTotalPages(Math.ceil(response.count / 20));

      console.log('✅ Товары загружены:', adaptedProducts.length);

    } catch (err) {
      console.error('❌ Ошибка загрузки товаров:', err);
      setError('Не удалось загрузить товары');
      setCurrentProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка одного товара
  const loadProduct = async (productId) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Загружаем товар:', productId);

      const response = await getProduct(productId);
      console.log('📦 Получен товар:', response);

      const adaptedProduct = adaptProduct(response);
      setSelectedProduct(adaptedProduct);

      console.log('✅ Товар загружен:', adaptedProduct);

    } catch (err) {
      console.error('❌ Ошибка загрузки товара:', err);
      setError('Не удалось загрузить товар');
    } finally {
      setLoading(false);
    }
  };

  // Монтирование компонента - загружаем ТОЛЬКО корневые
  useEffect(() => {
    console.log('🚀 Компонент Catalog монтируется');
    loadRootCategories();
  }, []);

  // Загрузка товаров при изменении категории
  useEffect(() => {
    console.log('🔄 useEffect: currentCategoryId изменился:', currentCategoryId);
    console.log('📊 Текущее состояние:');
    console.log('  - currentProducts.length:', currentProducts.length);
    console.log('  - categories.length:', categories.length);

    if (currentCategoryId && currentProducts.length === 0) {
      const currentCategory = categories.find(cat => cat.id === currentCategoryId);
      console.log('🔍 Найдена категория:', currentCategory);

      if (currentCategory) {
        // ✅ Проверяем, есть ли УЖЕ ЗАГРУЖЕННЫЕ подкатегории
        const subcategories = categories.filter(cat => cat.parentId === currentCategory.code1c);
        console.log('📁 Найдено подкатегорий в памяти:', subcategories.length);

        if (subcategories.length === 0) {
          console.log('🛒 Загружаем товары для code1c:', currentCategory.code1c);
          loadCategoryProducts(currentCategory.code1c, 1);
        } else {
          console.log('✅ Подкатегории есть - НЕ загружаем товары');
        }
      }
    }
  }, [currentCategoryId, currentProducts.length, categories]);

  // Определение текущих данных для отображения
  const getCurrentData = () => {
    console.log('🎯 getCurrentData вызван');
    console.log('📊 Состояние:');
    console.log('  - selectedProductId:', selectedProductId);
    console.log('  - selectedProduct:', selectedProduct);
    console.log('  - currentCategoryId:', currentCategoryId);
    console.log('  - currentProducts.length:', currentProducts.length);
    console.log('  - categories.length:', categories.length);

    // 1. Если выбран товар
    if (selectedProductId && selectedProduct) {
      console.log('✅ Возвращаем ТОВАР');
      return { type: 'product', data: selectedProduct };
    }

    // 2. Если есть категория И товары загружены
    if (currentCategoryId && currentProducts.length > 0) {
      console.log('✅ Возвращаем ТОВАРЫ, количество:', currentProducts.length);
      return { type: 'products', data: currentProducts };
    }

    // 3. Если есть категория - показываем УЖЕ ЗАГРУЖЕННЫЕ подкатегории
    if (currentCategoryId) {
      const currentCategory = categories.find(cat => cat.id === currentCategoryId);
      console.log('🔍 Текущая категория:', currentCategory);

      if (!currentCategory) {
        console.log('❌ Категория не найдена!');
        const rootCategories = categories.filter(cat => cat.parentId === null);
        return { type: 'categories', data: rootCategories };
      }

      // ✅ ИЩЕМ УЖЕ ЗАГРУЖЕННЫЕ подкатегории
      const subcategories = categories.filter(cat => cat.parentId === currentCategory.code1c);

      console.log('📁 Найдено подкатегорий в памяти:', subcategories.length);

      if (subcategories.length > 0) {
        console.log('✅ Возвращаем ПОДКАТЕГОРИИ');
        return { type: 'categories', data: subcategories };
      } else {
        console.log('⚠️ Подкатегорий нет - конечная категория');
        // Товары загружаются через useEffect
      }
    }

    // 4. Корневые категории
    const rootCategories = categories.filter(cat => cat.parentId === null);
    console.log('✅ Возвращаем КОРНЕВЫЕ категории:', rootCategories.length);

    return { type: 'categories', data: rootCategories };
  };

  // Навигация по категории
  const handleCategoryClick = async (category) => {
    console.log('🔍 Клик по категории:', category);

    setCurrentCategoryId(category.id);

    // Сохраняем в путь
    setNavigationPath([...navigationPath, {
      id: category.id,
      name: category.name,
      code1c: category.code1c
    }]);

    // ✅ ЗАГРУЖАЕМ подкатегории С СЕРВЕРА
    const subcategories = await loadSubcategories(category.code1c);

    if (subcategories.length > 0) {
      // Есть подкатегории - показываем их
      console.log('✅ Показываем подкатегории');
      setCurrentProducts([]);
      setProductsPage(1);
    } else {
      // Нет подкатегорий - загружаем товары
      console.log('✅ Загружаем товары по code1c:', category.code1c);
      await loadCategoryProducts(category.code1c, 1);
    }
  };

  // Навигация назад
  const handleBackClick = () => {
    if (selectedProductId) {
      setSelectedProductId(null);
      setSelectedProduct(null);
      return;
    }

    if (navigationPath.length > 0) {
      const newPath = navigationPath.slice(0, -1);
      setNavigationPath(newPath);

      if (newPath.length === 0) {
        // Вернулись к корню
        setCurrentCategoryId(null);
        setCurrentProducts([]);
        setProductsPage(1);
        // ✅ НЕ ПЕРЕЗАГРУЖАЕМ - корневые УЖЕ в памяти!
      } else {
        // Вернулись к предыдущей категории
        const previousCategory = newPath[newPath.length - 1];
        setCurrentCategoryId(previousCategory.id);

        // ✅ ПОДКАТЕГОРИИ УЖЕ ЗАГРУЖЕНЫ - просто показываем
        const subcategories = categories.filter(cat => cat.parentId === previousCategory.code1c);

        if (subcategories.length === 0) {
          loadCategoryProducts(previousCategory.code1c, 1);
        } else {
          setCurrentProducts([]);
          setProductsPage(1);
        }
      }
    }
  };

  // Навигация по хлебным крошкам
  const handleBreadcrumbClick = (index) => {
    if (index === -1) {
      // Клик на "Главная"
      setNavigationPath([]);
      setCurrentCategoryId(null);
      setCurrentProducts([]);
      setProductsPage(1);
      setSelectedProductId(null);
      setSelectedProduct(null);
      // ✅ НЕ ПЕРЕЗАГРУЖАЕМ корневые!
    } else if (index < navigationPath.length - 1) {
      const newPath = navigationPath.slice(0, index + 1);
      setNavigationPath(newPath);

      const targetCategory = newPath[newPath.length - 1];
      setCurrentCategoryId(targetCategory.id);

      // ✅ ПОДКАТЕГОРИИ УЖЕ ЗАГРУЖЕНЫ
      const subcategories = categories.filter(cat => cat.parentId === targetCategory.code1c);

      if (subcategories.length === 0) {
        loadCategoryProducts(targetCategory.code1c, 1);
      } else {
        setCurrentProducts([]);
        setProductsPage(1);
      }

      setSelectedProductId(null);
      setSelectedProduct(null);
    }
  };

  // Открытие товара
  const handleProductClick = async (product) => {
    setSelectedProductId(product.id);
    setNavigationPath([...navigationPath, { id: product.id, name: product.name }]);
    await loadProduct(product.id);
  };

  // Возврат с детальной страницы товара
  const handleBackFromProduct = () => {
    setSelectedProductId(null);
    setSelectedProduct(null);
    setNavigationPath(navigationPath.slice(0, -1));
  };

  // Добавление в корзину
  const handleAddToCart = (cartItem) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === cartItem.id);

      if (existingItemIndex !== -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += cartItem.quantity;
        return newCart;
      } else {
        return [...prevCart, cartItem];
      }
    });

    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showAlert(`Добавлено в корзину: ${cartItem.quantity} шт.`);
    }
  };

  // Переход в главное меню
  const handleGoHome = () => {
    navigate('/');
  };

  const { type, data } = getCurrentData();

  // Показываем загрузку
  if (loading && categories.length === 0) {
    return (
      <div className="catalog">
        <div className="loading">
          <p>Загрузка каталога...</p>
        </div>
      </div>
    );
  }

  // Показываем ошибку
  if (error && categories.length === 0) {
    return (
      <div className="catalog">
        <div className="error">
          <p>{error}</p>
          <button onClick={() => loadRootCategories()}>Повторить попытку</button>
        </div>
      </div>
    );
  }

  return (
    <div className="catalog">
      {/* Хлебные крошки и кнопка домой */}
      {!selectedProductId && (
        <div className="catalog-header">
          <Breadcrumbs path={navigationPath} onNavigate={handleBreadcrumbClick} />
          <button className="home-button" onClick={handleGoHome}>
            🏠 Главное меню
          </button>
        </div>
      )}

      {/* Детальная страница товара */}
      {type === 'product' && (
        <ProductDetail
          product={data}
          onBack={handleBackFromProduct}
          onAddToCart={handleAddToCart}
          cartItems={cart}
        />
      )}

      {/* Список категорий */}
      {type === 'categories' && (
        <div className="catalog-content">
          <h2 className="catalog-title">
            {navigationPath.length > 0 ? navigationPath[navigationPath.length - 1].name : 'Каталог'}
          </h2>
          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : (
            <div className="categories-grid">
              {data.map(category => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={() => handleCategoryClick(category)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Список товаров */}
      {type === 'products' && (
        <div className="catalog-content">
          <h2 className="catalog-title">
            {navigationPath.length > 0 ? navigationPath[navigationPath.length - 1].name : 'Товары'}
          </h2>
          {loading ? (
            <div className="loading">Загрузка товаров...</div>
          ) : data.length === 0 ? (
            <div className="empty-category">
              <p>В этой категории пока нет товаров</p>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {data.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => handleProductClick(product)}
                  />
                ))}
              </div>

              {/* Пагинация для товаров */}
              {productsTotalPages > 1 && (
                <Pagination
                  currentPage={productsPage}
                  totalPages={productsTotalPages}
                  onPageChange={(page) => {
                    const category = categories.find(cat => cat.id === currentCategoryId);
                    if (category) {
                      loadCategoryProducts(category.code1c, page);
                    }
                  }}
                />
              )}
            </>
          )}
        </div>
      )}

      {/* Индикатор корзины */}
      {cart.length > 0 && !selectedProductId && (
        <div className="cart-indicator" onClick={() => navigate('/cart')}>
          <span className="cart-icon">🛒</span>
          <span className="cart-count">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </div>
      )}
    </div>
  );
};

export default Catalog;