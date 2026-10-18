import React from 'react';
import ProductList from '../../ProductList';

const RoundBrushesPage = () => {
    return (
        <div className="round-brushes-page">
            <h1 className="page-title">Brushes</h1>
            <div className="shopping-page-img">
                <p className="sr-only">Painting brush getting dipped in paint</p>
            </div>
            <h2>Round Brushes</h2>
            <ProductList category="round-brushes" />
        </div>
    );

}
export default RoundBrushesPage;