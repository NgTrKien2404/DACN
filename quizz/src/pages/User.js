import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    FaSignOutAlt, 
    FaUser, 
    FaEnvelope, 
    FaIdCard, 
    FaCrown,  
    FaUserCircle
} from 'react-icons/fa';
import './styles/User.css';

const User = () => {
    const [userData, setUserData] = useState(null);

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

               
            </div>
        </div>
    );
};

export default User; 