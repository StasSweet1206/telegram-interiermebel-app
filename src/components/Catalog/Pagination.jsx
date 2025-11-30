import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange, loading }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5; // Показываем максимум 5 кнопок

        if (totalPages <= maxVisible) {
            // Если страниц мало, показываем все
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Показываем первую, последнюю и ближайшие к текущей
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="pagination">
            <button
                className="pagination__button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
            >
                ←
            </button>

            {getPageNumbers().map((page, index) => (
                page === '...' ? (
                    <span key={`ellipsis-${index}`} className="pagination__ellipsis">
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        className={`pagination__button ${currentPage === page ? 'pagination__button--active' : ''}`}
                        onClick={() => onPageChange(page)}
                        disabled={loading}
                    >
                        {page}
                    </button>
                )
            ))}

            <button
                className="pagination__button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
            >
                →
            </button>
        </div>
    );
};

export default Pagination;
