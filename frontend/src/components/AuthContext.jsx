import React, { createContext, useCallback, useEffect, useState } from 'react';
import * as authApi from '../api/auth';
import { getToken, setToken, clearToken } from '../api/client';

const AuthContext = createContext();

const USER_KEY = 'user';

const isExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        return typeof payload.exp === 'number' && payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

const readStoredUser = () => {
    try {
        const token = getToken();

        if (!token || isExpired(token)) {
            clearToken();
            localStorage.removeItem(USER_KEY);
            return null;
        }

        return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
        return null;
    }
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(readStoredUser);
    const [sessionExpired, setSessionExpired] = useState(false);

    const logout = useCallback(() => {
        clearToken();
        try { localStorage.removeItem(USER_KEY); } catch { /* storage unavailable */ }
        setUser(null);
    }, []);

    const login = async (email, password) => {
        clearToken();
        const { token, user: loggedInUser } = await authApi.login(email, password);

        setToken(token);
        try { localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser)); } catch { /* storage unavailable */ }
        setUser(loggedInUser);
        setSessionExpired(false);
    };

    // registers the account and logs in right away
    const register = async (username, email, password) => {
        await authApi.register(username, email, password);
        await login(email, password);
    };

    useEffect(() => {
        const handleExpired = () => {
            logout();
            setSessionExpired(true);
        };

        window.addEventListener('auth:expired', handleExpired);
        return () => window.removeEventListener('auth:expired', handleExpired);
    }, [logout]);

    return (
        <AuthContext.Provider value={{ user, sessionExpired, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
