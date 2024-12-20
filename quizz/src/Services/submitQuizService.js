import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const formatQuizSubmission = (quiz, userAnswers, userId) => {
    try {
        // Kiểm tra dữ liệu quiz và userAnswers
        if (!quiz || !quiz.questions || !Array.isArray(quiz.questions)) {
            throw new Error('Invalid quiz data');
        }

        if (!userAnswers || typeof userAnswers !== 'object') {
            throw new Error('Invalid user answers data');
        }

        const formattedAnswers = Object.entries(userAnswers).map(([index, option]) => ({
            question_index: parseInt(index),
            selected_answer: option,
            is_correct: quiz.questions[parseInt(index)].correctAnswer === option
        }));

        const correctAnswers = formattedAnswers.filter(answer => answer.is_correct).length;
        const score = Math.round((correctAnswers / quiz.questions.length) * 100);

        return {
            quiz_id: quiz._id,  // Dùng _id thay vì id nếu dùng MongoDB
            user_id: userId,
            answers: formattedAnswers,
            score: score
        };
    } catch (error) {
        console.error('Error formatting submission:', error);
        throw new Error('Failed to format submission');
    }
};

const submitQuizResult = async (submitData) => {
    try {
        // Thêm log chi tiết để kiểm tra dữ liệu
        console.log('Data being submitted:', {
            quiz_id: submitData.quiz_id,
            user_id: submitData.user_id,
            answers: submitData.answers,
            score: submitData.score,
            // Kiểm tra xem có thiếu trường required nào không
            missingFields: {
                quiz_id: !submitData.quiz_id,
                user_id: !submitData.user_id,
                answers: !submitData.answers,
                score: submitData.score === undefined,
                reading_id: !submitData.reading_id,
                title: !submitData.title
            }
        });

        const response = await axios.post(`${API_URL}/results`, submitData);
        return response.data;
    } catch (error) {
        console.error('Submit error details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw error;
    }
};

export const submitQuizService = {
    formatQuizSubmission,
    submitQuizResult
};

export default submitQuizService;
