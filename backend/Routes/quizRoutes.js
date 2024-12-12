const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getQuizzes,
    getQuizById,
    createQuiz,
    submitQuiz,
    getQuizResult
} = require('../controllers/quizController');
const Quiz = require('../models/Quiz');

router.use(protect); // Bảo vệ tất cả routes

router.route('/')
    .get(getQuizzes)
    .post(createQuiz);

router.route('/:id')
    .get(getQuizById);

router.route('/:id/submit')
    .post(submitQuiz);

router.route('/:id/result')
    .get(getQuizResult);

// Submit quiz responses
router.post('/quizzes/:id/submit', async (req, res) => {
    try {
        const { id } = req.params;
        const { responses } = req.body;

        console.log('Received quiz submission:', {
            quizId: id,
            responses: responses
        });

        // Tìm quiz trong database
        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Kiểm tra xem quiz có đang trong thời gian làm bài không
        const now = new Date();
        const startTime = new Date(quiz.Start_time);
        const endTime = new Date(quiz.End_time);

        if (now < startTime || now > endTime) {
            return res.status(400).json({ message: 'Quiz is not active' });
        }

        // Tính điểm
        let score = 0;
        const questionResults = [];

        responses.forEach(response => {
            const question = quiz.Reading[0].questions[response.questionIndex];
            const isCorrect = question.correct_answer === response.selectedOption;
            
            if (isCorrect) {
                score += 1;
            }

            questionResults.push({
                questionIndex: response.questionIndex,
                selectedOption: response.selectedOption,
                correctOption: question.correct_answer,
                isCorrect: isCorrect
            });
        });

        // Cập nhật kết quả vào database
        quiz.Score = (score / quiz.Reading[0].questions.length) * 100;
        quiz.status = 'completed';
        
        // Lưu câu trả lời của người dùng
        quiz.Reading[0].questions.forEach((question, index) => {
            const response = responses.find(r => r.questionIndex === index);
            if (response) {
                question.response = response.selectedOption;
            }
        });

        await quiz.save();

        // Trả về kết quả
        res.json({
            message: 'Quiz submitted successfully',
            score: quiz.Score,
            totalQuestions: quiz.Reading[0].questions.length,
            correctAnswers: score,
            questionResults: questionResults
        });

    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ message: 'Error submitting quiz', error: error.message });
    }
});

module.exports = router;