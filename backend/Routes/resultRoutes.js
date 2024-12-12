const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const auth = require('../middleware/auth');

// Submit quiz result
router.post('/', auth, async (req, res) => {
    try {
        const {
            quiz_id,
            answers,
            reading_id,
            title,
            score
        } = req.body;

        const result = new Result({
            quiz_id,
            user_id: req.user.id,
            reading_id,
            title,
            answers,
            score,
            submittedAt: new Date()
        });

        await result.save();

        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error submitting result:', error);
        res.status(500).json({
            success: false,
            error: 'Error submitting quiz result'
        });
    }
});

// Get user's results
router.get('/user', auth, async (req, res) => {
    try {
        const results = await Result.find({ user_id: req.user.id })
            .sort({ submittedAt: -1 });

        res.json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({
            success: false,
            error: 'Error fetching results'
        });
    }
});

module.exports = router; 