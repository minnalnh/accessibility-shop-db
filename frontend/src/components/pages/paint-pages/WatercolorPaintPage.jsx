import React from 'react';
import ProductList from '../../ProductList';

const WatercolorPaintPage = () => {
    return (
        <div className="watercolor-paint-page">
            <h1 className="page-title">Brushes</h1>
            <div className="shopping-page-img">
                <p className="sr-only">Painting brush getting dipped in paint</p>
            </div>
            <h2>Watercolor Paint</h2>
            <ProductList category="watercolor-paint" />
        </div>
    );

}
export default WatercolorPaintPage;