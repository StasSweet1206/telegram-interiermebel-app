import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainMenu.css';
import { ShoppingBag, Package, ShoppingCart } from 'lucide-react';

const MainMenu = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 1,
      title: 'Каталог',
      subtitle: 'Просмотр товаров',
      icon: <ShoppingBag size={40} />,
      path: '/catalog',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#667eea'
    },
    
    {
      id: 2,
      title: 'Заказы',
      subtitle: 'История покупок',
      icon: <Package size={40} />,
      path: '/orders',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: '#f093fb'
    },
    {
      id: 3,
      title: 'Корзина',
      subtitle: 'Ваши товары',
      icon: <ShoppingCart size={40} />,
      path: '/cart',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: '#4facfe'
    }
  ];

  const handleNavigation = (path) => {
    // Добавляем тактильную вибрацию (работает в Telegram)
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
    navigate(path);
  };

  return (
    <div className="main-menu">
      <div className="menu-header">
        <h1 className="menu-title">Добро пожаловать!</h1>
        <p className="menu-subtitle">Выберите раздел для продолжения</p>
      </div>

      <div className="menu-grid">
        {menuItems.map((item, index) => (
          <div
            key={item.id}
            className="menu-card"
            onClick={() => handleNavigation(item.path)}
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className="card-gradient" style={{ background: item.gradient }}></div>
            <div className="card-content">
              <div className="icon-wrapper" style={{ color: item.color }}>
                {item.icon}
              </div>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-subtitle">{item.subtitle}</p>
            </div>
            <div className="card-shine"></div>
          </div>
        ))}
      </div>

      <div className="menu-footer">
        <div className="footer-stats">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Товаров</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Клиентов</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;