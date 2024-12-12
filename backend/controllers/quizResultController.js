const QuizResult = require('../models/QuizResult');

exports.submitAndShowAnswers = async (req, res) => {
    try {
        const { quiz_id, user_id, answers } = req.body;

        // Validate input
        if (!quiz_id || !user_id || !Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid input data'
            });
        }

        // Format kết quả và đáp án
        const results = answers.map(answer => ({
            question_index: answer.question_index,
            question_text: answer.question_text,
            your_answer: answer.selected_answer,
            correct_answer: answer.correct_answer,
            is_correct: answer.selected_answer === answer.correct_answer,
            explanation: getExplanation(answer), // Thêm giải thích nếu cần
            options: answer.options
        }));

        // Tính điểm
        const total_questions = answers.length;
        const correct_answers = results.filter(r => r.is_correct).length;
        const score = Math.round((correct_answers / total_questions) * 100);

        // Trả về kết quả chi tiết
        res.status(200).json({
            success: true,
            data: {
                quiz_summary: {
                    total_questions,
                    correct_answers,
                    score,
                    status: score >= 60 ? 'PASSED' : 'FAILED'
                },
                detailed_results: results.map(result => ({
                    ...result,
                    status: result.is_correct ? 'Correct' : 'Incorrect',
                    feedback: getFeedback(result) // Thêm phản hồi cho từng câu
                }))
            }
        });

    } catch (error) {
        console.error('Error processing quiz results:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing quiz results',
            error: error.message
        });
    }
};

// Helper function để tạo giải thích
function getExplanation(answer) {
    if (answer.selected_answer === answer.correct_answer) {
        return "Correct! Good job!";
    }
    return `Incorrect. The correct answer is ${answer.correct_answer}. ${answer.explanation || ''}`;
}

// Helper function để tạo phản hồi
function getFeedback(result) {
    if (result.is_correct) {
        return "Well done! You got this question right.";
    }
    return `The correct answer was ${result.correct_answer}. Keep practicing!`;
}

// Get results by user
exports.getUserResults = async (req, res) => {
    try {
        const { userId } = req.params;
        const results = await QuizResult.find({ user_id: userId })
            .sort({ completed_at: -1 });

        res.json({
            success: true,
            data: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user results',
            error: error.message
        });
    }
}; 