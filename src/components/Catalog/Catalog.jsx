import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, getCategoryProducts, getProduct, getProducts } from '../../services/catalog';
import CatalogHeader from './CatalogHeader';
import CategoryCard from './CategoryCard';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
import Breadcrumbs from './Breadcrumbs';
import Pagination from './Pagination';
import './Catalog.css';

const Catalog = () => {
  const navigate = useNavigate();

  // Состояние категорий
  const [categories, setCategories] = useState([]);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [navigationPath, setNavigationPath] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  // Состояние товаров
  const [currentProducts, setCurrentProducts] = useState([]);
  const [productsPage, setProductsPage] = useState(1);
  const [productsTotalPages, setProductsTotalPages] = useState(1);

  // Состояние выбранного товара
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Состояние корзины
  const [cart, setCart] = useState([]);

  // Состояние загрузки и ошибок
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ ИСПРАВЛЕНО: Адаптер категории использует parentId
  const adaptCategory = (category) => ({
    id: category.id,
    name: category.name,
    code1c: category.code_1c,
    parentId: category.parent_id, // ✅ Используем parent_id
    imageUrl: category.image || null,
    description: category.description || '',
    productsCount: category.products_count || 0,
    hasChildren: category.has_children || false,
    order: category.order || 0
  });

  // Адаптер товара
  const adaptProduct = (product) => ({
    id: product.id,
    name: product.name,
    code1c: product.code_1c,
    article: product.article || '',
    price: parseFloat(product.price) || 0,
    oldPrice: product.old_price ? parseFloat(product.old_price) : null,
    currency: product.currency || 'BYN',
    imageUrl: product.image || null,
    images: product.images || [],
    description: product.description || '',
    specifications: product.specifications || {},
    inStock: product.in_stock !== undefined ? product.in_stock : true,
    stockQuantity: product.stock_quantity || 0,
    categoryId: product.category_id,
    categoryName: product.category_name || '',
    unit: product.unit || 'шт',
    minOrder: product.min_order || 1,
    stepOrder: product.step_order || 1
  });

  // Загрузка корневых категорий
  const loadRootCategories = useCallback(async () => {
    console.log('🌳 Загружаем корневые категории');
    setIsLoading(true);

    try {
      const data = await getCategories(null, 1, 100);

      console.log('✅ Получено корневых категорий:', data.categories.length);
      console.log('📋 Первая категория:', data.categories[0]);

      setCategories(data.categories);  // ✅ Берем из data.categories
    } catch (error) {
      console.error('❌ Ошибка загрузки корневых категорий:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ ИСПРАВЛЕНО: Загрузка подкатегорий
  const loadSubcategories = useCallback(async (parentId) => {
    console.log('📂 Загружаем подкатегории для родителя ID:', parentId);
    setIsLoading(true);

    try {
      const data = await getCategories(parentId, 1, 100);

      console.log('✅ Получено подкатегорий:', data.categories.length);

      // ✅ ИСПРАВЛЕНИЕ: НЕ сбрасываем categories, если подкатегорий нет
      if (data.categories.length > 0) {
        setCategories(data.categories);
      }
      // Если подкатегорий нет, categories остаются прежними (не сбрасываются)

      return data.categories;
    } catch (error) {
      console.error('❌ Ошибка загрузки подкатегорий:', error);
      setError(error.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Загрузка товаров категории
  const loadCategoryProducts = async (categoryCode, page = 1) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🛒 Загружаем товары категории code1c:', categoryCode, 'страница:', page);

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

  // Загрузка товаров категории
  const loadProducts = useCallback(async (categoryCode1c, categoryId) => {
    console.log('🛒 Загружаем товары для категории:', categoryCode1c);
    console.log('🆔 ID категории:', categoryId);

    setIsLoading(true);
    setCurrentProducts([]);

    try {
      const filters = {
        category_id: categoryId, // ✅ ИСПРАВЛЕНО: используем ID вместо code_1c
        page: 1,
        page_size: 20
      };

      console.log('📤 Фильтры для загрузки товаров:', filters);

      const data = await getProducts(filters);

      console.log('✅ Получено товаров:', data.products.length);
      setCurrentProducts(data.products);

      return data.products;
    } catch (error) {
      console.error('❌ Ошибка загрузки товаров:', error);
      console.log('📋 Детали ошибки:', error.response?.data);
      setError(error.message);
      setCurrentProducts([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  // ✅ ИСПРАВЛЕНО: Загрузка товаров при изменении категории
  useEffect(() => {
    console.log('🔄 useEffect: currentCategoryId изменился:', currentCategoryId);
    console.log('📊 Текущее состояние:');
    console.log('  - currentProducts.length:', currentProducts.length);
    console.log('  - categories.length:', categories.length);

    if (currentCategoryId && currentProducts.length === 0) {
      const currentCategory = categories.find(cat => cat.id === currentCategoryId);
      console.log('🔍 Найдена категория:', currentCategory);

      if (currentCategory) {
        const subcategories = categories.filter(cat => cat.parentId === currentCategory.id);
        console.log('📁 Найдено подкатегорий в памяти:', subcategories.length);

        if (subcategories.length === 0 && currentCategory.hasChildren) {
          console.log('📂 Подкатегории должны быть - загружаем');
          loadSubcategories(currentCategory.id);
        } else if (subcategories.length === 0 && !currentCategory.hasChildren) {
          console.log('🛒 Загружаем товары для категории code1c:', currentCategory.code1c);
          if (currentCategory.code1c) {
            loadCategoryProducts(currentCategory.code1c, 1);
          }
        } else {
          console.log('✅ Подкатегории есть - НЕ загружаем товары');
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategoryId, currentProducts.length]); // ✅ БЕЗ categories
  const getCurrentData = () => {
    console.log('🎯 getCurrentData вызван');
    console.log('📊 Состояние:');
    console.log('  - selectedProductId:', selectedProductId);
    console.log('  - selectedProduct:', selectedProduct);
    console.log('  - currentCategoryId:', currentCategoryId);
    console.log('  - currentProducts.length:', currentProducts.length);
    console.log('  - categories.length:', categories.length);

    // 1️⃣ Если выбран конкретный товар - показываем его детали
    if (selectedProductId && selectedProduct) {
      console.log('✅ Показываем ДЕТАЛИ ТОВАРА:', selectedProduct.name);
      return { type: 'product', data: selectedProduct };
    }

    // 2️⃣ Если есть товары - показываем список товаров
    if (currentProducts.length > 0) {
      console.log('✅ Показываем СПИСОК ТОВАРОВ:', currentProducts.length);
      return { type: 'products', data: currentProducts };
    }

    // 3️⃣ В остальных случаях показываем категории
    console.log('✅ Показываем КАТЕГОРИИ:', categories.length);
    return { type: 'categories', data: categories };
  };

  const handleCategoryClick = async (category) => {
    console.log('🔍 Клик по категории:', category);
    console.log('📌 Полная информация:', {
      id: category.id,
      name: category.name,
      code1c: category.code1c,
      hasChildren: category.hasChildren,
      productsCount: category.productsCount
    });

    setCurrentCategoryId(category.id);
    setSelectedProductId(null);
    setSelectedProduct(null);
    setCurrentProducts([]); // ✅ ДОБАВЛЕНО: очищаем товары

    // Добавляем в хлебные крошки
    setBreadcrumbs(prev => [...prev, {
      id: category.id,
      name: category.name,
      code1c: category.code1c
    }]);

    // Сначала пробуем загрузить подкатегории
    console.log('📂 Загружаем подкатегории для категории ID:', category.id);
    const subcategories = await loadSubcategories(category.id);

    // Если подкатегорий нет - загружаем товары
    if (!subcategories || subcategories.length === 0) {
      console.log('📦 Подкатегорий нет, загружаем товары');
      console.log('🔑 Используем ID:', category.id); // ✅ ИСПРАВЛЕНО: используем ID

      if (category.id) {
        await loadProducts(category.code1c, category.id); // ✅ ИСПРАВЛЕНО: передаем оба параметра
      } else {
        console.error('❌ У категории нет ID!');
      }
    } else {
      console.log('📁 Показываем подкатегории:', subcategories.length);
    }
  };

  // ✅ ИСПРАВЛЕНО: Возврат на уровень выше
  const handleBackClick = () => {
    console.log('⬅️ Возврат назад');

    if (navigationPath.length > 0) {
      const newPath = [...navigationPath];
      newPath.pop();
      setNavigationPath(newPath);

      if (newPath.length > 0) {
        // Возвращаемся к предыдущей категории
        const previousCategory = newPath[newPath.length - 1];

        setCurrentCategoryId(previousCategory.id);
        loadSubcategories(previousCategory.id);

        const prevCat = categories.find(c => c.id === previousCategory.id);
        if (prevCat?.code1c) {
          loadCategoryProducts(prevCat.code1c, 1);
        }
      } else {
        // Возвращаемся к корню
        setCurrentCategoryId(null);
        setCurrentProducts([]);
      }
    }

    setSelectedProductId(null);
    setSelectedProduct(null);
  };

  // ✅ ИСПРАВЛЕНО: Навигация по хлебным крошкам
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
      const newPath = navigationPath.slice(0, index + 1);
      setNavigationPath(newPath);

      const targetCategory = newPath[newPath.length - 1];
      setCurrentCategoryId(targetCategory.id);

      // ✅ ИСПРАВЛЕНО: Проверяем подкатегории по parentId
      const subcategories = categories.filter(cat => cat.parentId === targetCategory.id);

      if (subcategories.length === 0) {
        // ✅ ИСПРАВЛЕНО: Загружаем товары по code1c
        const category = categories.find(c => c.id === targetCategory.id);
        if (category?.code1c) {
          loadCategoryProducts(category.code1c, 1);
        }
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
      <CatalogHeader
        currentView={type}
        selectedCategory={currentCategoryId ? categories.find(c => c.id === currentCategoryId) : null}
        selectedProduct={selectedProduct}
        onBack={(action) => {
          if (action === 'menu') {
            handleGoHome();
          } else if (action === 'root') {
            setNavigationPath([]);
            setCurrentCategoryId(null);
            setCurrentProducts([]);
            setProductsPage(1);
            setSelectedProductId(null);
            setSelectedProduct(null);
            loadRootCategories();
          } else if (action === 'category') {
            handleBackFromProduct();
          }
        }}
      />

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
                    if (category?.code1c) {
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