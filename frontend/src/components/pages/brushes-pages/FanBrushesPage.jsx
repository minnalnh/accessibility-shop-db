import React from 'react';
import ProductList from '../../ProductList';

const FanBrushesPage = () => {
    return (
        <div className="fan-brushes-page">
            <h1 className="page-title">Brushes</h1>
            <div className="shopping-page-img">
                <p className="sr-only">Painting brush getting dipped in paint</p>
        </div>
        <h2>Fan Brushes</h2>
            <ProductList category="fan-brushes" />
        </div>
    );

}
export default FanBrushesPage;