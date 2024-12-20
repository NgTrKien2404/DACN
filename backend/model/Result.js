const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    userAnswer: { 
        type: String, 
        required: true 
    },
    correctAnswer: { 
        type: String, 
        required: true 
    },
    isCorrect: { 
        type: Boolean, 
        required: true 
    }
}, { _id: false });

const resultSchema = new mongoose.Schema({
    quizId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Quiz', 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    answers: [answerSchema],
    score: { 
        type: Number, 
        required: true,
        min: 0,
        max: 100
    },
    submittedAt: { 
        type: Date, 
        default: Date.now 
    },
    userInfo: {
        email: { type: String },
        User_name: { type: String }
    }
}, { 
    timestamps: true,
    versionKey: false
});

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;
