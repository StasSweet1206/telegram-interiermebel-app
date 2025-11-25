// Заглушка данных для каталога
export const mockCatalogData = {
  categories: [
    {
      id: 'electronics',
      name: 'Электроника',
      icon: '📱',
      hasSubcategories: true,
      subcategories: ['smartphones', 'laptops']
    },
    {
      id: 'clothing',
      name: 'Одежда',
      icon: '👕',
      hasSubcategories: true,
      subcategories: ['mens', 'womens']
    },
    {
      id: 'food',
      name: 'Продукты',
      icon: '🍎',
      hasSubcategories: false,
      products: ['apple', 'bread', 'milk']
    }
  ],

  subcategories: {
    smartphones: {
      id: 'smartphones',
      name: 'Смартфоны',
      parentId: 'electronics',
      hasSubcategories: false,
      products: ['iphone', 'samsung']
    },
    laptops: {
      id: 'laptops',
      name: 'Ноутбуки',
      parentId: 'electronics',
      hasSubcategories: false,
      products: ['macbook', 'lenovo']
    },
    mens: {
      id: 'mens',
      name: 'Мужская одежда',
      parentId: 'clothing',
      hasSubcategories: false,
      products: ['tshirt', 'jeans']
    },
    womens: {
      id: 'womens',
      name: 'Женская одежда',
      parentId: 'clothing',
      hasSubcategories: false,
      products: ['dress', 'skirt']
    }
  },

  products: {
    iphone: {
      id: 'iphone',
      name: 'iPhone 15 Pro',
      categoryId: 'smartphones',
      basePrice: 89990,
      description: 'Смартфон Apple iPhone 15 Pro',
      hasCharacteristics: true,
      characteristics: [
        {
          id: 'iphone-128',
          name: '128GB Титановый',
          price: 89990,
          stock: 5,
          image: 'https://via.placeholder.com/300x300?text=iPhone+128GB'
        },
        {
          id: 'iphone-256',
          name: '256GB Титановый',
          price: 99990,
          stock: 3,
          image: 'https://via.placeholder.com/300x300?text=iPhone+256GB'
        },
        {
          id: 'iphone-512',
          name: '512GB Черный',
          price: 119990,
          stock: 0,
          image: 'https://via.placeholder.com/300x300?text=iPhone+512GB'
        }
      ]
    },
    samsung: {
      id: 'samsung',
      name: 'Samsung Galaxy S24',
      categoryId: 'smartphones',
      basePrice: 69990,
      description: 'Смартфон Samsung Galaxy S24',
      hasCharacteristics: true,
      characteristics: [
        {
          id: 'samsung-128',
          name: '128GB Фиолетовый',
          price: 69990,
          stock: 8,
          image: 'https://via.placeholder.com/300x300?text=Samsung+128GB'
        },
        {
          id: 'samsung-256',
          name: '256GB Черный',
          price: 79990,
          stock: 12,
          image: 'https://via.placeholder.com/300x300?text=Samsung+256GB'
        }
      ]
    },
    apple: {
      id: 'apple',
      name: 'Яблоки',
      categoryId: 'food',
      basePrice: 150,
      description: 'Свежие яблоки',
      hasCharacteristics: false,
      stock: 100,
      image: 'https://via.placeholder.com/300x300?text=Apples'
    },
    bread: {
      id: 'bread',
      name: 'Хлеб белый',
      categoryId: 'food',
      basePrice: 45,
      description: 'Свежий белый хлеб',
      hasCharacteristics: false,
      stock: 50,
      image: null // Пример без фото
    }
  }
};