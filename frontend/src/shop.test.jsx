import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from './App';

const product = {
    productId: 'p1',
    name: 'Soft Fan Brush',
    size: 'Medium',
    material: 'Synthetic',
    description: 'Ideal for blending.',
    brand: 'Artisan Brushes',
    price: 129,
    image: 'json-images/soft-fan-brush.png',
    alt: 'Soft Fan Brush',
    category: 'fan-brushes',
    productType: 'brushes',
};

// a token with an expiry in the future; the signature is never checked in the browser
const makeToken = () => {
    const encode = (value) => btoa(JSON.stringify(value)).replace(/=/g, '');
    return `${encode({ alg: 'HS256' })}.${encode({ userId: 'u1', exp: Math.floor(Date.now() / 1000) + 3600 })}.sig`;
};

const json = (body, status = 200) =>
    Promise.resolve({ ok: status < 400, status, json: () => Promise.resolve(body) });

describe('shop connected to the API', () => {
    let cart;

    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'http://api.test');
        localStorage.clear();
        window.history.pushState({}, '', '/fan-brushes');
        cart = [];

        global.fetch = vi.fn((url, { method = 'GET', body } = {}) => {
            const path = url.replace('http://api.test', '');
            const data = body ? JSON.parse(body) : undefined;

            if (path.startsWith('/products')) return json({ products: [product] });
            if (path === '/auth/login') {
                return json({ token: makeToken(), user: { userId: 'u1', username: 'mino' } });
            }
            if (path === '/cart' && method === 'GET') return json({ cartItems: cart });
            if (path === '/cart/items' && method === 'POST') {
                cart = [{ userId: 'u1', productId: data.productId, quantity: data.quantity }];
                return json({ cartItem: cart[0] }, 201);
            }
            if (path === '/orders' && method === 'POST') {
                cart = [];
                return json({
                    order: {
                        orderId: 'order-123',
                        items: [{ productId: 'p1', name: 'Soft Fan Brush', quantity: 1, price: 129 }],
                        totalPrice: 129,
                    },
                }, 201);
            }
            return json({ message: 'Not found' }, 404);
        });
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    test('log in, add to cart and check out', async () => {
        render(<App />);

        expect(await screen.findByText('Soft Fan Brush', { selector: 'h2' })).toBeInTheDocument();

        // adding to the cart requires an account
        userEvent.click(screen.getByRole('button', { name: /add to cart/i }));
        expect(await screen.findByText('Please log in to add items to your cart')).toBeInTheDocument();

        // log in through the pop-up in the header
        userEvent.click(screen.getByRole('button', { name: /account.*log in/i }));
        await userEvent.type(await screen.findByLabelText('Email'), 'mino@example.com');
        await userEvent.type(screen.getByLabelText('Password'), 'secret-password');
        userEvent.click(screen.getByRole('button', { name: 'Log in', exact: true }));

        expect(await screen.findByRole('button', { name: /account.*mino/i })).toBeInTheDocument();

        // add to cart now works and is sent to the API
        userEvent.click(await screen.findByRole('button', { name: /add to cart/i }));
        expect(await screen.findByText(/1x Soft Fan Brush/)).toBeInTheDocument();
        expect(global.fetch).toHaveBeenCalledWith(
            'http://api.test/cart/items',
            expect.objectContaining({ method: 'POST', body: JSON.stringify({ productId: 'p1', quantity: 1 }) }),
        );

        // open the cart and check out
        userEvent.click(await screen.findByRole('button', { name: /your cart/i }));
        expect(await screen.findByText(/Total sum:/)).toHaveTextContent('129 kr');
        userEvent.click(await screen.findByRole('button', { name: /checkout/i }));

        expect(await screen.findByText('Order number: order-123')).toBeInTheDocument();
    });
});
