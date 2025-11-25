import React from 'react';
import { Calendar, MapPin, Package, DollarSign } from 'lucide-react';
import { getStatusColor, getStatusGradient } from './mockOrders';
import './OrderDetail.css';

const OrderDetail = ({ order, onBack }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    const icons = {
      delivered: '✅',
      processing: '⏳',
      shipped: '🚚',
      cancelled: '❌',
      pending: '⏰'
    };
    return icons[status] || '📦';
  };

  // Расчет итоговой суммы товаров
  const itemsTotal = order.items.reduce((sum, item) => sum + item.sum, 0);

  return (
    <div className="order-detail">
      {/* Статус заказа */}
      <div 
        className="order-detail-status-card"
        style={{ background: getStatusGradient(order.status) }}
      >
        <div className="order-detail-status-icon">
          {getStatusIcon(order.status)}
        </div>
        <div className="order-detail-status-info">
          <h2 className="order-detail-status-title">{order.statusText}</h2>
          <p className="order-detail-status-subtitle">
            Заказ {order.number}
          </p>
        </div>
      </div>

      {/* Основная информация */}
      <div className="order-detail-card">
        <h3 className="order-detail-card-title">
          <Package size={20} />
          <span>Информация о заказе</span>
        </h3>

        <div className="order-detail-info-grid">
          <div className="order-detail-info-item">
            <Calendar size={18} />
            <div>
              <span className="order-detail-info-label">Дата заказа</span>
              <span className="order-detail-info-value">
                {formatDate(order.date)}
              </span>
            </div>
          </div>

          <div className="order-detail-info-item">
            <MapPin size={18} />
            <div>
              <span className="order-detail-info-label">Адрес доставки</span>
              <span className="order-detail-info-value">
                {order.deliveryAddress}
              </span>
            </div>
          </div>

          <div className="order-detail-info-item">
            <DollarSign size={18} />
            <div>
              <span className="order-detail-info-label">Сумма заказа</span>
              <span className="order-detail-info-value order-detail-total">
                {order.total.toLocaleString()} ₽
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Состав заказа */}
      <div className="order-detail-card">
        <h3 className="order-detail-card-title">
          <Package size={20} />
          <span>Состав заказа</span>
        </h3>

        {/* Товары */}
        <div className="order-detail-items">
          {order.items.map((item, index) => (
            <div key={index} className="order-detail-item">
              {/* Изображение */}
              <div className="order-detail-item-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <span>📦</span>
                )}
              </div>

              {/* Информация о товаре */}
              <div className="order-detail-item-info">
                <h4 className="order-detail-item-name">{item.name}</h4>

                {/* Характеристики */}
                {item.characteristic && Object.keys(item.characteristic).length > 0 && (
                  <div className="order-detail-item-characteristics">
                    {Object.entries(item.characteristic).map(([key, value]) => (
                      <span key={key} className="order-detail-item-char">
                        {key}: <strong>{value}</strong>
                      </span>
                    ))}
                  </div>
                )}

                {/* Цена и количество */}
                <div className="order-detail-item-pricing">
                  <div className="order-detail-item-price-block">
                    <span className="order-detail-item-price">
                      {item.price.toLocaleString()} ₽
                    </span>
                    <span className="order-detail-item-quantity">
                      × {item.quantity} шт.
                    </span>
                  </div>
                  <span className="order-detail-item-sum">
                    {item.sum.toLocaleString()} ₽
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Итоговая таблица */}
        <div className="order-detail-summary">
          <div className="order-detail-summary-row">
            <span className="order-detail-summary-label">
              Товары ({order.items.length})
            </span>
            <span className="order-detail-summary-value">
              {itemsTotal.toLocaleString()} ₽
            </span>
          </div>

          <div className="order-detail-summary-row">
            <span className="order-detail-summary-label">
              Доставка
            </span>
            <span className={`order-detail-summary-value ${order.delivery === 0 ? 'free' : ''}`}>
              {order.delivery === 0 ? 'Бесплатно' : `${order.delivery.toLocaleString()} ₽`}
            </span>
          </div>

          <div className="order-detail-summary-divider" />

          <div className="order-detail-summary-row total">
            <span className="order-detail-summary-label">
              Итого
            </span>
            <span className="order-detail-summary-value">
              {order.total.toLocaleString()} ₽
            </span>
          </div>
        </div>
      </div>

      {/* Скрытое поле с ID документа */}
      <input 
        type="hidden" 
        name="orderId" 
        value={order.id}
        data-order-id={order.id}
      />
    </div>
  );
};

export default OrderDetail;