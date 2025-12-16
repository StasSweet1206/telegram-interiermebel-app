import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import CategoryCard from './CategoryCard';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
import { getCategories, getCategoryProducts, getProduct } from '../../services/catalog';
import { adaptCategory, adaptProduct } from '../../services/catalogAdapter';
import './Catalog.css';
import Pagination from './Pagination';

const Catalog = () => {
  const navigate = useNavigate();

  // Состояния
  const [categories, setCategories] = useState([]);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [navigationPath, setNavigationPath] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Пагинация для категорий
  const [categoriesPage, setCategoriesPage] = useState(1);
  const [categoriesTotalPages, setCategoriesTotalPages] = useState(1);
  const [categoriesTotalCount, setCategoriesTotalCount] = useState(0);

  // Пагинация для товаров
  const [productsPage, setProductsPage] = useState(1);
  const [productsTotalPages, setProductsTotalPages] = useState(1);
  const [productsTotalCount, setProductsTotalCount] = useState(0);

  const [itemsPerPage] = useState(20);

  // Загрузка категорий с пагинацией
  const loadCategories = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔄 Загрузка категорий (страница ${page})...`);
      const response = await getCategories(page, itemsPerPage);

      console.log('📦 Полученные данные категорий:', response);

      // Определяем где находятся категории
      let categoriesData = [];

      if (Array.isArray(response)) {
        categoriesData = response;
      } else if (response.results) {
        categoriesData = response.results;
      } else if (response.data) {
        categoriesData = Array.isArray(response.data) ? response.data : response.data.results;
      }

      console.log('🔢 Количество категорий:', categoriesData.length);

      // Адаптируем категории
      const adaptedCategories = categoriesData.map(adaptCategory);
      setCategories(adaptedCategories);

      // Сохраняем пагинацию для категорий
      const totalItems = response.count || categoriesData.length;
      setCategoriesPage(page);
      setCategoriesTotalCount(totalItems);
      setCategoriesTotalPages(Math.ceil(totalItems / itemsPerPage));

      console.log(`📄 Категории: страница ${page} из ${Math.ceil(totalItems / itemsPerPage)}, всего: ${totalItems}`);

    } catch (err) {
      console.error('❌ Ошибка загрузки категорий:', err);
      setError('Не удалось загрузить категории');

      if (window.Telegram?.WebApp?.showAlert) {
        window.Telegram.WebApp.showAlert(`Ошибка загрузки категорий: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Загрузка товаров категории с пагинацией
  const loadCategoryProducts = async (categoryCode, page = 1) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔄 Загрузка товаров категории ${categoryCode} (страница ${page})...`);

      // ✅ ПЕРЕДАЁМ code1c, а не id!
      const response = await getCategoryProducts(categoryCode, page, itemsPerPage);

      console.log('📦 Полученные товары:', response);

      // Определяем где находятся товары
      let productsData = [];

      if (Array.isArray(response)) {
        productsData = response;
      } else if (response.results) {
        productsData = response.results;
      } else if (response.data) {
        productsData = Array.isArray(response.data) ? response.data : response.data.results;
      }

      console.log('🔢 Количество товаров:', productsData.length);

      // Адаптируем товары
      const adaptedProducts = productsData.map(adaptProduct);
      setCurrentProducts(adaptedProducts);

      // Сохраняем пагинацию для товаров
      const totalItems = response.count || productsData.length;
      setProductsPage(page);
      setProductsTotalCount(totalItems);
      setProductsTotalPages(Math.ceil(totalItems / itemsPerPage));

      console.log(`📄 Товары: страница ${page} из ${Math.ceil(totalItems / itemsPerPage)}, всего: ${totalItems}`);

    } catch (err) {
      console.error('❌ Ошибка загрузки товаров:', err);
      setError('Не удалось загрузить товары. Попробуйте позже.');

      if (window.Telegram?.WebApp?.showAlert) {
        window.Telegram.WebApp.showAlert(`Ошибка загрузки товаров: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Загрузка конкретного товара
  const loadProduct = async (productId) => {
    try {
      setLoading(true);
      setError(null);

      const product = await getProduct(productId);
      const adaptedProduct = adaptProduct(product);

      setSelectedProduct(adaptedProduct);
    } catch (err) {
      console.error('❌ Ошибка загрузки товара:', err);
      setError('Не удалось загрузить товар. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  // Загрузка категорий при монтировании
  useEffect(() => {
    loadCategories(1);
  }, []);

  // Получаем текущие данные для отображения
  const getCurrentData = () => {
    if (selectedProductId && selectedProduct) {
      return { type: 'product', data: selectedProduct };
    }

    if (currentCategoryId && currentProducts.length > 0) {
      return { type: 'products', data: currentProducts };
    }

    if (currentCategoryId) {
      // ✅ ИЩЕМ ПО code1c!
      const currentCategory = categories.find(cat => cat.id === currentCategoryId);
      if (currentCategory) {
        const subcategories = categories.filter(cat => cat.parentId === currentCategory.code1c);
        console.log('📁 Подкатегории для', currentCategory.name, ':', subcategories);
        if (subcategories.length > 0) {
          return { type: 'categories', data: subcategories };
        }
      }
    }

    const rootCategories = categories.filter(cat => cat.parentId === null);
    return { type: 'categories', data: rootCategories };
  };

  // Навигация по категории
  const handleCategoryClick = async (category) => {
    console.log('🔍 Клик по категории:', category);

    setCurrentCategoryId(category.id);

    // ✅ ПРАВИЛЬНАЯ НАВИГАЦИЯ - сохраняем и id, и code1c
    setNavigationPath([...navigationPath, {
      id: category.id,
      name: category.name,
      code1c: category.code1c  // ← ДОБАВИЛИ code1c!
    }]);

    // ✅ ПРАВИЛЬНАЯ ПРОВЕРКА ПОДКАТЕГОРИЙ
    const subcategories = categories.filter(cat => cat.parentId === category.code1c);
    console.log('📁 Найдено подкатегорий:', subcategories.length);

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
      // Возврат из карточки товара к списку товаров
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
      } else {
        // Вернулись к предыдущей категории
        const previousCategory = newPath[newPath.length - 1];
        setCurrentCategoryId(previousCategory.id);

        // ✅ ПРОВЕРЯЕМ ПОДКАТЕГОРИИ С code1c
        const category = categories.find(cat => cat.id === previousCategory.id);
        if (category) {
          const subcategories = categories.filter(cat => cat.parentId === category.code1c);

          if (subcategories.length === 0) {
            // Нет подкатегорий - загружаем товары
            loadCategoryProducts(category.code1c, 1);
          } else {
            // Есть подкатегории - очищаем товары
            setCurrentProducts([]);
            setProductsPage(1);
          }
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
    } else if (index < navigationPath.length - 1) {
      // Клик на промежуточную категорию
      const newPath = navigationPath.slice(0, index + 1);
      setNavigationPath(newPath);

      const targetCategory = newPath[newPath.length - 1];
      setCurrentCategoryId(targetCategory.id);

      // ✅ ПРОВЕРЯЕМ ПОДКАТЕГОРИИ С code1c
      const category = categories.find(cat => cat.id === targetCategory.id);
      if (category) {
        const subcategories = categories.filter(cat => cat.parentId === category.code1c);

        if (subcategories.length === 0) {
          loadCategoryProducts(category.code1c, 1);
        } else {
          setCurrentProducts([]);
          setProductsPage(1);
        }
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

  // Навигация назад
  const handleNavigate = async (categoryId, index) => {
    if (categoryId === null) {
      setCurrentCategoryId(null);
      setSelectedProductId(null);
      setSelectedProduct(null);
      setCurrentProducts([]);
      setNavigationPath([]);
      setProductsPage(1);
      await loadCategories(1); // Перезагружаем категории
    } else {
      setCurrentCategoryId(categoryId);
      setSelectedProductId(null);
      setSelectedProduct(null);
      setNavigationPath(navigationPath.slice(0, index + 1));
      await loadCategoryProducts(categoryId, 1); // Загружаем первую страницу
    }
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
          <button onClick={() => loadCategories(1)}>Повторить попытку</button>
        </div>
      </div>
    );
  }

  return (
    <div className="catalog">
      {/* Хлебные крошки и кнопка домой */}
      {!selectedProductId && (
        <div className="catalog-header">
          <Breadcrumbs path={navigationPath} onNavigate={handleNavigate} />
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
            <>
              <div className="categories-grid">
                {data.map(category => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onClick={() => handleCategoryClick(category)}
                  />
                ))}
              </div>

              {/* Пагинация для категорий */}
              {categoriesTotalPages > 1 && (
                <Pagination
                  currentPage={categoriesPage}
                  totalPages={categoriesTotalPages}
                  onPageChange={(page) => loadCategories(page)}
                />
              )}
            </>
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
                  onPageChange={(page) => loadCategoryProducts(currentCategoryId, page)}
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