import { apiFetch } from './client';

// creates an order from the logged in user's cart and empties the cart
export const createOrder = async () => {
    const { order } = await apiFetch('/orders', { method: 'POST' });
    return order;
};
