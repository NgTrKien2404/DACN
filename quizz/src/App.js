import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Quiz from './pages/Quiz';
import QuizList from './pages/QuizList';
import QuizResult from './pages/QuizResult';
import Result from './pages/Result';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import User from './pages/User';
import QuizHistory from './pages/QuizHistory';
import './App.css';


const App = () => {
  const location = useLocation();
  const noHeaderRoutes = ['/login', '/register'];
  const shouldShowHeader = !noHeaderRoutes.includes(location.pathname);

  console.log('Components:', { Home, Login, Register, Quiz, QuizList });

  return (
    <AuthProvider>
      <div className="app-container">
        {shouldShowHeader && <Header />}
        <main className={!shouldShowHeader ? 'full-height' : ''}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/quiz" element={<QuizList />} />
            <Route path="/quiz/:id" element={<Quiz />} />
            <Route path="/quiz/:id/user/:userId" element={<Quiz />} />
            <Route path="/user" element={<User />} />
            <Route path="/quiz-result/:id" element={<QuizResult />} />
            <Route path="/result/:quizId" element={<Result />} />
            <Route path="/quiz-history" element={<QuizHistory />} />
          </Routes>
        </main>
        {shouldShowHeader && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;