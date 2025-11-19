import { useState, useEffect } from 'react';
import './Login.css';

function Login() {
  const [activeTab, setActiveTab] = useState('login'); 
  const [telegramUser, setTelegramUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(null); // null - проверяем, true - есть, false - нет
  const [isLoading, setIsLoading] = useState(true);

  // Форма регистрации
  const [inn, setInn] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Для авторизации
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // API URL вашего Django бэкенда
  const API_URL = 'https://your-django-backend.com/api'; // ЗАМЕНИТЕ НА ВАШ URL

  useEffect(() => {
    // Получаем данные пользователя из Telegram
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      const user = tg.initDataUnsafe?.user;

      if (user) {
        setTelegramUser(user);
        // Автоматически проверяем регистрацию по Telegram ID
        checkUserRegistration(user.id);
      } else {
        setError('Не удалось получить данные Telegram');
        setIsLoading(false);
      }
    } else {
      setError('Приложение должно быть открыто в Telegram');
      setIsLoading(false);
    }
  }, []);

  // Проверка регистрации пользователя по Telegram ID
  const checkUserRegistration = async (telegramId) => {
    try {
      const response = await fetch(`${API_URL}/check-user/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegram_id: telegramId
        })
      });

      const data = await response.json();

      if (data.registered) {
        // Пользователь уже зарегистрирован - автоматический вход
        setIsRegistered(true);
        setSuccess('Добро пожаловать! Автоматический вход выполнен.');
        // Здесь можно перенаправить на главную страницу или сохранить токен
        localStorage.setItem('user_token', data.token);
        // Можно перенаправить: window.location.href = '/catalog';
      } else {
        // Пользователь не зарегистрирован
        setIsRegistered(false);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Ошибка проверки регистрации:', err);
      setError('Ошибка подключения к серверу');
      setIsLoading(false);
    }
  };

  // Регистрация нового пользователя
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!inn || !username || !password) {
      setError('Заполните все поля');
      return;
    }

    if (!telegramUser?.id) {
      setError('Не удалось получить Telegram ID');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegram_id: telegramUser.id,
          inn: inn,
          username: username,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Регистрация успешна! Выполняется вход...');
        setIsRegistered(true);
        localStorage.setItem('user_token', data.token);
        // Перенаправление на главную через 2 секунды
        setTimeout(() => {
          // window.location.href = '/catalog';
        }, 2000);
      } else {
        setError(data.error || 'Ошибка регистрации');
      }
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      setError('Ошибка подключения к серверу');
    }
  };

  // Авторизация по логину и паролю (если не прошла автоматическая)
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!loginUsername || !loginPassword) {
      setError('Введите логин и пароль');
      return;
    }

    if (!telegramUser?.id) {
      setError('Не удалось получить Telegram ID');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegram_id: telegramUser.id,
          username: loginUsername,
          password: loginPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Вход выполнен успешно!');
        setIsRegistered(true);
        localStorage.setItem('user_token', data.token);
        // Перенаправление
        setTimeout(() => {
          // window.location.href = '/catalog';
        }, 1500);
      } else {
        setError(data.error || 'Неверный логин или пароль');
      }
    } catch (err) {
      console.error('Ошибка авторизации:', err);
      setError('Ошибка подключения к серверу');
    }
  };

  // Показываем загрузку
  if (isLoading) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2>Проверка регистрации...</h2>
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  // Если пользователь уже зарегистрирован (автоматический вход)
  if (isRegistered === true) {
    return (
      <div className="login-container">
        <div className="login-card success-card">
          <h2>✅ Добро пожаловать!</h2>
          {telegramUser && (
            <div className="user-info">
              <p><strong>Имя:</strong> {telegramUser.first_name} {telegramUser.last_name || ''}</p>
              <p><strong>Username:</strong> @{telegramUser.username || 'не указан'}</p>
            </div>
          )}
          <p className="success-message">{success}</p>
          <button className="btn-primary" onClick={() => window.location.href = '/catalog'}>
            Перейти в каталог
          </button>
        </div>
      </div>
    );
  }

  // Форма регистрации/авторизации
  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🪑 Интерьер Мебель</h1>

        {telegramUser && (
          <div className="telegram-info">
            <p>👤 {telegramUser.first_name} {telegramUser.last_name || ''}</p>
            <p className="telegram-id">ID: {telegramUser.id}</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
            >
            Вход
          </button>
           <button 
            className={`tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
            >
            Регистрация
          </button>
        </div>

        {/* Форма входа */}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="login-username">Логин</label>
            <input
              type="text"
              id="login-username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              placeholder="Введите логин"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Пароль</label>
            <input
              type="password"
              id="login-password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Введите пароль"
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Войти
          </button>
        </form>

        {/* Форма регистрации */}
        <form className="register-form" style={{display: 'none'}} onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="inn">ИНН организации</label>
            <input
              type="text"
              id="inn"
              value={inn}
              onChange={(e) => setInn(e.target.value)}
              placeholder="Введите ИНН"
              required
              maxLength="12"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Логин</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Придумайте логин"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Придумайте пароль"
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;