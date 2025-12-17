import { getCategories, getProducts } from '../../api/catalog';
import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onClick }) => {
  // Определяем изображение
  const getImage = () => {
    if (product.hasCharacteristics && product.characteristics.length > 0) {
      return product.characteristics[0].image;
    }
    return product.image;
  };

  // Определяем цену
  const getPrice = () => {
    if (product.hasCharacteristics && product.characteristics.length > 0) {
      return product.characteristics[0].price;
    }
    return product.basePrice;
  };

  // Определяем остаток
  const getStock = () => {
    if (product.hasCharacteristics && product.characteristics.length > 0) {
      const totalStock = product.characteristics.reduce((sum, char) => sum + char.stock, 0);
      return totalStock;
    }
    return product.stock;
  };

  const image = getImage();
  const price = getPrice();
  const stock = getStock();

  return (
    <div className="product-card" onClick={onClick}>
      <div className="product-image-container">
        {image ? (
          <img src={image} alt={product.name} className="product-image" />
        ) : (
          <div className="product-no-image">
            <span>📦</span>
            <span className="no-image-text">Нет фото</span>
          </div>
        )}
        {stock === 0 && (
          <div className="product-out-of-stock-badge">Нет в наличии</div>
        )}
      </div>

      <div className="product-card-info">
        <h4 className="product-card-name">{product.name}</h4>

        <div className="product-card-bottom">
          <div className="product-card-price">
            {price.toLocaleString('ru-RU')} ₽
          </div>

          <div className={`product-card-stock ${stock === 0 ? 'out-of-stock' : ''}`}>
            {stock > 0 ? `В наличии: ${stock}` : 'Нет в наличии'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;