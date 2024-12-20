import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './styles/Login.css';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [formData, setFormData] = useState({
        User_name: '',
        email: '',
        password: ''
    });
    
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post(
                'http://localhost:5000/api/register',
                formData
            );

            if (response.data.success) {
                // Lưu token và thông tin user
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Update auth context
                login(response.data.user);
                
                // Chuyển hướng về trang chủ
                navigate('/');
            }
        } catch (error) {
            setError(
                error.response?.data?.message || 
                'Đăng ký thất bại. Vui lòng thử lại.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Create an account</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="User_name"
                            placeholder="Username"
                            value={formData.User_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span>Registering...</span>
                        ) : (
                            <span>Register</span>
                        )}
                    </button>
                </form>
                <div className="login-footer">
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;