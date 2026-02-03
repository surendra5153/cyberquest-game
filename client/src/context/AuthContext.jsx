import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// API base URL
const API_URL = import.meta.env.VITE_API_URL;

// Create context
const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Manages authentication state and provides auth methods
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Configure axios defaults
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // Load user on mount if token exists
    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const res = await axios.get(`${API_URL}/auth/me`);
                    setUser(res.data.data);
                } catch (err) {
                    console.error('Failed to load user:', err);
                    // Clear invalid token
                    localStorage.removeItem('token');
                    setToken(null);
                }
            }
            setLoading(false);
        };

        loadUser();
    }, [token]);

    /**
     * Register a new user
     */
    const register = async (username, email, password, role) => {
        try {
            setError(null);
            const res = await axios.post(`${API_URL}/auth/register`, {
                username,
                email,
                password,
                role
            });

            const { token: newToken, ...userData } = res.data.data;

            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);

            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    /**
     * Login user
     */
    const login = async (email, password) => {
        try {
            setError(null);
            const res = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });

            const { token: newToken, ...userData } = res.data.data;

            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);

            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    /**
     * Logout user
     */
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    /**
     * Clear error
     */
    const clearError = () => setError(null);

    const value = {
        user,
        token,
        loading,
        error,
        isAuthenticated: !!user,
        isStudent: user?.role === 'student',
        isParent: user?.role === 'parent',
        isTeacher: user?.role === 'teacher',
        isGuardian: ['parent', 'teacher'].includes(user?.role),
        register,
        login,
        logout,
        clearError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook to use auth context
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
