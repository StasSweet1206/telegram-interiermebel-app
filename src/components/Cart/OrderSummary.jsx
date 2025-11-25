import React from 'react';
import { CreditCard, Truck, Gift } from 'lucide-react';
import './OrderSummary.css';

const OrderSummary = ({ 
  subtotal, 
  delivery, 
  total, 
  itemsCount,
  onCheckout, 
  isProcessing,
  onHaptic 
}) => {
  const isFreeDelivery = delivery === 0;
  const deliveryThreshold = 1000;
  const deliveryProgress = Math.min((subtotal / deliveryThreshold) * 100, 100);

  return (
    <div className="order-summary">
      {/* Прогресс бесплатной доставки */}
      {!isFreeDelivery && (
        <div className="delivery-progress-section">
          <div className="delivery-progress-header">
            <Truck size={20} />
            <span>До бесплатной доставки</span>
          </div>
          <div className="delivery-progress-bar">
            <div 
              className="delivery-progress-fill"
              style={{ width: `${deliveryProgress}%` }}
            />
          </div>
          <p className="delivery-progress-text">
            Добавьте товаров ещё на <strong>{(deliveryThreshold - subtotal).toLocaleString()} ₽</strong>
          </p>
        </div>
      )}

      {isFreeDelivery && (
        <div className="free-delivery-badge">
          <Gift size={20} />
          <span>Бесплатная доставка!</span>
        </div>
      )}

      {/* Детали заказа */}
      <div className="order-details">
        <h3 className="order-details-title">Детали заказа</h3>

        <div className="order-detail-row">
          <span className="order-detail-label">
            Товары ({itemsCount})
          </span>
          <span className="order-detail-value">
            {subtotal.toLocaleString()} ₽
          </span>
        </div>

        <div className="order-detail-row">
          <span className="order-detail-label">
            Доставка
          </span>
          <span className={`order-detail-value ${isFreeDelivery ? 'free' : ''}`}>
            {isFreeDelivery ? 'Бесплатно' : `${delivery.toLocaleString()} ₽`}
          </span>
        </div>

        <div className="order-detail-divider" />

        <div className="order-detail-row total">
          <span className="order-detail-label">
            Итого
          </span>
          <span className="order-detail-value">
            {total.toLocaleString()} ₽
          </span>
        </div>
      </div>

      {/* Кнопка оформления */}
      <button
        className="checkout-button"
        onClick={() => {
          onHaptic?.('success');
          onCheckout();
        }}
        disabled={isProcessing}
      >
        <CreditCard size={20} />
        <span>
          {isProcessing ? 'Обработка...' : 'Оформить заказ'}
        </span>
      </button>

      {/* Информация */}
      <div className="order-info">
        <p className="order-info-text">
          🔒 Безопасная оплата
        </p>
        <p className="order-info-text">
          📦 Доставка 1-3 дня
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;