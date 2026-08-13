import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getMe, login as apiLogin, register as apiRegister, logout as apiLogout } from '../services/authService';

const AuthContext = createContext(null);

const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
            };
        case 'UPDATE_USER':
            return {
                ...state,
                user: { ...state.user, ...action.payload },
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const loadUser = async () => {
            if (state.token) {
                try {
                    const data = await getMe();
                    dispatch({ type: 'LOGIN', payload: { user: data.user || data, token: state.token } });
                } catch (error) {
                    localStorage.removeItem('token');
                    dispatch({ type: 'LOGOUT' });
                }
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };
        loadUser();
    }, [state.token]);

    const login = async (credentials) => {
        const data = await apiLogin(credentials);
        localStorage.setItem('token', data.token);
        dispatch({ type: 'LOGIN', payload: { user: data.user, token: data.token } });
        return data;
    };

    const register = async (userData) => {
        const data = await apiRegister(userData);
        localStorage.setItem('token', data.token);
        dispatch({ type: 'LOGIN', payload: { user: data.user, token: data.token } });
        return data;
    };

    const logout = async () => {
        try {
            await apiLogout();
        } catch (error) {
            console.error('Logout error', error);
        }
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
    };

    const updateUser = (userData) => {
        dispatch({ type: 'UPDATE_USER', payload: userData });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
