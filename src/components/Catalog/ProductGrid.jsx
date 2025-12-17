import React from 'react';
import './ProductGrid.css';

const ProductGrid = ({ products, onProductClick }) => {
    if (!products || products.length === 0) {
        return <div className="products-empty">Товары не найдены</div>;
    }

    return (
        <div className="products-grid">
            {products.map(product => (
                <div
                    key={product.id}
                    className="product-item"
                    onClick={() => onProductClick(product)}
                >
                    <div className="product-image">
                        <img
                            src={product.imageUrl || product.image || '/placeholder.jpg'}
                            alt={product.name}
                        />
                    </div>
                    <div className="product-info">
                        <h3>{product.name}</h3>
                        {product.price && <p className="product-price">{product.price} ₽</p>}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductGrid;