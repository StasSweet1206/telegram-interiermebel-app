import React, { useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import MainMenu from './components/MainMenu/MainMenu'; 
import Catalog from './components/Catalog/Catalog'; 
// import Orders from './components/Orders/Orders'; 
// import Cart from './components/Cart/Cart'; 
import './App.css'; 

function App() { 
  useEffect(() => { 
    // Инициализация Telegram WebApp 
    if (window.Telegram?.WebApp) { 
      const tg = window.Telegram.WebApp; 

      // ОБЯЗАТЕЛЬНО: Готовность приложения
      tg.ready();

      // ОБЯЗАТЕЛЬНО: Разворачиваем на весь экран
      tg.expand();

      // Включаем подтверждение закрытия
      tg.enableClosingConfirmation();

      // Разрешаем вертикальные свайпы (для скролла)
      if (tg.disableVerticalSwipes !== undefined) {
        tg.disableVerticalSwipes = false;
      }

      // Устанавливаем цвета ТОЛЬКО если поддерживается
      try {
        const version = parseFloat(tg.version);
        if (!isNaN(version) && version >= 6.1) {
          tg.setHeaderColor('bg_color');
          tg.setBackgroundColor('#f8f9fa');
        }
      } catch (e) {
        console.log('Цвета не поддерживаются в этой версии Telegram');
      }

      // Логируем информацию для отладки
      console.log('Telegram WebApp initialized:', {
        version: tg.version,
        platform: tg.platform,
        colorScheme: tg.colorScheme,
        isExpanded: tg.isExpanded,
        viewportHeight: tg.viewportHeight,
        viewportStableHeight: tg.viewportStableHeight
      });
    } else {
      console.error('Telegram WebApp не найден!');
    }
  }, []); 

  return ( 
    <Router basename="/">
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