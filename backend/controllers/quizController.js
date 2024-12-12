const Quiz = require('../models/Quiz');

// Lấy danh sách bài thi
exports.getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ user_id: req.user.id })
            .select('Start_time End_time Score status')
            .sort('-created_at');

        res.json({
            success: true,
            data: quizzes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching quizzes',
            error: error.message
        });
    }
};

// Lấy chi tiết một bài thi
exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            user_id: req.user.id
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        // Nếu bài thi chưa bắt đầu
        if (new Date() < new Date(quiz.Start_time)) {
            return res.status(403).json({
                success: false,
                message: 'Quiz has not started yet'
            });
        }

        // Nếu bài thi đã kết thúc
        if (new Date() > new Date(quiz.End_time)) {
            return res.status(403).json({
                success: false,
                message: 'Quiz has ended'
            });
        }

        // Cập nhật trạng thái bài thi
        if (quiz.status === 'pending') {
            quiz.status = 'in_progress';
            await quiz.save();
        }

        res.json({
            success: true,
            data: quiz
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching quiz',
            error: error.message
        });
    }
};

// Tạo bài thi mới
exports.createQuiz = async (req, res) => {
    try {
        const quizData = {
            ...req.body,
            user_id: req.user.id,
            status: 'pending'
        };

        const quiz = await Quiz.create(quizData);
        res.status(201).json({
            success: true,
            data: quiz
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating quiz',
            error: error.message
        });
    }
};

// Nộp bài thi
exports.submitQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            user_id: req.user.id
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        // Kiểm tra thời gian
        const now = new Date();
        if (now > new Date(quiz.End_time)) {
            return res.status(403).json({
                success: false,
                message: 'Quiz has ended'
            });
        }

        // Cập nhật câu trả lời
        const { responses } = req.body;
        let correctCount = 0;
        let totalQuestions = 0;

        quiz.Reading.forEach(reading => {
            reading.Question.forEach(question => {
                totalQuestions++;
                const response = responses.find(r => r.questionId === question._id.toString());
                if (response) {
                    question.Response = response.answer;
                    if (response.answer === question.Correct_answer) {
                        correctCount++;
                    }
                }
            });
        });

        // Tính điểm
        quiz.Score = (correctCount / totalQuestions) * 100;
        quiz.status = 'completed';
        await quiz.save();

        res.json({
            success: true,
            data: {
                score: quiz.Score,
                correctCount,
                totalQuestions
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error submitting quiz',
            error: error.message
        });
    }
};

// Lấy kết quả bài thi
exports.getQuizResult = async (req, res) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            user_id: req.user.id,
            status: 'completed'
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz result not found'
            });
        }

        const result = {
            score: quiz.Score,
            startTime: quiz.Start_time,
            endTime: quiz.End_time,
            questions: quiz.Reading.flatMap(reading => 
                reading.Question.map(question => ({
                    question: question.Question_text,
                    correctAnswer: question.Correct_answer,
                    userAnswer: question.Response,
                    isCorrect: question.Response === question.Correct_answer
                }))
            )
        };

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching quiz result',
            error: error.message
        });
    }
};