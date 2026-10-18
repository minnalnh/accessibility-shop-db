import React from 'react';
import ProductList from '../../ProductList';

const OilPaintPage = () => {
    return (
        <div className="oil-paint-page">
            <h1 className="page-title">Brushes</h1>
            <div className="shopping-page-img">
                <p className="sr-only">Painting brush getting dipped in paint</p>
            </div>
            <h2>Oil Paint</h2>
            <ProductList category="oil-paint" />
        </div>
    );

}
export default OilPaintPage;