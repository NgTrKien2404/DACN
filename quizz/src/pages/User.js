import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    FaSignOutAlt, 
    FaUser, 
    FaEnvelope, 
    FaIdCard, 
    FaCrown, 
    FaHistory, 
    FaCalendarAlt, 
    FaTrophy, 
    FaClock,
    FaGraduationCap,
    FaChartLine,
    FaCheckCircle,
    FaRegClock,
    FaUserCircle
} from 'react-icons/fa';
import './styles/User.css';

const User = () => {
    const [userData, setUserData] = useState(null);
    const [quizHistory, setQuizHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const userDataFromStorage = JSON.parse(localStorage.getItem('user'));
                if (userDataFromStorage) {
                    setUserData(userDataFromStorage);
                    
                    // Dữ liệu mẫu nâng cao cho quiz history
                    setQuizHistory([
                        {
                            quizName: "Reading 1",
                            completedAt: new Date().toISOString(),
                            score: 85,
                            totalQuestions: 40,
                            correctAnswers: 34,
                            timeSpent: 30,
                            accuracy: 85,
                            status: 'Đạt'
                        },
                        {
                            quizName: "Reading 2",
                            completedAt: new Date(Date.now() - 86400000).toISOString(),
                            score: 90,
                            totalQuestions: 40,
                            correctAnswers: 36,
                            timeSpent: 25,
                            accuracy: 90,
                            status: 'Xuất sắc'
                        }
                    ]);
                    
                    setError(null);
                } else {
                    navigate('/login');
                }
            } catch (err) {
                setError('Không thể tải thông tin người dùng');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">⚠️</div>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="user-dashboard">
            <div className="dashboard-header">
                <div className="user-welcome">
                    <FaUserCircle className="user-avatar" />
                    <div className="welcome-text">
                        <h1>Hello, {userData?.User_name}!</h1>
                        <p>Welcome back!</p>
                    </div>
                </div>
                <button 
                    className="logout-button"
                    onClick={() => {
                        if (window.confirm('Are you sure you want to logout?')) {
                            logout();
                            navigate('/login');
                        }
                    }}
                >
                    <FaSignOutAlt />
                    Sign out
                </button>
            </div>

            <div className="dashboard-content">
                <div className="dashboard-tabs">
                    <button 
                        className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <FaUser /> User Profile
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        <FaHistory /> History
                    </button>
                </div>

                {activeTab === 'profile' && (
                    <div className="profile-section">
                        <div className="info-grid">
                            <div className="info-card">
                                <div className="info-icon"><FaUser /></div>
                                <div className="info-content">
                                    <label>Name</label>
                                    <p>{userData?.User_name}</p>
                                </div>
                            </div>
                            <div className="info-card">
                                <div className="info-icon"><FaEnvelope /></div>
                                <div className="info-content">
                                    <label>Email</label>
                                    <p>{userData?.email}</p>
                                </div>
                            </div>
                            <div className="info-card">
                                <div className="info-icon"><FaIdCard /></div>
                                <div className="info-content">
                                    <label>ID</label>
                                    <p>{userData?.id}</p>
                                </div>
                            </div>
                            <div className="info-card">
                                <div className="info-icon"><FaCrown /></div>
                                <div className="info-content">
                                    <label>Role</label>
                                    <p>{userData?.roles?.includes('ROLE_ADMIN') ? 'Admin' : 'Student'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="history-section">
                        <div className="history-stats">
                            <div className="stat-card">
                                <FaChartLine className="stat-icon" />
                                <div className="stat-info">
                                    <h3>Average score</h3>
                                    <p>{quizHistory.reduce((acc, quiz) => acc + quiz.score, 0) / quizHistory.length}%</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <FaCheckCircle className="stat-icon" />
                                <div className="stat-info">
                                    <h3>Test completed</h3>
                                    <p>{quizHistory.length}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <FaRegClock className="stat-icon" />
                                <div className="stat-info">
                                    <h3>Average time spent</h3>
                                    <p>{Math.round(quizHistory.reduce((acc, quiz) => acc + quiz.timeSpent, 0) / quizHistory.length)} phút</p>
                                </div>
                            </div>
                        </div>

                        <div className="history-list">
                            {quizHistory.map((quiz, index) => (
                                <div key={index} className="history-card">
                                    <div className="history-card-header">
                                        <h3><FaGraduationCap /> {quiz.quizName}</h3>
                                        <span className={`status-badge ${quiz.score >= 90 ? 'excellent' : quiz.score >= 80 ? 'good' : 'normal'}`}>
                                            {quiz.status}
                                        </span>
                                    </div>
                                    <div className="history-card-content">
                                        <div className="history-detail">
                                            <FaCalendarAlt />
                                            <span>{formatDate(quiz.completedAt)}</span>
                                        </div>
                                        <div className="history-detail">
                                            <FaTrophy />
                                            <span>{quiz.score}/100 points</span>
                                        </div>
                                        <div className="history-detail">
                                            <FaClock />
                                            <span>{quiz.timeSpent} minutes</span>
                                        </div>
                                    </div>
                                    <div className="accuracy-bar">
                                        <div 
                                            className="accuracy-progress"
                                            style={{ width: `${quiz.accuracy}%` }}
                                        ></div>
                                        <span className="accuracy-label">{quiz.accuracy}% Exactly</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default User; 