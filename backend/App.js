require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./Routes/authRoutes');
const quizResultRoutes = require('./Routes/quizResultRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/quiz-result', quizResultRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!', error: err.message });
});

// 404 handler
app.use((req, res) => {
    console.log('404 for:', req.method, req.path);
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;