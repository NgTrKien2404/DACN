import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const formatQuizSubmission = (quiz, userAnswers, userId) => {
    try {
        const formattedAnswers = Object.entries(userAnswers).map(([index, option]) => ({
            question_index: parseInt(index),
            selected_answer: option,
            is_correct: quiz.questions[parseInt(index)].correctAnswer === option
        }));

        const correctAnswers = formattedAnswers.filter(answer => answer.is_correct).length;
        const score = Math.round((correctAnswers / quiz.questions.length) * 100);

        return {
            quiz_id: quiz.id,
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
        const token = localStorage.getItem('token');
        console.log('Submitting data:', submitData);

        const response = await axios.post(`${API_URL}/results/submit`, submitData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Server response:', response.data);

        return {
            success: true,
            data: response.data,
            score: submitData.score
        };
    } catch (error) {
        console.error('Submit error:', error);
        throw new Error(
            error.response?.data?.message || 
            error.message || 
            'Failed to submit quiz'
        );
    }
};

export const submitQuizService = {
    formatQuizSubmission,
    submitQuizResult
};

export default submitQuizService; 