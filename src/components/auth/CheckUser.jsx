// frontend/src/components/auth/CheckUser.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CheckUser.css';

const CheckUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // Получаем данные Telegram
      const tg = window.Telegram.WebApp;
      const user = tg.initDataUnsafe?.user;

      if (!user?.id) {
        setError('Не удалось получить данные Telegram');
        setLoading(false);
        return;
      }

      // Проверяем пользователя на бэкенде
      const response = await axios.post('http://localhost:8000/api/check-user/', {
        telegram_id: user.id
      });

      if (response.data.exists) {
        // Пользователь найден → Главное меню
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/main-menu');
      } else {
        // Пользователь НЕ найден → Форма входа
        navigate('/login');
      }
    } catch (err) {
      console.error('Ошибка проверки пользователя:', err);
      setError('Ошибка подключения к серверу');
      setLoading(false);
    }
  };

  return (
    <div className="check-user-container">
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Проверяем данные...</p>
        </div>
      ) : (
        <div className="error">
          <p>{error}</p>
          <button onClick={() => navigate('/login')}>
            Перейти к входу
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckUser;