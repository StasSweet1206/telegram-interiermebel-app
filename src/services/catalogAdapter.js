// Адаптер для категорий из 1С
export const adaptCategoriesData = (data) => {
  if (!Array.isArray(data)) {
    console.error('Неверный формат данных категорий:', data);
    return [];
  }

  return data
    .filter(item => item.is_active) // только активные категории
    .sort((a, b) => a.order - b.order) // сортируем по order
    .map(item => ({
      id: item.code_1c,
      name: item.name.replace(/^"|"$/g, ''), // убираем кавычки в начале и конце
      description: item.description.replace(/^"|"$/g, ''),
      parentId: item.parent_id,
      isActive: item.is_active,
      order: item.order
    }));
};

// Адаптер для товаров категории
export const adaptProductsData = (data) => {
  if (!Array.isArray(data)) {
    console.error('Неверный формат данных товаров:', data);
    return [];
  }

  return data.map(item => ({
    id: item.code_1c,
    name: item.name,
    fullName: item.full_name,
    categoryId: item.category_id,
    image: item.image_url || '/placeholder.jpg',
    hasVariants: item.has_variants,
    variants: item.has_variants ? adaptVariantsData(item.variants) : []
  }));
};

// Адаптер для вариантов товара (характеристик)
export const adaptVariantsData = (variants) => {
  if (!Array.isArray(variants)) {
    return [];
  }

  return variants.map(variant => ({
    id: variant.code_1c,
    name: variant.name,
    fullName: variant.full_name,
    categoryId: variant.category_id,
    image: variant.image_url || '/placeholder.jpg'
  }));
};

// Адаптер для одного товара
export const adaptProductData = (data) => {
  if (!data) {
    console.error('Нет данных товара');
    return null;
  }

  return {
    id: data.code_1c,
    name: data.name,
    fullName: data.full_name,
    categoryId: data.category_id,
    image: data.image_url || '/placeholder.jpg',
    hasVariants: data.has_variants,
    variants: data.has_variants ? adaptVariantsData(data.variants) : [],
    // Дополнительные поля, если они есть в вашем API
    price: data.price || 0,
    description: data.description || data.full_name || '',
    inStock: data.in_stock !== false
  };
};