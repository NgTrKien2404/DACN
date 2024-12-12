import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import resultService from '../Services/resultService';
import './styles/QuizResult.css';

const QuizResult = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const data = await resultService.getResultById(id);
                setResult(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!result) return <div>No result found</div>;

    return (
        <div className="quiz-result-container">
            <div className="result-header">
                <h1>Quiz Results</h1>
                <div className="score-display">
                    <div className="score-circle">
                        <span className="score-number">{result.score}%</span>
                        <span className="score-label">Score</span>
                    </div>
                </div>
            </div>

            <div className="answers-section">
                <h2>Your Answers</h2>
                {result.answers.map((answer, index) => (
                    <div 
                        key={index} 
                        className={`answer-card ${answer.isCorrect ? 'correct' : 'incorrect'}`}
                    >
                        <div className="question-number">Question {index + 1}</div>
                        <div className="answer-details">
                            <div className="selected-answer">
                                <span className="label">Your Answer:</span>
                                <span className="value">{answer.selectedOption}</span>
                            </div>
                            <div className="answer-status">
                                {answer.isCorrect ? (
                                    <span className="correct-badge">
                                        <i className="fas fa-check"></i> Correct
                                    </span>
                                ) : (
                                    <span className="incorrect-badge">
                                        <i className="fas fa-times"></i> Incorrect
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="result-actions">
                <button 
                    className="retry-button"
                    onClick={() => navigate('/quiz')}
                >
                    Try Another Quiz
                </button>
                <button 
                    className="home-button"
                    onClick={() => navigate('/')}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default QuizResult; 