import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import OrdersList from './OrdersList';
import OrderDetail from './OrderDetail';
import { mockOrders } from './mockOrders';
import './Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders] = useState(mockOrders);

  // Тактильная обратная связь
  const hapticFeedback = (style = 'light') => {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      switch (style) {
        case 'light':
          window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
          break;
        case 'medium':
          window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
          break;
        case 'heavy':
          window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
          break;
        default:
          window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      }
    }
  };

  // Выбор заказа
  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    hapticFeedback('light');
  };

  // Возврат к списку
  const handleBackToList = () => {
    setSelectedOrder(null);
    hapticFeedback('light');
  };

  // Возврат в главное меню
  const handleBackToMenu = () => {
    hapticFeedback('light');
    navigate('/');
  };

  return (
    <div className="orders">
      {/* Шапка */}
      <div className="orders-header">
        <button 
          className="back-button"
          onClick={selectedOrder ? handleBackToList : handleBackToMenu}
        >
          <ArrowLeft size={24} />
          <span>{selectedOrder ? 'К списку заказов' : 'Главное меню'}</span>
        </button>

        <div className="orders-header-content">
          <div className="orders-header-icon">
            <Package size={32} />
          </div>
          <div>
            <h1 className="orders-title">
              {selectedOrder ? `Заказ ${selectedOrder.number}` : 'Мои заказы'}
            </h1>
            <p className="orders-subtitle">
              {selectedOrder 
                ? new Date(selectedOrder.date).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })
                : `Всего заказов: ${orders.length}`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Контент */}
      <div className="orders-content">
        {selectedOrder ? (
          <OrderDetail 
            order={selectedOrder}
            onBack={handleBackToList}
          />
        ) : (
          <OrdersList 
            orders={orders}
            onSelectOrder={handleSelectOrder}
          />
        )}
      </div>
    </div>
  );
};

export default Orders;