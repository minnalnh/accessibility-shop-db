import React from 'react';
import ProductList from '../../ProductList';

const BrushesPage = () => {
    return (
        <div className="watercolor-paper-page">
            <h1 className="page-title">Brushes</h1>
            <div className="shopping-page-img">
                <p className="sr-only">Painting brush getting dipped in paint</p>
            </div>
            <h2>Watercolor Paper</h2>
            <ProductList category="watercolor-paper" />
        </div>
    );

}
export default BrushesPage;