import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Xóa tất cả thông tin user khỏi localStorage
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Chuyển hướng về trang login
        navigate('/login');
    };

    return (
        <div>
            {/* Add your logout button here */}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Logout; 