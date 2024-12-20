import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './styles/QuizHistory.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const QuizHistory = () => {
    const [quizHistory, setQuizHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.id;

        if (!token || !userId) {
            navigate('/login');
            return;
        }

        const fetchQuizHistory = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:5000/api/quiz-results/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.status === 401) {
                    throw new Error('Token đã hết hạn');
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch quiz history');
                }

                const data = await response.json();
                setQuizHistory(data.results || []);
            } catch (err) {
                console.error('Error fetching quiz history:', err);
                setError(`Không thể tải lịch sử làm bài: ${err.message}`);
                if (err.message === 'Token đã hết hạn') {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuizHistory();
    }, [navigate]);

    if (isLoading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;

    const chartData = {
        labels: quizHistory.map((entry) => new Date(entry.submittedAt).toLocaleDateString()),
        datasets: [
            {
                label: 'Điểm',
                data: quizHistory.map((entry) => entry.score),
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1,
            },
        ],
    };

    return (
        <div className="quiz-history">
            <div className="chart-container">
                <h2><span className="material-icons">bar_chart</span> Score chart</h2>
                <Line data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
            <div className="table-container">
                <h2><span className="material-icons">table_chart</span> QuizResult</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Quiz title</th>
                            <th>Score</th>
                            <th>True</th>
                            <th>Questions</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizHistory.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.quizTitle}</td>
                                <td>{entry.score}%</td>
                                <td>{entry.correctAnswers}</td>
                                <td>{entry.totalQuestions}</td>
                                <td>{new Date(entry.submittedAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default QuizHistory; 