const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    Option: { type: String, required: true },
    Text: { type: String, required: true }
});

const questionSchema = new mongoose.Schema({
    Question_text: { type: String, required: true },
    Options: [optionSchema],
    Correct_answer: { type: String, required: true },
    Response: { type: String, default: null }
});

const readingSchema = new mongoose.Schema({
    Reading_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    Title: { type: String, required: true },
    Content: { type: String, required: true },
    Question: [questionSchema]
});

const quizSchema = new mongoose.Schema({
    Start_time: { type: Date, required: true },
    End_time: { type: Date, required: true },
    Score: { type: Number, default: null },
    Reading: [readingSchema],
    user_id: { type: String, required: true }
});

module.exports = mongoose.model('Quiz', quizSchema);