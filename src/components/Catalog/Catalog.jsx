import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import CategoryCard from './CategoryCard';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
import { mockCatalogData } from './mockData';
import './Catalog.css';

const Catalog = () => {
  const navigate = useNavigate();

  // Состояния
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [navigationPath, setNavigationPath] = useState([]);
  const [cart, setCart] = useState([]); // Корзина

  // Получаем текущие данные для отображения
  const getCurrentData = () => {
    // Если выбран товар - показываем детальную страницу
    if (selectedProductId) {
      return { type: 'product', data: mockCatalogData.products[selectedProductId] };
    }

    // Если выбрана категория
    if (currentCategoryId) {
      const category = mockCatalogData.subcategories[currentCategoryId];

      if (category) {
        // Если это подкатегория с товарами
        if (!category.hasSubcategories && category.products) {
          const products = category.products.map(id => mockCatalogData.products[id]);
          return { type: 'products', data: products };
        }

        // Если это подкатегория с подкатегориями
        if (category.subcategories) {
          const subcategories = category.subcategories.map(id => mockCatalogData.subcategories[id]);
          return { type: 'categories', data: subcategories };
        }
      }

      // Если это основная категория
      const mainCategory = mockCatalogData.categories.find(cat => cat.id === currentCategoryId);

      if (mainCategory) {
        // Если категория содержит подкатегории
        if (mainCategory.hasSubcategories && mainCategory.subcategories) {
          const subcategories = mainCategory.subcategories.map(id => mockCatalogData.subcategories[id]);
          return { type: 'categories', data: subcategories };
        }

        // Если категория содержит товары
        if (mainCategory.products) {
          const products = mainCategory.products.map(id => mockCatalogData.products[id]);
          return { type: 'products', data: products };
        }
      }
    }

    // По умолчанию показываем основные категории
    return { type: 'categories', data: mockCatalogData.categories };
  };

  // Навигация по категории
  const handleCategoryClick = (category) => {
    setCurrentCategoryId(category.id);
    setNavigationPath([...navigationPath, { id: category.id, name: category.name }]);
  };

  // Открытие товара
  const handleProductClick = (product) => {
    setSelectedProductId(product.id);
    setNavigationPath([...navigationPath, { id: product.id, name: product.name }]);
  };

  // Навигация назад
  const handleNavigate = (categoryId, index) => {
    if (categoryId === null) {
      // Возврат на главную
      setCurrentCategoryId(null);
      setSelectedProductId(null);
      setNavigationPath([]);
    } else {
      // Возврат на определенный уровень
      setCurrentCategoryId(categoryId);
      setSelectedProductId(null);
      setNavigationPath(navigationPath.slice(0, index + 1));
    }
  };

  // Возврат с детальной страницы товара
  const handleBackFromProduct = () => {
    setSelectedProductId(null);
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

    // Показываем уведомление (позже можно добавить toast)
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showAlert(`Добавлено в корзину: ${cartItem.quantity} шт.`);
    }
  };

  // Переход в главное меню
  const handleGoHome = () => {
    navigate('/');
  };

  const { type, data } = getCurrentData();

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
          <div className="categories-grid">
            {data.map(category => (
              <CategoryCard 
                key={category.id}
                category={category}
                onClick={() => handleCategoryClick(category)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Список товаров */}
      {type === 'products' && (
        <div className="catalog-content">
          <h2 className="catalog-title">
            {navigationPath.length > 0 ? navigationPath[navigationPath.length - 1].name : 'Товары'}
          </h2>
          <div className="products-grid">
            {data.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
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