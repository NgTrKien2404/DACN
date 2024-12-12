import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Đảm bảo đã cài đặt axios

const Profile = () => {
    const [user, setUser] = useState(null);
    const [quizHistory, setQuizHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Hàm fetch dữ liệu người dùng
        const fetchUserData = async () => {
            try {
                // Giả sử API endpoint của bạn là /api/user/profile
                const response = await axios.get('http://localhost:5000/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUser(response.data); // Sử dụng setUser để cập nhật state
                setLoading(false);
            } catch (err) {
                setError('Không thể tải thông tin người dùng');
                setLoading(false);
            }
        };

        // Hàm fetch lịch sử quiz
        const fetchQuizHistory = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/user/quiz-history', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setQuizHistory(response.data);
            } catch (err) {
                setError('Không thể tải lịch sử quiz');
            }
        };

        fetchUserData();
        fetchQuizHistory();
    }, []); // Empty dependency array means this runs once on mount

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="profile-container">
            <h2>Thông tin cá nhân</h2>
            {user && (
                <div className="user-info">
                    <p><strong>Tên:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    {/* Thêm các thông tin khác của user nếu cần */}
                </div>
            )}

            <h3>Lịch sử làm bài</h3>
            <div className="quiz-history">
                {quizHistory.length > 0 ? (
                    quizHistory.map((quiz, index) => (
                        <div key={index} className="history-item">
                            <h4>{quiz.title}</h4>
                            <p>Điểm số: {quiz.score}%</p>
                            <p>Ngày: {new Date(quiz.date).toLocaleDateString()}</p>
                        </div>
                    ))
                ) : (
                    <p>Chưa có lịch sử làm bài</p>
                )}
            </div>
        </div>
    );
};

export default Profile;