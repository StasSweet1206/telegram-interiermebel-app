import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import CategoryCard from './CategoryCard';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
import { getCategories, getCategoryProducts, getProduct } from '../../services/catalog';
import { adaptCategory, adaptProduct } from '../../services/catalogAdapter';
import './Catalog.css';

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

  // Загрузка категорий при монтировании компонента
  useEffect(() => {
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Загрузка категорий...');
      const data = await catalogAPI.getCategories();
      
      console.log('📦 Полученные данные:', data);
      console.log('📊 Тип данных:', typeof data);
      console.log('🔢 Количество категорий:', data?.results?.length || data?.length || 0);
      
      // Проверяем структуру данных
      if (data && data.results) {
        console.log('✅ Используем data.results:', data.results);
        setCategories(data.results);
      } else if (Array.isArray(data)) {
        console.log('✅ Используем data напрямую:', data);
        setCategories(data);
      } else {
        console.warn('⚠️ Неожиданная структура данных:', data);
        setCategories([]);
      }
      
    } catch (err) {
      console.error('❌ Ошибка загрузки категорий:', err);
      console.error('📝 Детали ошибки:', {
        message: err.message,
        response: err.response,
        request: err.request
      });
      
      setError('Не удалось загрузить категории');
      
      if (window.Telegram?.WebApp?.showAlert) {
        window.Telegram.WebApp.showAlert(
          `Ошибка загрузки категорий: ${err.message}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  loadCategories();
}, []);

  // Загрузка категорий
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getCategories(1, 100);

      // Адаптируем категории к нашему формату
      const adaptedCategories = response.results.map(adaptCategory);

      setCategories(adaptedCategories);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка загрузки категорий:', err);
      setError('Не удалось загрузить каталог. Попробуйте позже.');
      setLoading(false);

      // Показываем ошибку пользователю
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert('Ошибка загрузки каталога');
      }
    }
  };

  // Загрузка товаров категории
  const loadCategoryProducts = async (categoryId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getCategoryProducts(categoryId, 1, 100);

      // Адаптируем товары к нашему формату
      const adaptedProducts = response.results.map(adaptProduct);

      setCurrentProducts(adaptedProducts);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка загрузки товаров:', err);
      setError('Не удалось загрузить товары. Попробуйте позже.');
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
      setLoading(false);
    } catch (err) {
      console.error('Ошибка загрузки товара:', err);
      setError('Не удалось загрузить товар. Попробуйте позже.');
      setLoading(false);
    }
  };

  // Получаем текущие данные для отображения
  const getCurrentData = () => {
    // Если выбран товар - показываем детальную страницу
    if (selectedProductId && selectedProduct) {
      return { type: 'product', data: selectedProduct };
    }

    // Если выбрана категория - показываем товары
    if (currentCategoryId && currentProducts.length > 0) {
      return { type: 'products', data: currentProducts };
    }

    // Если выбрана категория с подкатегориями
    if (currentCategoryId) {
      const subcategories = categories.filter(cat => cat.parentId === currentCategoryId);

      if (subcategories.length > 0) {
        return { type: 'categories', data: subcategories };
      }
    }

    // По умолчанию показываем корневые категории
    const rootCategories = categories.filter(cat => cat.parentId === null);
    return { type: 'categories', data: rootCategories };
  };

  // Навигация по категории
  const handleCategoryClick = async (category) => {
    setCurrentCategoryId(category.id);
    setNavigationPath([...navigationPath, { id: category.id, name: category.name }]);

    // Проверяем, есть ли у категории подкатегории
    const hasSubcategories = categories.some(cat => cat.parentId === category.id);

    if (!hasSubcategories) {
      // Если нет подкатегорий - загружаем товары
      await loadCategoryProducts(category.id);
    } else {
      // Если есть подкатегории - очищаем товары
      setCurrentProducts([]);
    }
  };

  // Открытие товара
  const handleProductClick = async (product) => {
    setSelectedProductId(product.id);
    setNavigationPath([...navigationPath, { id: product.id, name: product.name }]);

    // Загружаем полную информацию о товаре
    await loadProduct(product.id);
  };

  // Навигация назад
  const handleNavigate = async (categoryId, index) => {
    if (categoryId === null) {
      // Возврат на главную
      setCurrentCategoryId(null);
      setSelectedProductId(null);
      setSelectedProduct(null);
      setCurrentProducts([]);
      setNavigationPath([]);
    } else {
      // Возврат на определенный уровень
      setCurrentCategoryId(categoryId);
      setSelectedProductId(null);
      setSelectedProduct(null);
      setNavigationPath(navigationPath.slice(0, index + 1));

      // Загружаем товары категории
      await loadCategoryProducts(categoryId);
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
        // Товар уже в корзине - увеличиваем количество
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += cartItem.quantity;
        return newCart;
      } else {
        // Добавляем новый товар
        return [...prevCart, cartItem];
      }
    });

    // Показываем уведомление
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
          <button onClick={loadCategories}>Повторить попытку</button>
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
            <div className="products-grid">
              {data.map(product => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onClick={() => handleProductClick(product)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Индикатор корзины (плавающая кнопка) */}
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