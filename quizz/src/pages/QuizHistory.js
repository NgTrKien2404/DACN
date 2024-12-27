import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import * as XLSX from 'sheetjs-style';
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
                console.log('Fetched quiz history:', data.results);
                setQuizHistory(data.results || []);
            } catch (err) {
                console.error('Error fetching quiz history:', err);
                setError(`Cannot load quiz history: ${err.message}`);
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

    const handleDelete = async (resultId) => {
        const token = localStorage.getItem('token');
        console.log('Deleting result with ID:', resultId);
        try {
            const response = await fetch(`http://localhost:5000/api/quiz-results/${resultId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error('Failed to delete quiz history');
            }

            // Cập nhật danh sách lịch sử sau khi xóa thành công
            setQuizHistory(quizHistory.filter(entry => entry.id !== resultId));
        } catch (err) {
            console.error('Error deleting quiz history:', err);
            setError(`Không thể xóa lịch sử làm bài: ${err.message}`);
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(quizHistory);

        const headerStyle = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "4F81BD" } },
            alignment: { horizontal: "center" }
        };

        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const address = XLSX.utils.encode_col(C) + "1";
            if (!worksheet[address]) continue;
            worksheet[address].s = headerStyle;
        }

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'QuizHistory');
        XLSX.writeFile(workbook, 'QuizHistory.xlsx');
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const chartData = {
        labels: quizHistory.map((entry) => new Date(entry.submittedAt).toLocaleDateString()).reverse(),
        datasets: [
            {
                label: 'Score',
                data: quizHistory.map((entry) => entry.score).reverse(),
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1,
            },
        ],
    };

    const chartOptions = {
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Score'
                },
                beginAtZero: true
            }
        }
    };

    return (
        <div className="quiz-history">
            <div className="content-container">
                <div className="chart-container">
                    <h2><span className="material-icons">bar_chart</span> Score chart</h2>
                    <Line data={chartData} options={chartOptions} />
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
                                <th>Actions</th>
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
                                    <td>
                                        <button onClick={() => handleDelete(entry.id)}>
                                            <span className="material-icons">delete</span> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="button-container">
                        <button onClick={() => exportToExcel()}>
                            <span className="material-icons">file_download</span> Export to Excel
                        </button>
                        <button onClick={() => navigate('/quiz')}>
                            <span className="material-icons">add_circle</span> New Quiz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizHistory; 