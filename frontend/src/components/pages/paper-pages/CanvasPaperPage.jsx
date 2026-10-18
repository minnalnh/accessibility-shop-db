import React from 'react';
import ProductList from '../../ProductList';

const BrushesPage = () => {
    return (
        <div className="canvas-paper-page">
            <h1 className="page-title">Brushes</h1>
            <div className="shopping-page-img">
                <p className="sr-only">Painting brush getting dipped in paint</p>
            </div>
            <h2>Canvas Paper</h2>
            <ProductList category="canvas-paper" />
        </div>
    );

}
export default BrushesPage;