import React from 'react';
import './Breadcrumbs.css';

const Breadcrumbs = ({ path, onNavigate }) => {
  return (
    <div className="breadcrumbs">
      <button
        className="breadcrumb-item"
        onClick={() => onNavigate(-1)}
      >
        🏠 Главная
      </button>
      {path.map((item, index) => (
        <React.Fragment key={item.id}>
          <span className="breadcrumb-separator">›</span>
          <button
            className={`breadcrumb-item ${index === path.length - 1 ? 'active' : ''}`}
            onClick={() => onNavigate(index)}
            disabled={index === path.length - 1}
          >
            {item.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;