import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import './CartItem.css';

const CartItem = ({ item, onUpdateQuantity, onRemove, onHaptic }) => {
  // Получаем данные товара
  const itemImage = item.characteristics 
    ? item.selectedCharacteristic.image || item.image
    : item.image;

  const itemPrice = item.price;
  const itemStock = item.characteristics 
    ? item.selectedCharacteristic.stock 
    : item.stock;

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
      onHaptic?.('light');
    }
  };

  const handleIncrease = () => {
    if (item.quantity < itemStock) {
      onUpdateQuantity(item.id, item.quantity + 1);
      onHaptic?.('light');
    }
  };

  const handleRemove = () => {
    onRemove(item.id);
    onHaptic?.('medium');
  };

  return (
    <div className="cart-item">
      {/* Изображение */}
      <div className="cart-item-image-container">
        {itemImage ? (
          <img 
            src={itemImage} 
            alt={item.name}
            className="cart-item-image"
          />
        ) : (
          <div className="cart-item-no-image">
            <span>📦</span>
          </div>
        )}
      </div>

      {/* Информация */}
      <div className="cart-item-info">
        <h3 className="cart-item-name">{item.name}</h3>

        {/* Характеристики */}
        {item.selectedCharacteristic && (
          <div className="cart-item-characteristics">
            {Object.entries(item.selectedCharacteristic.values).map(([key, value]) => (
              <span key={key} className="cart-item-char">
                {key}: <strong>{value}</strong>
              </span>
            ))}
          </div>
        )}

        {/* Цена и количество */}
        <div className="cart-item-bottom">
          <div className="cart-item-price-section">
            <span className="cart-item-price">{itemPrice.toLocaleString()} ₽</span>
            <span className="cart-item-total">
              {(itemPrice * item.quantity).toLocaleString()} ₽
            </span>
          </div>

          {/* Счетчик количества */}
          <div className="cart-item-quantity">
            <button
              className="quantity-button"
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
            >
              <Minus size={16} />
            </button>

            <span className="quantity-value">{item.quantity}</span>

            <button
              className="quantity-button"
              onClick={handleIncrease}
              disabled={item.quantity >= itemStock}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Остаток */}
        {itemStock < 10 && (
          <div className="cart-item-stock-warning">
            Осталось всего {itemStock} шт.
          </div>
        )}
      </div>

      {/* Кнопка удаления */}
      <button 
        className="cart-item-remove"
        onClick={handleRemove}
        title="Удалить из корзины"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default CartItem;