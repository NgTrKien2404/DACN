import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
//import quizService from '../Services/quizService';
import './styles/QuizList.css';

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/quizzes', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                console.log("Fetched quiz data:", data); // Debug log
                setQuizzes(data);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };

        fetchQuizzes();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredQuizzes = quizzes.filter(quiz =>
        quiz.Reading[0]?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="quiz-list-container">
            <h1 className="page-title">Quiz List</h1>
            
            <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
            />
            
            <div className="quiz-grid">
                {filteredQuizzes.map((quiz) => {
                    console.log("Quiz structure:", {
                        id: quiz._id,
                        title: quiz.title,
                        questions: quiz.questions,
                        fullQuiz: quiz
                    });
                    
                    return (
                        <div key={quiz._id} className="quiz-card">
                            <div className="quiz-card-content">
                                <div className="quiz-icon">
                                    📚
                                </div>
                                <h3 className="quiz-title">{quiz.Reading?.[0]?.title || "Reading Quiz"}</h3>
                                <div className="quiz-info">
                                    <span className="info-item">
                                        <i className="fas fa-question-circle"></i>
                                        {quiz.Reading?.[0]?.questions?.length || 'N/A'} Quiz
                                    </span>
                                    <span className="info-item">
                                        <i className="fas fa-clock"></i>
                                        6 minutes
                                    </span>
                                </div>
                                <p className="quiz-description">
                                    {quiz.Reading?.[0]?.content?.substring(0, 100)}...
                                </p>
                                <Link 
                                    to={`/quiz/${quiz._id}`} 
                                    className="start-quiz-button"
                                >
                                    Start Quiz
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizList; 