const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    quiz_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    answers: [{
        question_index: Number,
        selected_answer: String,
        correct_answer: String,
        is_correct: Boolean
    }],
    score: {
        type: Number,
        required: true
    },
    reading_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Result', resultSchema);