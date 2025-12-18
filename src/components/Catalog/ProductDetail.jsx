import React, { useState, useEffect } from 'react';
import './ProductDetail.css';

const ProductDetail = ({ product, onBack, onAddToCart, cartItems }) => {
  // Состояние для выбранной характеристики
  const [selectedChar, setSelectedChar] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Инициализация выбранной характеристики
  useEffect(() => {
    if (product.hasCharacteristics && product.characteristics.length > 0) {
      setSelectedChar(product.characteristics[0]);
    }
  }, [product]);

  // Получаем данные в зависимости от наличия характеристик
  const currentImage = selectedChar ? selectedChar.image : product.image;
  const currentPrice = selectedChar ? selectedChar.price : product.basePrice;
  const currentStock = selectedChar ? selectedChar.stock : product.stock;

  // Получаем ID для корзины
  const getCartItemId = () => {
    if (selectedChar) {
      return `${product.id}_${selectedChar.id}`;
    }
    return product.id;
  };

  // Проверяем сколько уже в корзине
  const getCartQuantity = () => {
    const cartItemId = getCartItemId();
    const cartItem = cartItems.find(item => item.id === cartItemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const cartQuantity = getCartQuantity();
  const availableStock = currentStock - cartQuantity;

  // Обработка изменения количества
  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= availableStock) {
      setQuantity(newQuantity);
    }
  };

  // Добавление в корзину
  const handleAddToCart = () => {
    if (availableStock <= 0) return;

    const cartItem = {
      id: getCartItemId(),
      productId: product.id,
      name: product.name,
      characteristicId: selectedChar ? selectedChar.id : null,
      characteristicName: selectedChar ? selectedChar.name : null,
      price: currentPrice,
      quantity: quantity,
      image: currentImage
    };

    onAddToCart(cartItem);

    // Сброс количества после добавления
    setQuantity(1);
  };

  return (
    <div className="product-detail">
      {/* Шапка с кнопкой назад */}
      <div className="product-detail-header">
        <button className="back-button" onClick={onBack}>
          ← Назад
        </button>
      </div>

      {/* Изображение товара */}
      <div className="product-detail-image-container">
        {currentImage ? (
          <img src={currentImage} alt={product.name} className="product-detail-image" />
        ) : (
          <div className="product-detail-no-image">
            <span>📦</span>
            <span>Нет фото</span>
          </div>
        )}
      </div>

      {/* Информация о товаре */}
      <div className="product-detail-content">
        <h1 className="product-detail-name">{product.name}</h1>

        {product.description && (
          <p className="product-detail-description">{product.description}</p>
        )}

        {/* Выбор характеристик */}
        {product.hasCharacteristics && product.characteristics.length > 0 && (
          <div className="product-characteristics">
            <h3 className="characteristics-title">Выберите вариант:</h3>
            <div className="characteristics-list">
              {product.characteristics.map((char) => (
                <button
                  key={char.id}
                  className={`characteristic-button ${selectedChar?.id === char.id ? 'active' : ''} ${char.stock === 0 ? 'disabled' : ''}`}
                  onClick={() => char.stock > 0 && setSelectedChar(char)}
                  disabled={char.stock === 0}
                >
                  <span className="char-name">{char.name}</span>
                  <span className="char-price">{char.price.toLocaleString('ru-RU')} ₽</span>
                  {char.stock === 0 && (
                    <span className="char-out-of-stock">Нет в наличии</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Цена и остаток */}
        <div className="product-detail-info">
          <div className="product-detail-price">
            {(currentPrice || 0).toLocaleString('ru-RU')} ₽
          </div>

          <div className={`product-detail-stock ${availableStock === 0 ? 'out-of-stock' : ''}`}>
            {availableStock > 0 ? (
              <>
                В наличии: <strong>{availableStock} шт</strong>
                {cartQuantity > 0 && (
                  <span className="in-cart-badge">В корзине: {cartQuantity}</span>
                )}
              </>
            ) : (
              'Нет в наличии'
            )}
          </div>
        </div>

        {/* Выбор количества и добавление в корзину */}
        {availableStock > 0 && (
          <div className="product-detail-actions">
            <div className="quantity-selector">
              <button
                className="quantity-button"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="quantity-value">{quantity}</span>
              <button
                className="quantity-button"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= availableStock}
              >
                +
              </button>
            </div>

            <button
              className="add-to-cart-button"
              onClick={handleAddToCart}
            >
              Добавить в корзину
            </button>
          </div>
        )}

        {availableStock === 0 && (
          <div className="out-of-stock-message">
            К сожалению, товар закончился
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;