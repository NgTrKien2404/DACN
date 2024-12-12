import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Cấu hình axios
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = false;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Hàm đăng nhập - chỉ cập nhật state và lưu user
    const login = (userData) => {
        setUser(userData);
    };

    // Hàm lấy thông tin user
    const getUserProfile = async () => {
        try {
            const userInfo = localStorage.getItem('user');
            if (userInfo) {
                return JSON.parse(userInfo);
            }
            return null;
        } catch (error) {
            console.error('Chi tiết lỗi lấy profile:', error);
            return null;
        }
    };

    // Hàm đăng xuất
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        getUserProfile
    };

    return (
        <AuthContext.Provider value={value}>
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