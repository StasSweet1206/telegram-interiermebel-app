/**
 * Адаптер для преобразования данных Django API в формат приложения
 */

/**
 * Преобразование категории Django в формат приложения
 */
export const adaptCategory = (category) => {
  console.log('🔧 RAW категория с бэкенда:', category);
  console.log('🔄 Адаптация категории:', {
    name: category.name,
    code_1c: category.code_1c,
    parent_code_1c: category.parent_code_1c,
    parent: category.parent,
    parent_id: category.parent_id
  });

  // ✅ ИСПРАВЛЕНО: Правильная обработка parentId
  let parentId = null;

  // Проверяем все возможные варианты
  if (category.parent !== undefined && category.parent !== null) {
    parentId = category.parent;
  } else if (category.parent_id !== undefined && category.parent_id !== null) {
    parentId = category.parent_id;
  } else if (category.parentId !== undefined && category.parentId !== null) {
    parentId = category.parentId;
  }

  const adapted = {
    id: category.id,
    name: category.name,
    code1c: category.code_1c,
    parentCode1c: category.parent_code_1c,
    parentId: category.parent_id,
    imageUrl: category.image || null,
    description: category.description || '',
    productsCount: category.products_count || 0,
    hasChildren: category.has_children || false,  // ✅ ДОБАВЛЕНО!
  };

  console.log('✅ Адаптированная категория:', {
    id: adapted.id,
    name: adapted.name,
    parentId: adapted.parentId,
    hasChildren: adapted.hasChildren,
    parentCode1c: adapted.parentCode1c
  });

  return adapted;
};

/**
 * Преобразование товара Django в формат приложения
 */
export const adaptProduct = (product) => {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    code1c: product.code_1c,
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