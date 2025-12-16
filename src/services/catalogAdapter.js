/**
 * Адаптер для преобразования данных Django API в формат приложения
 */

/**
 * Преобразование категории Django в формат приложения
 */
export const adaptCategory = (category) => {
  // Определяем parentId из parent_code_1c
  let parentId = null;
  if (category.parent_code_1c &&
    category.parent_code_1c !== '00000000-0000-0000-0000-000000000000') {
    parentId = category.parent_code_1c;
  }

  return {
    id: category.id,
    name: category.name,
    slug: category.slug || category.code_1c,
    icon: '📁',
    hasSubcategories: (category.children && category.children.length > 0),
    subcategories: category.children?.map(child => child.id) || [],
    products: [],
    productsCount: category.products_count || 0,
    image: category.image,
    parentId: parentId,
    code1c: category.code_1c // Сохраняем для связи
  };
};

/**
 * Преобразование товара Django в формат приложения
 */
export const adaptProduct = (product) => {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    categoryId: product.category,
    categoryName: product.category_name,
    basePrice: parseFloat(product.price),
    oldPrice: product.old_price ? parseFloat(product.old_price) : null,
    discount: product.discount_percentage,
    description: product.description,
    image: product.main_image,
    images: product.images || [],
    stock: product.stock,
    inStock: product.stock > 0,
    isNew: product.is_new,
    isBestseller: product.is_bestseller,
    isSale: product.is_sale,
    rating: parseFloat(product.rating),
    reviewsCount: product.reviews_count,
    unit: product.unit,
    article: product.article,
    barcode: product.barcode,

    // Характеристики товара
    hasCharacteristics: product.characteristics && product.characteristics.length > 0,
    characteristics: product.characteristics?.map(char => ({
      id: char.id,
      name: char.characteristic_name,
      value: char.value,
      // Если характеристика влияет на цену, можно добавить логику
      price: parseFloat(product.price),
      stock: product.stock,
      image: null
    })) || []
  };
};

/**
 * Построение дерева категорий из плоского списка
 */
export const buildCategoryTree = (categories) => {
  const categoryMap = {};
  const rootCategories = [];

  // Создаем карту категорий
  categories.forEach(cat => {
    categoryMap[cat.id] = adaptCategory(cat);
  });

  // Строим дерево
  categories.forEach(cat => {
    const adapted = categoryMap[cat.id];

    if (cat.parent === null) {
      // Корневая категория
      rootCategories.push(adapted);
    } else {
      // Добавляем в подкатегории родителя
      const parent = categoryMap[cat.parent];
      if (parent) {
        if (!parent.subcategories) {
          parent.subcategories = [];
        }
        parent.subcategories.push(adapted);
      }
    }
  });

  return {
    categories: rootCategories,
    categoryMap
  };
};

/**
 * Преобразование списка товаров
 */
export const adaptProducts = (products) => {
  return products.map(adaptProduct);
};

/**
 * Группировка товаров по категориям
 */
export const groupProductsByCategory = (products) => {
  const grouped = {};

  products.forEach(product => {
    const categoryId = product.categoryId;

    if (!grouped[categoryId]) {
      grouped[categoryId] = [];
    }

    grouped[categoryId].push(product);
  });

  return grouped;
};