import { apiFetch } from './client';

export const getProducts = async ({ category, productType } = {}) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (productType) params.set('productType', productType);

    const query = params.toString();
    const { products } = await apiFetch(`/products${query ? `?${query}` : ''}`);

    return products;
};
