import React from 'react';
import ProductList from '../../ProductList';

const BrushesPage = () => {
    return (
        <div className="drawing-paper-page">
            <h1 className="page-title">Brushes</h1>
            <div className="shopping-page-img">
                <p className="sr-only">Painting brush getting dipped in paint</p>
            </div>
            <h2>Drawing Paper</h2>
            <ProductList category="drawing-paper" />
        </div>
    );

}
export default BrushesPage;