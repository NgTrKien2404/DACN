const express = require('express');
const router = express.Router();
const quizResultController = require('../controllers/quizResultController');

// Submit và hiển thị đáp án
router.post('/check-answers', quizResultController.submitAndShowAnswers);

module.exports = router; 