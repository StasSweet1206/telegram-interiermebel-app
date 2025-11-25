export const mockOrders = [
  {
    id: 'ORD-2024-001',
    number: '№ 001',
    date: '2024-01-15T10:30:00',
    status: 'delivered',
    statusText: 'Доставлен',
    total: 15990,
    items: [
      {
        id: 1,
        name: 'iPhone 15 Pro',
        image: 'https://via.placeholder.com/80/667eea/ffffff?text=iPhone',
        characteristic: {
          'Цвет': 'Титановый',
          'Память': '256GB'
        },
        quantity: 1,
        price: 89990,
        sum: 89990
      },
      {
        id: 2,
        name: 'AirPods Pro 2',
        image: 'https://via.placeholder.com/80/667eea/ffffff?text=AirPods',
        characteristic: {
          'Цвет': 'Белый'
        },
        quantity: 1,
        price: 24990,
        sum: 24990
      }
    ],
    delivery: 0,
    deliveryAddress: 'г. Москва, ул. Тверская, д. 1, кв. 10'
  },
  {
    id: 'ORD-2024-002',
    number: '№ 002',
    date: '2024-01-18T14:20:00',
    status: 'processing',
    statusText: 'В обработке',
    total: 3490,
    items: [
      {
        id: 3,
        name: 'Беспроводная мышь Logitech',
        image: 'https://via.placeholder.com/80/667eea/ffffff?text=Mouse',
        characteristic: {
          'Цвет': 'Черный'
        },
        quantity: 2,
        price: 1490,
        sum: 2980
      },
      {
        id: 4,
        name: 'Коврик для мыши',
        image: 'https://via.placeholder.com/80/667eea/ffffff?text=Pad',
        characteristic: {
          'Размер': 'XL'
        },
        quantity: 1,
        price: 510,
        sum: 510
      }
    ],
    delivery: 0,
    deliveryAddress: 'г. Санкт-Петербург, Невский проспект, д. 5'
  },
  {
    id: 'ORD-2024-003',
    number: '№ 003',
    date: '2024-01-20T09:15:00',
    status: 'shipped',
    statusText: 'Отправлен',
    total: 5790,
    items: [
      {
        id: 5,
        name: 'Футболка Calvin Klein',
        image: 'https://via.placeholder.com/80/f093fb/ffffff?text=TShirt',
        characteristic: {
          'Размер': 'L',
          'Цвет': 'Черный'
        },
        quantity: 3,
        price: 1890,
        sum: 5670
      }
    ],
    delivery: 200,
    deliveryAddress: 'г. Казань, ул. Баумана, д. 20, кв. 5'
  },
  {
    id: 'ORD-2024-004',
    number: '№ 004',
    date: '2024-01-22T16:45:00',
    status: 'cancelled',
    statusText: 'Отменен',
    total: 12990,
    items: [
      {
        id: 6,
        name: 'Samsung Galaxy Watch 6',
        image: 'https://via.placeholder.com/80/667eea/ffffff?text=Watch',
        characteristic: {
          'Цвет': 'Серебристый',
          'Размер': '44mm'
        },
        quantity: 1,
        price: 24990,
        sum: 24990
      }
    ],
    delivery: 0,
    deliveryAddress: 'г. Новосибирск, пр. Ленина, д. 10'
  },
  {
    id: 'ORD-2024-005',
    number: '№ 005',
    date: '2024-01-25T11:00:00',
    status: 'pending',
    statusText: 'Ожидает оплаты',
    total: 890,
    items: [
      {
        id: 7,
        name: 'Кабель USB-C',
        image: 'https://via.placeholder.com/80/667eea/ffffff?text=Cable',
        characteristic: {
          'Длина': '2м',
          'Цвет': 'Белый'
        },
        quantity: 2,
        price: 390,
        sum: 780
      }
    ],
    delivery: 200,
    deliveryAddress: 'г. Екатеринбург, ул. Малышева, д. 3'
  }
];

export const getStatusColor = (status) => {
  const colors = {
    delivered: '#4caf50',
    processing: '#2196f3',
    shipped: '#ff9800',
    cancelled: '#f44336',
    pending: '#9e9e9e'
  };
  return colors[status] || '#9e9e9e';
};

export const getStatusGradient = (status) => {
  const gradients = {
    delivered: 'linear-gradient(135deg, #4caf50, #8bc34a)',
    processing: 'linear-gradient(135deg, #2196f3, #03a9f4)',
    shipped: 'linear-gradient(135deg, #ff9800, #ffc107)',
    cancelled: 'linear-gradient(135deg, #f44336, #e91e63)',
    pending: 'linear-gradient(135deg, #9e9e9e, #bdbdbd)'
  };
  return gradients[status] || gradients.pending;
};