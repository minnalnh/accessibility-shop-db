import React, { useEffect, useState } from 'react';
import Product from './Product';
import { getProducts } from '../api/products';

const ProductList = ({ category }) => {
    const [products, setProducts] = useState([]);
    const [status, setStatus] = useState('loading');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let cancelled = false;
        setStatus('loading');

        getProducts({ category })
            .then((result) => {
                if (cancelled) return;
                setProducts(result);
                setStatus('done');
            })
            .catch((error) => {
                if (cancelled) return;
                setErrorMessage(error.message);
                setStatus('error');
            });

        return () => { cancelled = true; };
    }, [category]);

    if (status === 'loading') {
        return <p role="status">Loading products...</p>;
    }

    if (status === 'error') {
        return <p role="alert">Could not load products: {errorMessage}</p>;
    }

    return (
        <div className="flex-container">
            {products.map((product) => (
                <Product key={product.productId} {...product} id={product.productId} />
            ))}
        </div>
    );
};

export default ProductList;
