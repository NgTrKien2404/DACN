import React from 'react';
import './Footer.css';
const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <p>&copy; 2024 MCQuestion Created by TrungKien</p>
                </div>
                
                <div className="footer-section">
                    <div className="footer-links">
                        <a href="/user">About</a>
                        <a href="/user">Contact</a>
                        <a href="https://Facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;