import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './components/MainMenu/MainMenu';
// import Catalog from './components/Catalog/Catalog';
// import Orders from './components/Orders/Orders';
// import Cart from './components/Cart/Cart';
import './App.css';

function App() {
  useEffect(() => {
    // Инициализация Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      // Устанавливаем цвета темы
      tg.setHeaderColor('#667eea');
      tg.setBackgroundColor('#f8f9fa');
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainMenu />} />
          {/* Раскомментируйте когда создадите эти компоненты */}
          {/* <Route path="/catalog" element={<Catalog />} /> */}
          {/* <Route path="/orders" element={<Orders />} /> */}
          {/* <Route path="/cart" element={<Cart />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;