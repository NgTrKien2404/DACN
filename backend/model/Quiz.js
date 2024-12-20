import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import quizService from '../Services/quizService';
import { FaUser, FaIdCard, FaEnvelope } from 'react-icons/fa';
import './styles/Quiz.css';

const Quiz = () => {
    const { id: quizId, userId } = useParams();
    
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
    const [userResult, setUserResult] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const getUserData = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUserData(parsedUser);
                console.log("User data loaded:", parsedUser); // Debug log
            }
        };

        getUserData();
    }, []);

    useEffect(() => {
        const fetchQuizAndResult = async () => {
            try {
                setIsLoading(true);
                const quizData = await quizService.getQuizById(quizId);
                setQuiz(quizData);

                if (userId) {
                    const resultResponse = await fetch(`http://localhost:5000/api/results/user/${userId}/quiz/${quizId}`);
                    const resultData = await resultResponse.json();
                    if (resultResponse.ok) {
                        setUserResult(resultData);
                    }

                    const userResponse = await fetch(`http://localhost:5000/api/users/${userId}`);
                    const userData = await userResponse.json();
                    if (userResponse.ok) {
                        setUserData(userData);
                    }
                }
            } catch (err) {
                console.error('Error:', err);
                setError('Failed to load quiz or result');
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuizAndResult();
    }, [quizId, userId]);

    const handleAnswerSelect = (questionIndex, selectedOption) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionIndex]: selectedOption
        }));
    };

    const handleSubmit = async () => {
        if (!quizId) {
            console.error('Quiz ID is undefined');
            alert('Quiz ID is not available. Please check the URL.');
            return;
        }

        try {
            // Lấy thông tin người dùng từ localStorage
            const storedUser = localStorage.getItem('user');
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');

            if (!storedUser || !userId || !quizId) {
                throw new Error('Please login first and ensure quizId is available');
            }

            const userData = JSON.parse(storedUser);
            console.log('User ID:', userId);
            console.log('User Data:', userData);
            console.log('Token:', token);

            // Kiểm tra userData trước khi sử dụng
            if (userData) {
                const userEmail = userData.email;
                const userName = userData.User_name;

                console.log('User Email:', userEmail);
                console.log('User Name:', userName);

                // Tiếp tục với logic gửi dữ liệu
                const answers = quiz.questions.map((question, index) => ({
                  //  questionText: question.text,
                    userAnswer: userAnswers[index],
                    correctAnswer: question.correctAnswer,
                    isCorrect: userAnswers[index] === question.correctAnswer
                }));

                const correctAnswers = answers.filter(answer => answer.isCorrect).length;
                const score = Math.round((correctAnswers / quiz.questions.length) * 100);

                const quizResult = {
                    user_id: userId,
                    quiz_id: quizId,
                    answers: answers,
                    score: score,
                    submittedAt: new Date().toISOString(),
                    userInfo: {
                        email: userEmail,
                        User_name: userName
                    }
                };

                console.log('Submitting quiz result:', quizResult);

                const response = await fetch('http://localhost:5000/api/quiz-result', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(quizResult)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to save quiz result');
                }

                const savedResult = await response.json();
                console.log('Saved quiz result:', savedResult);

                // Sử dụng answers đã có từ trước
                setSubmitted(true);
                setSubmitStatus({
                    isSubmitting: false,
                    error: null,
                    score: score // score đã được tính toán trước đó
                });

                // Hiển thị thông báo thành công
                alert(`Quiz submitted successfully! Your score: ${score}%`);
            } else {
                console.error('User data is null');
                alert('User data is not available. Please login again.');
            }
        } catch (err) {
            console.error('Error:', err);
            alert(err.message || 'Failed to submit quiz');
        }
    };

    if (isLoading) return <div className="quiz-loading">Loading...</div>;
    if (error) return <div className="quiz-error">{error}</div>;
    if (!quiz || !quiz.questions) return <div className="quiz-error">No quiz data available</div>;

    if (userResult && userData) {
        return (
            <div className="modern-quiz-container">
                <div className="quiz-content-wrapper">
                    {/* User Info Section */}
                    <div className="user-info-section">
                        <h3>User Information</h3>
                        <div className="user-info-grid">
                            
                            <div className="info-card">
                                <div className="info-icon"><FaUser /></div>
                                <div className="info-content">
                                    <label>Username</label>
                                    <p>{userData.User_name}</p>
                                </div>
                            </div>
                            <div className="info-card">
                                <div className="info-icon"><FaEnvelope /></div>
                                <div className="info-content">
                                    <label>Email</label>
                                    <p>{userData.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reading Panel */}
                    <div className="reading-panel">
                        <div className="reading-header">
                            <h2>{quiz.title}</h2>
                        </div>
                        <div className="reading-content">
                            {quiz.content}
                        </div>
                    </div>

                    {/* Result Review */}
                    <div className="answer-review">
                        <h3>Quiz Result</h3>
                        <div className="review-summary">
                            <p>Total Questions: {quiz.questions.length}</p>
                            <p>Correct Answers: {userResult.correctAnswers}</p>
                            <p>Score: {userResult.score}%</p>
                            <p>Submitted At: {new Date(userResult.submittedAt).toLocaleString()}</p>
                        </div>
                        <div className="review-details">
                            {userResult.answers.map((answer, index) => {
                                const question = quiz.questions[index];
                                return (
                                    <div key={index} className={`review-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                                        <p className="review-question">
                                            <strong>Question {index + 1}:</strong> {answer.questionText}
                                        </p>
                                        <div className="review-answers">
                                            <p className="user-answer">
                                                User's Answer: <strong>{answer.userAnswer}</strong>
                                                {answer.isCorrect ? 
                                                    <span className="correct-indicator">✓</span> : 
                                                    <span className="wrong-indicator">✗</span>
                                                }
                                            </p>
                                            {!answer.isCorrect && (
                                                <p className="correct-answer">
                                                    Correct Answer: <strong>{answer.correctAnswer}</strong>
                                                </p>
                                            )}
                                        </div>
                                        <div className="answer-options">
                                            {question.options.map((option, optIndex) => (
                                                <div 
                                                    key={optIndex} 
                                                    className={`option ${
                                                        option.label === answer.correctAnswer ? 'correct-option' : 
                                                        option.label === answer.userAnswer && !answer.isCorrect ? 'wrong-option' : ''
                                                    }`}
                                                >
                                                    {option.label}. {option.text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Hiển thị quiz bình thường
    const currentQuestionData = quiz.questions[currentQuestion];

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

            {submitted && (
                <div className="answer-review">
                    <div className="user-info-section">
                        <h3>User Information</h3>
                        <div className="user-info-grid">
                            <div className="info-card">
                                <div className="info-icon"><FaUser /></div>
                                <div className="info-content">
                                    <label>Username</label>
                                    <p>{userData?.User_name || 'Not available'}</p>
                                </div>
                            </div>
                            <div className="info-card">
                                <div className="info-icon"><FaEnvelope /></div>
                                <div className="info-content">
                                    <label>Email</label>
                                    <p>{userData?.email || 'Not available'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h3>Answer Review</h3>
                    <div className="review-summary">
                        <p>Total Questions: {quiz.questions.length}</p>
                        <p>Correct Answers: {Object.entries(userAnswers).filter(([index, answer]) => 
                            answer === quiz.questions[index].correctAnswer
                        ).length}</p>
                        <p>Score: {submitStatus.score}%</p>
                    </div>
                    <div className="review-details">
                        {quiz.questions.map((question, index) => {
                            const userAnswer = userAnswers[index] || 'Not answered';
                            const isCorrect = userAnswer === question.correctAnswer;
                            return (
                                <div key={index} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                                    <p className="review-question">
                                        <strong>Question {index + 1}:</strong> {question.questionText}
                                    </p>
                                    <div className="review-answers">
                                        <p className="user-answer">
                                            Your Answer: <strong>{userAnswer}</strong>
                                            {isCorrect ? 
                                                <span className="correct-indicator">✓</span> : 
                                                <span className="wrong-indicator">✗</span>
                                            }
                                        </p>
                                        {!isCorrect && (
                                            <p className="correct-answer">
                                                Correct Answer: <strong>{question.correctAnswer}</strong>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

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
        </div>
    );
};

export default Quiz;