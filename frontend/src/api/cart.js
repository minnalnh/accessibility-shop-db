import { apiFetch } from './client';

export const getCart = async () => {
    const { cartItems } = await apiFetch('/cart');
    return cartItems;
};

// adds `quantity` to the existing quantity (or creates the row)
export const addCartItem = async (productId, quantity = 1) => {
    const { cartItem } = await apiFetch('/cart/items', {
        method: 'POST',
        body: { productId, quantity },
    });
    return cartItem;
};

// sets the quantity to exactly `quantity` (must be 1 or more)
export const updateCartItem = async (productId, quantity) => {
    const { updatedItem } = await apiFetch(`/cart/items/${encodeURIComponent(productId)}`, {
        method: 'PATCH',
        body: { quantity },
    });
    return updatedItem;
};

export const removeCartItem = (productId) =>
    apiFetch(`/cart/items/${encodeURIComponent(productId)}`, { method: 'DELETE' });
