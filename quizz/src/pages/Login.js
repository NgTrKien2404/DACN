import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './styles/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
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
                'http://localhost:5000/api/login',
                formData
            );

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                login(response.data.user);
                
                navigate('/home');
            }
        } catch (error) {
            setError(
                error.response?.data?.message || 
                'Đăng nhập thất bại. Vui lòng thử lại.'
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
                <h2>Welcome back!</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
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
                            <span>Logging in...</span>
                        ) : (
                            <span>Login</span>
                        )}
                    </button>
                </form>
                <div className="login-footer">
                    <p>Don't have an account? <Link to="/register">Register now</Link></p>
                    
                </div>
            </div>
        </div>
    );
};

export default Login;