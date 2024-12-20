import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import defaultAvatar from '../../assets/images/P1150155.JPG';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    const handleProfileClick = () => {
        navigate('/user');
        setIsMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="logo">
                    <Link to="/home">Reading Multiple Choice</Link>
                </div>

                <button 
                    className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/home" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                        Home page
                    </Link>
                    <Link to="/quiz" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                        Quizz test
                    </Link>
                    <Link to="/quiz-history" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                        History
                    </Link>
                    {user ? (
                        <div className="user-menu">
                            <div className="user-profile">
                                <img 
                                    src={user.avatar || defaultAvatar}
                                    alt="User avatar" 
                                    className="avatar"                                    
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = defaultAvatar;
                                    }}
                                />
                                <span className="user-name">{user.name || 'User'}</span>
                            </div>
                            <div className="dropdown-menu">
                                <div className="dropdown-item" onClick={handleProfileClick}>
                                    <i className="fas fa-user"></i> User
                                </div>
                                <div className="dropdown-item" onClick={handleLogout}>
                                    <i className="fas fa-sign-out-alt"></i> Sign out
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="login-btn" onClick={() => setIsMenuOpen(false)}>
                                Sign in
                            </Link>
                            <Link to="/register" className="register-btn" onClick={() => setIsMenuOpen(false)}>
                                Sign up
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;