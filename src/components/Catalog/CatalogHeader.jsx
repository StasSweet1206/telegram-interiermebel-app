import React from 'react';
import { ArrowLeft, ShoppingBag, Package, Tag } from 'lucide-react';
import './CatalogHeader.css';

const CatalogHeader = ({
    currentView,
    selectedCategory,
    selectedProduct,
    onBack
}) => {
    // Тактильная обратная связь
    const hapticFeedback = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
    };

    // Определяем текст и действие кнопки "Назад"
    const getBackButtonConfig = () => {
        if (selectedProduct) {
            // В карточке товара
            return {
                text: selectedCategory?.name || 'К каталогу',
                action: () => {
                    hapticFeedback();
                    onBack('category');
                }
            };
        } else if (selectedCategory) {
            // В категории/подкатегории
            return {
                text: selectedCategory.parent_id ? 'К категориям' : 'Главное меню',
                action: () => {
                    hapticFeedback();
                    onBack('root');
                }
            };
        } else {
            // В корневом каталоге
            return {
                text: 'Главное меню',
                action: () => {
                    hapticFeedback();
                    onBack('menu');
                }
            };
        }
    };

    // Определяем заголовок и подзаголовок
    const getHeaderContent = () => {
        if (selectedProduct) {
            return {
                icon: <Tag size={32} />,
                title: selectedProduct.name,
                subtitle: `${selectedProduct.price.toLocaleString()} ₽`,
                iconBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            };
        } else if (selectedCategory) {
            return {
                icon: <Package size={32} />,
                title: selectedCategory.name,
                subtitle: selectedCategory.subcategories
                    ? `${selectedCategory.subcategories.length} категорий`
                    : `${selectedCategory.products?.length || 0} товаров`,
                iconBg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
            };
        } else {
            return {
                icon: <ShoppingBag size={32} />,
                title: 'Каталог товаров',
                subtitle: 'Выберите категорию',
                iconBg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
            };
        }
    };

    const backButtonConfig = getBackButtonConfig();
    const headerContent = getHeaderContent();

    return (
        <div className="catalog-header">
            {/* Кнопка назад */}
            <button
                className="catalog-back-button"
                onClick={backButtonConfig.action}
            >
                <ArrowLeft size={24} />
                <span>{backButtonConfig.text}</span>
            </button>

            {/* Контент шапки */}
            <div className="catalog-header-content">
                <div
                    className="catalog-header-icon"
                    style={{ background: headerContent.iconBg }}
                >
                    {headerContent.icon}
                </div>
                <div className="catalog-header-text">
                    <h1 className="catalog-header-title">
                        {headerContent.title}
                    </h1>
                    <p className="catalog-header-subtitle">
                        {headerContent.subtitle}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CatalogHeader;