const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    Start_time: {
        type: Date,
        required: true
    },
    End_time: {
        type: Date,
        required: true
    },
    Score: {
        type: Number,
        default: null
    },
    Reading: [{
        reading_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        questions: [{
            question_text: {
                type: String,
                required: true
            },
            options: [{
                option: {
                    type: String,
                    required: true
                },
                text: {
                    type: String,
                    required: true
                }
            }],
            correct_answer: {
                type: String,
                required: true
            },
            response: {
                type: String,
                default: null
            }
        }]
    }],
    user_id: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quiz', QuizSchema);