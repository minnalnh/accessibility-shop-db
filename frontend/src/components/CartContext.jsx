import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import * as cartApi from '../api/cart';
import { getProducts } from '../api/products';
import { createOrder } from '../api/orders';

const CartContext = createContext();

const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const userId = user?.userId;

    const [rows, setRows] = useState([]);       // [{ productId, quantity }] as stored in the API
    const [catalog, setCatalog] = useState({}); // productId -> product, used for name, price and image
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // load the cart whenever someone logs in, empty it when they log out
    useEffect(() => {
        if (!userId) {
            setRows([]);
            setError('');
            return undefined;
        }

        let cancelled = false;
        setLoading(true);
        setError('');

        Promise.all([cartApi.getCart(), getProducts()])
            .then(([items, products]) => {
                if (cancelled) return;
                setRows(items.map(({ productId, quantity }) => ({ productId, quantity })));
                setCatalog(Object.fromEntries(products.map((product) => [product.productId, product])));
            })
            .catch((err) => {
                if (!cancelled) setError(err.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [userId]);

    const cartItems = rows.map(({ productId, quantity }) => {
        const product = catalog[productId];

        return {
            id: productId,
            name: product?.name ?? 'Unavailable product',
            price: product?.price ?? 0,
            image: product?.image,
            alt: product?.alt ?? '',
            quantity,
        };
    });

    const upsertRow = ({ productId, quantity }) => {
        setRows((prevRows) =>
            prevRows.some((row) => row.productId === productId)
                ? prevRows.map((row) => (row.productId === productId ? { ...row, quantity } : row))
                : [...prevRows, { productId, quantity }]
        );
    };

    // the functions below throw on failure, so the caller decides how to show the message
    const addToCart = async (product) => {
        if (!userId) {
            throw new Error('Please log in to add items to your cart');
        }

        const item = await cartApi.addCartItem(product.id, 1);

        setCatalog((prev) => (prev[product.id] ? prev : { ...prev, [product.id]: { ...product, productId: product.id } }));
        upsertRow(item);
    };

    const removeItem = async (productId) => {
        await cartApi.removeCartItem(productId);
        setRows((prevRows) => prevRows.filter((row) => row.productId !== productId));
    };

    // quantity 0 or less removes the item
    const changeQuantity = async (productId, quantity) => {
        if (quantity < 1) {
            await removeItem(productId);
            return;
        }

        upsertRow(await cartApi.updateCartItem(productId, quantity));
    };

    // creates an order from the cart; the API empties the cart when it succeeds
    const checkout = async () => {
        const order = await createOrder();
        setRows([]);
        return order;
    };

    return (
        <CartContext.Provider value={{ cartItems, loading, error, addToCart, removeItem, changeQuantity, checkout }}>
            {children}
        </CartContext.Provider>
    );
};

export { CartProvider, CartContext };
