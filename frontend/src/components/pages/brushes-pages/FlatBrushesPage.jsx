import React from 'react';
import ProductList from '../../ProductList';

const FlatBrushesPage = () => {
    return (
        <div className="flat-brushes-page">
            <h1 className="page-title">Brushes</h1>
            <div className="shopping-page-img">
                <p className="sr-only">Painting brush getting dipped in paint</p>
            </div>
            <h2>Flat Brushes</h2>
            <ProductList category="flat-brushes" />
        </div>
    );

}
export default FlatBrushesPage;