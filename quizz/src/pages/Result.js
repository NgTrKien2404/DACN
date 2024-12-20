import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Result.css';

const Result = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/result/${quizId}`);
                if (response.data.success) {
                    setResult(response.data.result);
                }
            } catch (error) {
                console.error('Error fetching result:', error);
                setError('Could not load quiz result');
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [quizId]);

    if (loading) return <div className="result-loading">Loading result...</div>;
    if (error) return <div className="result-error">{error}</div>;
    if (!result) return <div className="result-error">No result found</div>;

    const correctAnswers = result.questions.filter(q => q.isCorrect).length;
    const totalQuestions = result.questions.length;

    return (
        <div className="result-container">
            <div className="result-header">
                <h1>{result.title}</h1>
                <div className="score-card">
                    <div className="score-circle">
                        <span className="score-number">{Math.round(result.score)}%</span>
                        <span className="score-label">Score</span>
                    </div>
                    <div className="score-details">
                        <div className="detail-item">
                            <span className="label">Correct Answers:</span>
                            <span className="value">{correctAnswers}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Total Questions:</span>
                            <span className="value">{totalQuestions}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="result-actions">
                <button 
                    className="action-button review"
                    onClick={() => navigate(`/review/${quizId}`)}
                >
                    Review Answers
                </button>
                <button 
                    className="action-button new-quiz"
                    onClick={() => navigate('/quizzes')}
                >
                    Try Another Quiz
                </button>
            </div>

            <div className="questions-review">
                <h2>Detailed Review</h2>
                {result.questions.map((question, index) => (
                    <div key={index} className={`question-review-item ${question.isCorrect ? 'correct' : 'incorrect'}`}>
                        <h3>Question {index + 1}</h3>
                        <p className="question-text">{question.questionText}</p>
                        
                        <div className="answers-comparison">
                            <div className="user-answer">
                                <span className="label">Your Answer:</span>
                                <span className={`answer ${question.isCorrect ? 'correct' : 'incorrect'}`}>
                                    {question.userAnswer || 'No answer'}
                                </span>
                            </div>
                            {!question.isCorrect && (
                                <div className="correct-answer">
                                    <span className="label">Correct Answer:</span>
                                    <span className="answer correct">{question.correctAnswer}</span>
                                </div>
                            )}
                        </div>

                        <div className="options-list">
                            {question.options.map((option, optIndex) => (
                                <div 
                                    key={optIndex} 
                                    className={`option ${
                                        option.option === question.correctAnswer ? 'correct' : 
                                        option.option === question.userAnswer ? 'selected' : ''
                                    }`}
                                >
                                    {option.option}. {option.text}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Result;