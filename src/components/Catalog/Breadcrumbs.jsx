import React from 'react';
import './Breadcrumbs.css';

const Breadcrumbs = ({ path, onNavigate }) => {
  return (
    <div className="breadcrumbs">
      <button 
        className="breadcrumb-item"
        onClick={() => onNavigate(null)}
      >
        🏠 Главная
      </button>
      {path.map((item, index) => (
        <React.Fragment key={item.id}>
          <span className="breadcrumb-separator">›</span>
          <button 
            className="breadcrumb-item"
            onClick={() => onNavigate(item.id, index)}
          >
            {item.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;