const Result = require('../model/Result');

exports.submitQuiz = async (req, res) => {
    try {
        console.log('Received request body:', req.body);

        const { 
            quiz_id, 
            user_id, 
            answers,
            reading,
            start_time,
            end_time,
            status = 'completed'
        } = req.body;

        // Validate required fields
        if (!quiz_id || !user_id || !answers) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                received: { quiz_id, user_id, answersLength: answers?.length }
            });
        }

        // Log answers to check data
        console.log('Answers:', answers);

        // Calculate score
        const totalQuestions = answers.length;
        const correctAnswers = answers.filter(answer => 
            answer.selected_answer === answer.correct_answer
        ).length;
        const calculatedScore = Math.round((correctAnswers / totalQuestions) * 100);

        // Create new result document
        const newResult = new Result({
            quiz_id,
            user_id,
            reading,
            questions: answers.map(answer => ({
                question_text: answer.question_text,
                options: answer.options,
                selected_answer: answer.selected_answer,
                correct_answer: answer.correct_answer,
                is_correct: answer.selected_answer === answer.correct_answer
            })),
            score: calculatedScore,
            status,
            start_time: new Date(start_time),
            end_time: new Date(end_time),
            created_at: new Date()
        });

        console.log('Attempting to save result:', newResult);

        // Save to database
        const savedResult = await newResult.save();
        console.log('Result saved successfully:', savedResult);

        // Return success response
        res.status(201).json({
            success: true,
            message: 'Quiz result submitted successfully',
            data: savedResult
        });

    } catch (error) {
        console.error('Submit quiz error details:', error);

        // Add more specific error logging
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error occurred',
                error: error.message
            });
        }

        // Return generic error message
        res.status(500).json({
            success: false,
            message: 'Error saving result',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
