import React from 'react';
import ProductList from '../../ProductList';

const CharcoalPencilsPage = () => {
    return (
        <div className="charcoal-pencils-page">
            <h1 className="page-title">Brushes</h1>
            <div className="shopping-page-img">
                <p className="sr-only">Painting brush getting dipped in paint</p>
            </div>
            <h2>Charcoal Pencils</h2>
            <ProductList category="charcoal-pencils" />
        </div>
    );

}
export default CharcoalPencilsPage;