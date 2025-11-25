import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Catalog.css';

const Catalog = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowLeft size={24} />
        </button>
        <h1>Каталог</h1>
      </div>
      <div className="page-content">
        <p>Здесь будет каталог товаров</p>
      </div>
    </div>
  );
};

export default Catalog;