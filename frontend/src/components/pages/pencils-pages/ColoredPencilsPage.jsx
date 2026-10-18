import React from 'react';
import ProductList from '../../ProductList';

const ColoredPencilsPage = () => {
    return (
        <div className="colored-pencils-page">
            <h1 className="page-title">Brushes</h1>
            <div className="shopping-page-img">
                <p className="sr-only">Painting brush getting dipped in paint</p>
            </div>
            <h2>Colored Pencils</h2>
            <ProductList category="colored-pencils" />
        </div>
    );

}
export default ColoredPencilsPage;