import React from 'react';
import OrderCard from './OrderCard';
import { Package } from 'lucide-react';
import './OrdersList.css';

const OrdersList = ({ orders, onSelectOrder }) => {
  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <div className="orders-empty-icon">
          <Package size={80} />
        </div>
        <h2 className="orders-empty-title">Заказов пока нет</h2>
        <p className="orders-empty-text">
          Когда вы оформите первый заказ, он появится здесь
        </p>
      </div>
    );
  }

  return (
    <div className="orders-list">
      <div className="orders-list-header">
        <h2 className="orders-list-title">История заказов</h2>
        <p className="orders-list-subtitle">
          Нажмите на заказ, чтобы посмотреть детали
        </p>
      </div>

      <div className="orders-list-items">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onClick={() => onSelectOrder(order)}
          />
        ))}
      </div>
    </div>
  );
};

export default OrdersList;