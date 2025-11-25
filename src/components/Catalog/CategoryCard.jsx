import React from 'react';
import './CategoryCard.css';

const CategoryCard = ({ category, onClick }) => {
  return (
    <div className="category-card" onClick={onClick}>
      <div className="category-icon">{category.icon}</div>
      <div className="category-info">
        <h3 className="category-name">{category.name}</h3>
        <div className="category-arrow">›</div>
      </div>
    </div>
  );
};

export default CategoryCard;