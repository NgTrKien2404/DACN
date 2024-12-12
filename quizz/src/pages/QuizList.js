import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import quizService from '../Services/quizService';
import './styles/QuizList.css';

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setIsLoading(true);
                const response = await quizService.getQuizzes();
                console.log('Quiz response:', response);
                
                // Kiểm tra response là một mảng
                if (Array.isArray(response)) {
                    setQuizzes(response);
                } else {
                    setQuizzes([]);
                }
            } catch (err) {
                console.error('Error fetching quizzes:', err);
                setError('Failed to load quizzes');
                setQuizzes([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    if (isLoading) {
        return (
            <div className="quiz-list-container">
                <div className="loading-state">
                    <h2>Loading Quizzes...</h2>
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="quiz-list-container">
                <div className="error-state">
                    <h2>Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-list-container">
            <h1>Available Quizzes</h1>
            <div className="quiz-grid">
                {quizzes.map((quiz) => (
                    <div key={quiz._id} className="quiz-card">
                        <h2>{quiz.Reading[0]?.title || 'Untitled Quiz'}</h2>
                        <div className="quiz-info">
                            <p>Start Time: {new Date(quiz.Start_time).toLocaleString()}</p>
                            <p>End Time: {new Date(quiz.End_time).toLocaleString()}</p>
                            <p>Questions: {quiz.questions?.length || 0}</p>
                        </div>
                        <Link 
                            to={`/quiz/${quiz._id}`} 
                            className="start-quiz-btn"
                        >
                            Start Quiz
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizList; 