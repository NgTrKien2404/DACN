import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const resultService = {
    // Lấy tất cả kết quả
    getAllResults: async () => {
        try {
            const response = await axios.get(`${API_URL}/results`);
            return response.data;
        } catch (error) {
            console.error('Error fetching results:', error);
            throw error;
        }
    },

    // Lấy kết quả theo ID
    getResultById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/results/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching result:', error);
            throw error;
        }
    },

    // Lấy kết quả theo quiz_id
    getResultsByQuizId: async (quizId) => {
        try {
            const response = await axios.get(`${API_URL}/results/quiz/${quizId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching quiz results:', error);
            throw error;
        }
    },

    // Lấy kết quả theo user_id
    getResultsByUserId: async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/results/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user results:', error);
            throw error;
        }
    },

    // Tạo kết quả mới
    createResult: async (resultData) => {
        try {
            const response = await axios.post(`${API_URL}/results`, resultData);
            return response.data;
        } catch (error) {
            console.error('Error creating result:', error);
            throw error;
        }
    }
};

export default resultService;
