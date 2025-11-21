// frontend/src/components/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    inn: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // РЕГИСТРАЦИЯ
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.password || !formData.inn) {
      setError('Заполните все поля');
      return;
    }

    setLoading(true);
    try {
      const tg = window.Telegram.WebApp;
      const user = tg.initDataUnsafe?.user;

      const response = await axios.post('http://localhost:8000/api/register/', {
        telegram_id: user.id,
        name: formData.name,
        password: formData.password,
        inn: formData.inn
      });

      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/main-menu');
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError('Ошибка регистрации');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ГОСТЬ
  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      const tg = window.Telegram.WebApp;
      const user = tg.initDataUnsafe?.user;

      const response = await axios.post('http://localhost:8000/api/guest-login/', {
        telegram_id: user.id
      });

      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/guest-menu');
      }
    } catch (err) {
      setError('Ошибка входа как гость');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🔐 Вход в систему</h1>

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Логин</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Введите логин"
            />
          </div>

          <div className="input-group">
            <label>Пароль</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите пароль"
            />
          </div>

          <div className="input-group">
            <label>ИНН</label>
            <input
              type="text"
              name="inn"
              value={formData.inn}
              onChange={handleChange}
              placeholder="Введите ИНН"
              maxLength="12"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="btn-register"
            disabled={loading}
          >
            {loading ? 'Загрузка...' : '✅ Регистрация'}
          </button>
        </form>

        <div className="divider">или</div>

        <button 
          onClick={handleGuestLogin}
          className="btn-guest"
          disabled={loading}
        >
          👤 Зайти как гость
        </button>
      </div>
    </div>
  );
};

export default Login;