import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Trash2, Package } from 'lucide-react';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Загрузка корзины из localStorage
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          setCartItems(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error('Ошибка загрузки корзины:', error);
        setCartItems([]);
      }
    };

    loadCart();

    // Слушаем изменения корзины
    window.addEventListener('storage', loadCart);
    return () => window.removeEventListener('storage', loadCart);
  }, []);

  // Сохранение корзины в localStorage
  const saveCart = (items) => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
      // Dispatch события для обновления счетчика
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Ошибка сохранения корзины:', error);
    }
  };

  // Изменение количества товара
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map(item => {
      if (item.id === itemId) {
        // Проверяем доступный остаток
        const maxQuantity = item.characteristics 
          ? item.selectedCharacteristic.stock 
          : item.stock;

        return {
          ...item,
          quantity: Math.min(newQuantity, maxQuantity)
        };
      }
      return item;
    });

    setCartItems(updatedCart);
    saveCart(updatedCart);
    hapticFeedback('light');
  };

  // Удаление товара
  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    saveCart(updatedCart);
    hapticFeedback('medium');
  };

  // Очистка корзины
  const clearCart = () => {
    if (window.confirm('Очистить всю корзину?')) {
      setCartItems([]);
      saveCart([]);
      hapticFeedback('heavy');
    }
  };

  // Оформление заказа
  const handleCheckout = () => {
    setIsProcessing(true);
    hapticFeedback('success');

    // Имитация обработки заказа
    setTimeout(() => {
      // Здесь будет отправка на сервер
      alert('Функция оформления заказа будет реализована позже!');
      setIsProcessing(false);
    }, 1000);
  };

  // Тактильная обратная связь
  const hapticFeedback = (style = 'light') => {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      switch (style) {
        case 'light':
          window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
          break;
        case 'medium':
          window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
          break;
        case 'heavy':
          window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
          break;
        case 'success':
          window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
          break;
        default:
          window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      }
    }
  };

  // Расчет итогов
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = subtotal >= 1000 ? 0 : 200;
    const total = subtotal + delivery;

    return { subtotal, delivery, total };
  };

  const { subtotal, delivery, total } = calculateTotals();

  return (
    <div className="cart">
      {/* Шапка */}
      <div className="cart-header">
        <button 
          className="back-button"
          onClick={() => {
            hapticFeedback('light');
            navigate('/');
          }}
        >
          <ArrowLeft size={24} />
          <span>Главное меню</span>
        </button>

        <div className="cart-header-content">
          <div className="cart-header-icon">
            <ShoppingCart size={32} />
          </div>
          <div>
            <h1 className="cart-title">Корзина</h1>
            <p className="cart-subtitle">
              {cartItems.length > 0 
                ? `${cartItems.length} ${cartItems.length === 1 ? 'товар' : 'товара'}`
                : 'Пусто'
              }
            </p>
          </div>
        </div>

        {cartItems.length > 0 && (
          <button 
            className="clear-cart-button"
            onClick={clearCart}
          >
            <Trash2 size={20} />
            <span>Очистить</span>
          </button>
        )}
      </div>

      {/* Контент */}
      <div className="cart-content">
        {cartItems.length === 0 ? (
          // Пустая корзина
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <ShoppingCart size={80} />
            </div>
            <h2 className="cart-empty-title">Корзина пуста</h2>
            <p className="cart-empty-text">
              Добавьте товары из каталога, чтобы сделать заказ
            </p>
            <button 
              className="cart-empty-button"
              onClick={() => {
                hapticFeedback('light');
                navigate('/catalog');
              }}
            >
              <Package size={20} />
              <span>Перейти в каталог</span>
            </button>
          </div>
        ) : (
          // Список товаров
          <>
            <div className="cart-items">
              {cartItems.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  onHaptic={hapticFeedback}
                />
              ))}
            </div>

            {/* Итоги заказа */}
            <OrderSummary
              subtotal={subtotal}
              delivery={delivery}
              total={total}
              itemsCount={cartItems.length}
              onCheckout={handleCheckout}
              isProcessing={isProcessing}
              onHaptic={hapticFeedback}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;