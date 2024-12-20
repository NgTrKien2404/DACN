import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Lấy danh sách quiz
const getQuizzes = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/quizzes`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Raw API response:', response);
        
        // Trả về response.data nếu có, nếu không trả về response
        return response.data || response;
    } catch (error) {
        console.error('GetQuizzes error:', error);
        throw error.response?.data || error.message;
    }
};

// Lấy thông tin quiz theo ID
const getQuizById = async (quizId) => {
    try {
        console.log('Fetching quiz with ID:', quizId);
        const response = await axios.get(`${API_URL}/quizzes/${quizId}`);
        console.log('API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching quiz:', error);
        throw error;
    }
};

// Submit quiz
const submitQuiz = async (submitData) => {
    try {
        const response = await axios.post(`${API_URL}/results`, submitData);
        console.log('Submit Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error submitting quiz:', error);
        throw error;
    }
};



// Lấy kết quả quiz
const getQuizResult = async (quizId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/quizzes/${quizId}/result`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const getQuizHistory = async () => {
    const response = await fetch('http://localhost:5000/api/quiz-history');
    if (!response.ok) {
        throw new Error('Không thể lấy lịch sử làm bài');
    }
    return response.json();
};

const quizService = {
    getQuizzes,
    getQuizById,
    submitQuiz,
    getQuizResult,
    getQuizHistory
};

export default quizService;