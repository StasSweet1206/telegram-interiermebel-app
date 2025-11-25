// Заглушка данных для каталога
export const mockCatalogData = {
  categories: [
    {
      id: 'MyagkayaMebel',
      name: 'Мягкая Мебель',
      icon: '📱',
      hasSubcategories: true,
      subcategories: ['DivaniKristal', 'Domani']
    },
    {
      id: 'Detskie',
      name: 'Детские',
      icon: '👕',
      hasSubcategories: true,
      subcategories: ['Interier', 'womens']
    },
    {
      id: 'MalieFormi',
      name: 'Малые Формы',
      icon: '🍎',
      hasSubcategories: false,
      products: ['Pufi', 'PolkiBTS']
    }
  ],

  subcategories: {
    smartphones: {
      id: 'DivaniKristal',
      name: 'Диваны Кристалл',
      parentId: 'MyagkayaMebel',
      hasSubcategories: false,
      products: ['Lider', 'samsung']
    },
    laptops: {
      id: 'Domani',
      name: 'Домани',
      parentId: 'MyagkayaMebel',
      hasSubcategories: false,
      products: ['macbook', 'lenovo']
    },
    mens: {
      id: 'Pufi',
      name: 'Пуфы СтолПром',
      parentId: 'MalieFormi',
      hasSubcategories: false,
      products: ['tshirt', 'jeans']
    },
    womens: {
      id: 'PolkiBTS',
      name: 'Полки БТС',
      parentId: 'MalieFormi',
      hasSubcategories: false,
      products: ['dress', 'skirt']
    }
  },

  products: {
    iphone: {
      id: 'Lider',
      name: 'Диван Лидер',
      categoryId: 'DivaniKristal',
      basePrice: 89990,
      description: 'Диван Лидер ОДНОТОННЫЙ',
      hasCharacteristics: true,
      characteristics: [
        {
          id: 'iphone-128',
          name: 'Савана кофе',
          price: 32914,
          stock: 5,
          image: null 
        },
        {
          id: 'iphone-256',
          name: 'Савана хазл',
          price: 32914,
          stock: 3,
          image: null 
        },
        {
          id: 'iphone-512',
          name: 'Савана грей',
          price: 29868,
          stock: 0,
          image: null 
        }
      ]
    },
    samsung: {
      id: 'samsung',
      name: 'Диван Спейс 1,2',
      categoryId: 'DivaniKristal',
      basePrice: 69990,
      description: 'Диван Спейс 1,2',
      hasCharacteristics: true,
      characteristics: [
        {
          id: 'samsung-128',
          name: 'Vivaldi 4',
          price: 69990,
          stock: 8,
          image: null 
        },
        {
          id: 'samsung-256',
          name: 'Vivaldi 8',
          price: 79990,
          stock: 12,
          image: null 
        }
      ]
    }
  }
};