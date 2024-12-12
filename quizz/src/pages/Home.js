import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Home.css';

const Home = () => {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>
                        Master English with
                        <span className="gradient-text"> READING MULTIPLE CHOICE</span>
                    </h1>
                    <p className="hero-description">
                        Improve your English skills through interactive multiple-choice questions. 
                        Practice TOEIC, IELTS, and TOEFL formats with our comprehensive question bank.
                    </p>
                    <div className="hero-stats">
                        
                        <div className="stat-item">
                            <span className="stat-number">24/7</span>
                            <span className="stat-label">Access</span>
                        </div>
                    </div>
                    <div className="hero-buttons">
                        <Link to="/quiz" className="primary-button">
                            Start Practice Now
                            <i className="fas fa-arrow-right"></i>
                        </Link>
                        <Link to="/quiz" className="secondary-button">
                            Take Mock Test
                            <i className="fas fa-file-alt"></i>
                        </Link>
                    </div>
                </div>
                <div className="hero-image">
                    <img src="/img/h1.jpg" alt="English Learning" />
                </div>
            </section>

            {/* Study Tips Section */}
            <section className="tips-section highlight-section">
                <div className="section-content">
                    <h2 className="section-title">Study Tips & Resources</h2>
                    <div className="tips-grid">
                        <div className="tip-card">
                            <div className="icon-wrapper">
                                <i className="fas fa-lightbulb"></i>
                            </div>
                            <h3>Time Management</h3>
                            <p>Learn how to manage your time effectively during the test</p>
                        </div>
                        <div className="tip-card">
                            <div className="icon-wrapper">
                                <i className="fas fa-brain"></i>
                            </div>
                            <h3>Test Strategies</h3>
                            <p>Master proven strategies for multiple-choice questions</p>
                        </div>
                        <div className="tip-card">
                            <div className="icon-wrapper">
                                <i className="fas fa-book"></i>
                            </div>
                            <h3>Study Plans</h3>
                            <p>Follow our structured study plans for better results</p>
                        </div>
                    </div>
                </div>
            </section>

        
        </div>
    );
};

export default Home;