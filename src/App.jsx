import React, { useEffect } from 'react';
import Header from './components/Header';
import Login from './components/Login';
//import './App.css';

function App() {
  useEffect(() => {
    // Инициализация Telegram Web App
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready(); // Сообщаем Telegram что приложение готово
      tg.expand(); // Разворачиваем на весь экран
      
      // Дополнительные настройки (опционально)
      tg.enableClosingConfirmation(); // Подтверждение при закрытии
      tg.headerColor = '#ffffff'; // Цвет хедера
      tg.backgroundColor = '#ffffff'; // Цвет фона
    }
  }, []);

  return (
    <div className="App">
      <Header />
      <Login />
    </div>
  );
}

export default App;