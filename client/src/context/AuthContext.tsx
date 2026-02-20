'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import axios from 'axios';
import API_BASE_URL from '@/lib/apiConfig';

interface AuthContextType {
    user: User | null;
    login: (userData: User & { token?: string }) => void;
    logout: () => void;
    checkUser: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to set/clear Authorization header globally
const setAuthHeader = (token: string | null) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // On mount, restore token from localStorage if it exists
        const storedToken = localStorage.getItem('skillnest_token');
        if (storedToken) {
            setAuthHeader(storedToken);
        }
        checkUser();
    }, []);

    const checkUser = async () => {
        const storedToken = localStorage.getItem('skillnest_token');
        if (!storedToken) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        setAuthHeader(storedToken);

        try {
            const response = await axios.get(`${API_BASE_URL}/api/auth/me`);

            if (response.data.success && response.data.data) {
                setUser(response.data.data);
            } else {
                setUser(null);
                localStorage.removeItem('skillnest_token');
                localStorage.removeItem('skillnest_user');
                setAuthHeader(null);
            }
        } catch (error: any) {
            // Token invalid or expired — clear everything
            setUser(null);
            localStorage.removeItem('skillnest_token');
            localStorage.removeItem('skillnest_user');
            setAuthHeader(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = (userData: User & { token?: string }) => {
        const { token, ...userOnly } = userData;
        setUser(userOnly as User);
        localStorage.setItem('skillnest_user', JSON.stringify(userOnly));
        if (token) {
            localStorage.setItem('skillnest_token', token);
            setAuthHeader(token);
        }
        router.push((userOnly as User).role === 'admin' ? '/admin' : '/dashboard');
    };

    const logout = async () => {
        try {
            await axios.post(`${API_BASE_URL}/api/auth/logout`);
        } catch (error) {
            // Ignore logout errors
        } finally {
            setUser(null);
            localStorage.removeItem('skillnest_token');
            localStorage.removeItem('skillnest_user');
            setAuthHeader(null);
            router.push('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, checkUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
