import React from 'react';
import { ChevronRight, Calendar, DollarSign } from 'lucide-react';
import { getStatusColor, getStatusGradient } from './mockOrders';
import './OrderCard.css';

const OrderCard = ({ order, onClick }) => {
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

  return (
    <div 
      className="order-card"
      onClick={onClick}
    >
      {/* Статус-индикатор */}
      <div 
        className="order-card-status-bar"
        style={{ background: getStatusGradient(order.status) }}
      />

      <div className="order-card-content">
        {/* Заголовок */}
        <div className="order-card-header">
          <div className="order-card-header-left">
            <span className="order-card-status-icon">
              {getStatusIcon(order.status)}
            </span>
            <div>
              <h3 className="order-card-number">Заказ {order.number}</h3>
              <span 
                className="order-card-status"
                style={{ color: getStatusColor(order.status) }}
              >
                {order.statusText}
              </span>
            </div>
          </div>
          <ChevronRight 
            size={24} 
            className="order-card-arrow"
            color="var(--tg-theme-hint-color, #999)"
          />
        </div>

        {/* Информация */}
        <div className="order-card-info">
          <div className="order-card-info-item">
            <Calendar size={16} />
            <span>{formatDate(order.date)}</span>
          </div>
          <div className="order-card-info-item">
            <DollarSign size={16} />
            <span className="order-card-total">
              {order.total.toLocaleString()} ₽
            </span>
          </div>
        </div>

        {/* Превью товаров */}
        <div className="order-card-items-preview">
          <div className="order-card-images">
            {order.items.slice(0, 3).map((item, index) => (
              <div 
                key={index}
                className="order-card-image"
                style={{ zIndex: 3 - index }}
              >
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <span>📦</span>
                )}
              </div>
            ))}
          </div>
          <span className="order-card-items-count">
            {order.items.length} {order.items.length === 1 ? 'товар' : 'товара'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;