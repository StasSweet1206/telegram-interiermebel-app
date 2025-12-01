import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCard from './CategoryCard';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
import Breadcrumbs from './Breadcrumbs';
import Pagination from './Pagination';
import { getCategories, getCategoryProducts, getProduct } from '../../services/api';
import './Catalog.css';

const Catalog = () => {
  const navigate = useNavigate();

  // Состояния для категорий
  const [categories, setCategories] = useState([]);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [navigationPath, setNavigationPath] = useState([]);

  // 🆕 Состояния для пагинации категорий
  const [categoriesPage, setCategoriesPage] = useState(1);
  const [categoriesTotalPages, setCategoriesTotalPages] = useState(1);

  // Состояния для товаров
  const [currentProducts, setCurrentProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 🆕 Состояния для пагинации товаров
  const [productsPage, setProductsPage] = useState(1);
  const [productsTotalPages, setProductsTotalPages] = useState(1);

  // Общие состояния
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

  // Загрузка категорий при монтировании
  useEffect(() => {
    loadCategories(1);
  }, []);

  // Функция адаптации товара
  const adaptProduct = (product) => {
    return {
      id: product.id,
      name: product.name || product.title || 'Без названия',
      price: product.price || 0,
      image: product.image || product.main_image || '/placeholder.jpg',
      description: product.description || '',
      category: product.category,
      inStock: product.in_stock ?? true,
      dimensions: product.dimensions || null,
      material: product.material || null,
      color: product.color || null,
      images: product.images || []
    };
  };

  // Загрузка категорий с пагинацией
  const loadCategories = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`📂 Загрузка категорий, страница ${page}`);

      const response = await getCategories(page, 20);

      console.log('📦 Полученные категории:', response);

      let categoriesData = [];
      let totalPages = 1;

      if (Array.isArray(response)) {
        categoriesData = response;
      } else if (response.results) {
        categoriesData = response.results;
        totalPages = Math.ceil(response.count / 20);
      } else if (response.data) {
        categoriesData = Array.isArray(response.data) ? response.data : response.data.results;
        totalPages = response.data.count ? Math.ceil(response.data.count / 20) : 1;
      }

      const adaptedCategories = categoriesData.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description || '',
        image: cat.image || '/placeholder-category.jpg',
        parentId: cat.parent || null
      }));

      setCategories(adaptedCategories);
      setCategoriesPage(page);
      setCategoriesTotalPages(totalPages);

      console.log(`✅ Загружено категорий: ${adaptedCategories.length}, всего страниц: ${totalPages}`);

    } catch (err) {
      console.error('❌ Ошибка загрузки категорий:', err);
      setError('Не удалось загрузить категории. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  // Загрузка товаров категории с пагинацией
  const loadCategoryProducts = async (categoryId, page = 1) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔄 Загрузка товаров категории ${categoryId}, страница ${page}`);

      const response = await getCategoryProducts(categoryId, page, 20);

      console.log('📦 Полученные товары:', response);

      let products = [];
      let totalPages = 1;

      if (Array.isArray(response)) {
        products = response;
      } else if (response.results) {
        products = response.results;
        totalPages = Math.ceil(response.count / 20);
      } else if (response.data) {
        products = Array.isArray(response.data) ? response.data : response.data.results;
        totalPages = response.data.count ? Math.ceil(response.data.count / 20) : 1;
      }

      console.log(`🔢 Количество товаров: ${products.length}, всего страниц: ${totalPages}`);

      const adaptedProducts = products.map(adaptProduct);

      setCurrentProducts(adaptedProducts);
      setProductsPage(page);
      setProductsTotalPages(totalPages);

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
      console.error('Ошибка загрузки товара:', err);
      setError('Не удалось загрузить товар. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  // Получаем текущие данные для отображения
  const getCurrentData = () => {
    if (selectedProductId && selectedProduct) {
      return { type: 'product', data: selectedProduct };
    }

    if (currentCategoryId && currentProducts.length > 0) {
      return { type: 'products', data: currentProducts };
    }

    if (currentCategoryId) {
      const subcategories = categories.filter(cat => cat.parentId === currentCategoryId);
      if (subcategories.length > 0) {
        return { type: 'categories', data: subcategories };
      }
    }

    const rootCategories = categories.filter(cat => cat.parentId === null);
    return { type: 'categories', data: rootCategories };
  };

  // Навигация по категории
  const handleCategoryClick = async (category) => {
    setCurrentCategoryId(category.id);
    setNavigationPath([...navigationPath, { id: category.id, name: category.name }]);

    const hasSubcategories = categories.some(cat => cat.parentId === category.id);

    if (!hasSubcategories) {
      await loadCategoryProducts(category.id, 1);
    } else {
      setCurrentProducts([]);
      setProductsPage(1);
      setProductsTotalPages(1);
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
      setProductsTotalPages(1);
    } else {
      setCurrentCategoryId(categoryId);
      setSelectedProductId(null);
      setSelectedProduct(null);
      setNavigationPath(navigationPath.slice(0, index + 1));
      await loadCategoryProducts(categoryId, 1);
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
      {!selectedProductId && (
        <div className="catalog-header">
          <Breadcrumbs path={navigationPath} onNavigate={handleNavigate} />
          <button className="home-button" onClick={handleGoHome}>
            🏠 Главное меню
          </button>
        </div>
      )}

      {type === 'product' && (
        <ProductDetail
          product={data}
          onBack={handleBackFromProduct}
          onAddToCart={handleAddToCart}
          cartItems={cart}
        />
      )}

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

              {categoriesTotalPages > 1 && (
                <Pagination
                  currentPage={categoriesPage}
                  totalPages={categoriesTotalPages}
                  onPageChange={(page) => loadCategories(page)}
                  loading={loading}
                />
              )}
            </>
          )}
        </div>
      )}

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

              {productsTotalPages > 1 && (
                <Pagination
                  currentPage={productsPage}
                  totalPages={productsTotalPages}
                  onPageChange={(page) => loadCategoryProducts(currentCategoryId, page)}
                  loading={loading}
                />
              )}
            </>
          )}
        </div>
      )}

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