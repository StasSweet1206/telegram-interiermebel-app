import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Catalog.css';
import { getCategories, getCategoryProducts } from '../../services/api';
import { adaptCategoriesData, adaptProductsData } from '../../services/catalogAdapter';

function Catalog() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка категорий при монтировании компонента
  useEffect(() => {
    loadCategories();
  }, []);

  // Загрузка категорий
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories();
      const adaptedCategories = adaptCategoriesData(data);
      setCategories(adaptedCategories);

      // Автоматически выбираем первую категорию
      if (adaptedCategories.length > 0) {
        handleCategoryClick(adaptedCategories[0]);
      }
    } catch (err) {
      console.error('Ошибка загрузки категорий:', err);
      setError('Не удалось загрузить категории');
    } finally {
      setLoading(false);
    }
  };

  // Обработчик клика на категорию
  const handleCategoryClick = async (category) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedCategory(category);

      const data = await getCategoryProducts(category.id);
      const adaptedProducts = adaptProductsData(data);
      setProducts(adaptedProducts);
    } catch (err) {
      console.error('Ошибка загрузки товаров:', err);
      setError('Не удалось загрузить товары категории');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Обработчик клика на товар
  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  if (loading && categories.length === 0) {
    return (
      <div className="catalog-container">
        <div className="loading">Загрузка каталога...</div>
      </div>
    );
  }

  if (error && categories.length === 0) {
    return (
      <div className="catalog-container">
        <div className="error">{error}</div>
        <button onClick={loadCategories} className="retry-button">
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="catalog-container">
      <h1 className="catalog-title">Каталог</h1>

      {/* Список категорий */}
      <div className="categories-section">
        <h2>Категории</h2>
        <div className="categories-list">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-item ${selectedCategory?.id === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Список товаров */}
      {selectedCategory && (
        <div className="products-section">
          <h2>{selectedCategory.name}</h2>

          {loading ? (
            <div className="loading">Загрузка товаров...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : products.length === 0 ? (
            <div className="no-products">В этой категории пока нет товаров</div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="product-image">
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    {product.hasVariants && (
                      <span className="variants-badge">
                        {product.variants.length} вариантов
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Catalog;