import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Load token from localStorage on first load
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Create an axios instance with auth token attached automatically
    const api = axios.create();
    api.interceptors.request.use((config) => {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // On app start: if we have a token, fetch the logged-in user's info
    useEffect(() => {
        if (token) {
            api.get('/api/auth/me')
                .then((res) => setUser(res.data))
                .catch(() => {
                    // Token is invalid or expired → log out
                    setToken(null);
                    localStorage.removeItem('token');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    // Login: get token from API, then fetch user info
    const login = async (email, password) => {
        const res = await api.post('/api/auth/login', { email, password });
        const newToken = res.data.token;
        setToken(newToken);
        localStorage.setItem('token', newToken);
        // Now fetch the user profile with the new token
        const { data } = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${newToken}` }
        });
        setUser(data);
    };

    // Logout: clear everything
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    // Register: just create the account (user still needs to login)
    const register = async (fullname, email, password) => {
        await api.post('/api/auth/register', { fullname, email, password });
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, register, loading, api }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
