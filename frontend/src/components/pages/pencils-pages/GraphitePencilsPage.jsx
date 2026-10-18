import React from 'react';
import ProductList from '../../ProductList';

const GraphitePencilsPage = () => {
    return (
        <div className="graphite-pencils-page">
            <h1 className="page-title">Brushes</h1>
            <div className="shopping-page-img">
                <p className="sr-only">Painting brush getting dipped in paint</p>
            </div>
            <h2>Graphite Pencils</h2>
            <ProductList category="graphite-pencils" />
        </div>
    );

}
export default GraphitePencilsPage;