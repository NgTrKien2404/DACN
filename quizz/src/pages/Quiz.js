import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import quizService from '../Services/quizService';
import submitQuizService from '../Services/submitQuizService';
import './styles/Quiz.css';

const Quiz = () => {
    const { id: quizId } = useParams();
    const userId = localStorage.getItem('userId');
    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [showAnswers, setShowAnswers] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [submitStatus, setSubmitStatus] = useState({
        isSubmitting: false,
        error: null,
        score: null
    });

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setIsLoading(true);
                const quizData = await quizService.getQuizById(quizId);
                console.log('Quiz Data:', quizData);
                setQuiz(quizData);
            } catch (err) {
                console.error('Error:', err);
                setError('Failed to load quiz');
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId]);

    const handleAnswerSelect = (questionIndex, selectedOption) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionIndex]: selectedOption
        }));
    };

    const handleSubmit = async () => {
        try {
            setSubmitStatus(prev => ({ ...prev, isSubmitting: true, error: null }));

            // Log current state
            console.log('Current quiz state:', {
                quiz,
                userAnswers,
                userId
            });

            // Format và submit
            const submitData = submitQuizService.formatQuizSubmission(quiz, userAnswers, userId);
            const result = await submitQuizService.submitQuizResult(submitData);

            if (result.success) {
                setSubmitted(true);
                setShowAnswers(true);
                setSubmitStatus({
                    isSubmitting: false,
                    error: null,
                    score: result.score
                });
                alert(`Quiz submitted successfully! Your score: ${result.score}%`);
            } else {
                throw new Error(result.error || 'Submission failed');
            }
        } catch (err) {
            console.error('Submit error:', err);
            setSubmitStatus({
                isSubmitting: false,
                error: err.message,
                score: null
            });
            alert('Failed to submit quiz: ' + err.message);
        }
    };

    if (isLoading) return <div className="quiz-loading">Loading...</div>;
    if (error) return <div className="quiz-error">{error}</div>;
    if (!quiz || !quiz.questions) return <div className="quiz-error">No quiz data available</div>;

    const currentQuestionData = quiz.questions[currentQuestion];
    console.log('Current Question:', currentQuestionData);

    return (
        <div className="modern-quiz-container">
            <div className="quiz-progress-bar">
                <div 
                    className="progress" 
                    style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                ></div>
            </div>

            <div className="quiz-content-wrapper">
                {/* Reading Panel */}
                <div className="reading-panel">
                    <div className="reading-header">
                        <h2>{quiz.title}</h2>
                    </div>
                    <div className="reading-content">
                        {quiz.content}
                    </div>
                </div>

                {/* Question Panel */}
                <div className="question-panel">
                    <div className="question-header">
                        <span className="question-counter">
                            Question {currentQuestion + 1}/{quiz.questions.length}
                        </span>
                    </div>

                    <div className="question-content">
                        <p className="question-text">
                            {currentQuestionData.questionText}
                        </p>

                        <div className="options-list">
                            {currentQuestionData.options.map((option, index) => {
                                console.log('Option:', option); // Debug option data
                                const isSelected = userAnswers[currentQuestion] === option.label;
                                const isCorrect = showAnswers && 
                                                currentQuestionData.correctAnswer === option.label;

                                return (
                                    <label 
                                        key={index} 
                                        className={`option-label ${isSelected ? 'selected' : ''} 
                                                  ${showAnswers && isCorrect ? 'correct' : ''} 
                                                  ${showAnswers && isSelected && !isCorrect ? 'incorrect' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${currentQuestion}`}
                                            value={option.label}
                                            checked={isSelected}
                                            onChange={() => handleAnswerSelect(currentQuestion, option.label)}
                                            disabled={submitted}
                                        />
                                        <span className="radio-custom"></span>
                                        <span className="option-text">
                                            <strong>{option.label}.</strong> {option.text}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div className="navigation-controls">
                        <button
                            className="nav-button prev"
                            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                            disabled={currentQuestion === 0}
                        >
                            Previous
                        </button>

                        {currentQuestion === quiz.questions.length - 1 ? (
                            <button
                                className="submit-button"
                                onClick={handleSubmit}
                                disabled={Object.keys(userAnswers).length !== quiz.questions.length || submitted}
                            >
                                {submitted ? 'Submitted' : 'Submit Quiz'}
                            </button>
                        ) : (
                            <button
                                className="nav-button next"
                                onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {submitStatus.isSubmitting && (
                <div className="submit-loading">
                    Submitting your quiz...
                </div>
            )}

            {submitStatus.error && (
                <div className="submit-error">
                    {submitStatus.error}
                </div>
            )}

            {submitStatus.score !== null && (
                <div className="submit-success">
                    Your score: {submitStatus.score}%
                </div>
            )}
        </div>
    );
};

export default Quiz;