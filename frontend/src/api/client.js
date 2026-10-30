const TOKEN_KEY = 'token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const apiFetch = async (path, { method = 'GET', body } = {}) => {
    const API_URL = import.meta.env.VITE_API_URL;

    if (!API_URL) {
        throw new Error('VITE_API_URL is not set. Add it to frontend/.env');
    }

    const headers = {};
    const token = getToken();

    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_URL.replace(/\/$/, '')}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 401 && token) {
        clearToken();
        window.dispatchEvent(new Event('auth:expired'));
    }

    if (!response.ok) {
        const error = new Error(data.message || `Request failed (${response.status})`);
        error.status = response.status;
        throw error;
    }

    return data;
};
