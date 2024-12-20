const express = require('express');
const router = express.Router();
const Result = require('../model/Result');

router.post('/', async (req, res) => {
    console.log('Received POST request to /api/quiz-result');
    console.log('Request body:', req.body);

    try {
        const {
            userId,
            quizId,
            answers,
            score,
            submittedAt
        } = req.body;

        const formattedAnswers = answers.map(answer => ({
            questionText: answer.questionText,
            userAnswer: answer.userAnswer,
            correctAnswer: answer.correctAnswer,
            isCorrect: answer.isCorrect
        }));

        const quizResult = new Result({
            userId,
            quizId,
            answers: formattedAnswers,
            score,
            submittedAt: submittedAt || new Date()
        });

        const savedResult = await quizResult.save();
        console.log('Saved result:', savedResult);
        res.status(201).json(savedResult);
    } catch (error) {
        console.error('Error saving quiz result:', error);
        res.status(500).json({ message: 'Failed to save quiz result', error: error.message });
    }
});

// Endpoint to get quiz results for a specific user
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const results = await Result.find({ userId }).populate('quizId', 'title');
        res.json({ results });
    } catch (error) {
        console.error('Error fetching quiz results:', error);
        res.status(500).json({ message: 'Failed to fetch quiz results', error: error.message });
    }
});

module.exports = router;