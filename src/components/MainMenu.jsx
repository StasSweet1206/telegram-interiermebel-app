import React from 'react';

const MainMenu = () => {
  return (
    <div className="container">
      <h1>Главное меню</h1>
      <p>Добро пожаловать!</p>
      <button onClick={() => {
        localStorage.removeItem('token');
        window.location.reload();
      }}>
        Выйти
      </button>
    </div>
  );
};

export default MainMenu;