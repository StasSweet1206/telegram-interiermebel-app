// frontend/src/components/auth/GuestMenu.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GuestMenu.css';

const GuestMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="guest-menu-container">
      <div className="guest-header">
        <h1>👤 Гостевой режим</h1>
        <p>Ограниченный функционал</p>
      </div>

      <div className="guest-content">
        <div className="info-card">
          <h2>ℹ️ Доступно в гостевом режиме:</h2>
          <ul>
            <li>✅ Просмотр каталога</li>
            <li>✅ Поиск товаров</li>
            <li>❌ Оформление заказов</li>
            <li>❌ История покупок</li>
            <li>❌ Специальные цены</li>
          </ul>
        </div>

        <button 
          onClick={() => navigate('/catalog')}
          className="btn-catalog"
        >
          📦 Перейти в каталог
        </button>

        <button 
          onClick={() => navigate('/login')}
          className="btn-register-now"
        >
          🔐 Зарегистрироваться сейчас
        </button>
      </div>
    </div>
  );
};

export default GuestMenu;