const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./model/User');
const Result = require('./model/Result');
const authMiddleware = require('./middleware/auth');
const userController = require('./controllers/userController');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/myDatabase';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Test route working' });
});



const questionSchema = new mongoose.Schema({
    question_text: { type: String, required: true },
    options: [
      {
        option: { type: String, required: true },
        text: { type: String, required: true },
      },
    ],
    correct_answer: { type: String, required: true },
    response: { type: String, default: null },
  });
  
  const Question = mongoose.model('Question', questionSchema);
  
  

// Register route
app.post('/api/register', async (req, res) => {
    try {
        console.log('Bắt đầu xử lý đăng ký:', req.body);

        const { User_name, email, password } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!User_name || !email || !password) {
            console.log('Thiếu thông tin:', { User_name, email, password });
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin'
            });
        }

        console.log('Kiểm tra user tồn tại...');
        const existingUser = await User.findOne({ 
            $or: [{ email }, { User_name }] 
        });

        if (existingUser) {
            console.log('User đã tồn tại:', existingUser);
            return res.status(400).json({
                success: false,
                message: 'Email hoặc tên người dùng đã tồn tại'
            });
        }

        console.log('Tạo user mới...');
        // Kiểm tra User model
        console.log('User model:', User);
        
        const user = new User({
            User_name,
            email,
            password
        });

        console.log('User trước khi lưu:', user);

        try {
            await user.save();
            console.log('User đã được lưu thành công');
        } catch (saveError) {
            console.error('Lỗi khi lưu user:', saveError);
            throw saveError;
        }

        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            user: {
                id: user._id,
                User_name: user.User_name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Chi tiết lỗi đăng ký:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });

        // Kiểm tra các loại lỗi cụ thể
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email hoặc tên người dùng đã tồn tại'
            });
        }

        // Kiểm tra kết nối database
        if (error.name === 'MongoError' || error.name === 'MongooseError') {
            console.error('Lỗi database:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi kết nối database'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Lỗi server, vui lòng thử lại sau',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Login route - đảm bảo method là POST
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email, password });

        const user = await User.findOne({ email });
        console.log('Found user:', user);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không đúng'
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không đúng'
            });
        }

        const token = jwt.sign(
            { id: user._id },
            'your_jwt_secret',
            { expiresIn: '1h' }
        );

       // Trả về đầy đủ thông tin user
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                User_name: user.User_name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});
// Quiz Schema
const quizSchema = new mongoose.Schema({
    Start_time: {
        type: Date,
        required: true
    },
    End_time: {
        type: Date,
        required: true
    },
    Score: {
        type: Number,
        default: null
    },
    Reading: [{
        reading_id: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        questions: [{
            question_text: {
                type: String,
                required: true
            },
            options: [{
                option: String,
                text: String
            }],
            correct_answer: {
                type: String,
                required: true
            },
            response: {
                type: String,
                default: null
            }
        }]
    }],
    user_id: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Quiz = mongoose.model('Quiz', quizSchema);

// API lấy danh sách quiz
app.get('/api/quizzes', async (req, res) => {
    try {
        const quizzes = await Quiz.find().select('-questions.correctAnswer');
        res.json(quizzes);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// API kiểm tra quiz tồn tại
app.get('/api/check-quiz/:id', async (req, res) => {
    try {
        console.log('Checking quiz with ID:', req.params.id);
        const quiz = await Quiz.findById(req.params.id);
        console.log('Found quiz:', quiz);
        res.json({
            exists: !!quiz,
            quiz: quiz
        });
    } catch (error) {
        console.error('Error checking quiz:', error);
        res.status(500).json({
            error: error.message
        });
    }
});

// API lấy chi tiết bài thi
app.get('/api/quizzes/:id', async (req, res) => {
    try {
        console.log('Fetching quiz with ID:', req.params.id);
        const quiz = await Quiz.findById(req.params.id);
        
        if (!quiz) {
            console.log('Quiz not found');
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài thi'
            });
        }

        // Chuyển đổi thời gian thành số phút cho duration
        const duration = Math.floor((new Date(quiz.End_time) - new Date(quiz.Start_time)) / (1000 * 60));

        const formattedQuiz = {
            id: quiz._id,
            title: quiz.Reading[0].title,
            content: quiz.Reading[0].content,
            duration: duration,
            questions: quiz.Reading[0].questions.map(q => ({
                questionText: q.question_text,
                options: q.options.map(opt => ({
                    label: opt.option,
                    text: opt.text
                })),
                correctAnswer: q.correct_answer
            })),
            startTime: quiz.Start_time,
            endTime: quiz.End_time,
            status: quiz.status
        };

        console.log('Formatted quiz:', formattedQuiz);
        res.json(formattedQuiz);
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
});

// API submit quiz
app.post('/api/quiz-result', async (req, res) => {
    try {
        console.log('1. Received request body:', JSON.stringify(req.body, null, 2));

        const { answers, user_id, quiz_id, score, userInfo } = req.body;

        // Kiểm tra và log dữ liệu đầu vào
        console.log('2. Input validation:', { 
            hasAnswers: !!answers && Array.isArray(answers), 
            answersLength: answers?.length,
            userId: user_id, 
            quizId: quiz_id,
            score: score,
            userInfo: userInfo
        });

        // Kiểm tra dữ liệu đầu vào
        if (!answers || !Array.isArray(answers) || !user_id || !quiz_id || score === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin cần thiết hoặc dữ liệu không hợp lệ'
            });
        }

        // Kiểm tra từng câu trả lời
        const validAnswers = answers.map(answer => ({
            userAnswer: answer.userAnswer || '',
            correctAnswer: answer.correctAnswer || '',
            isCorrect: answer.isCorrect || false
        }));

        // Kiểm tra định dạng MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(quiz_id) || !mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid quiz_id or user_id format'
            });
        }

        // Lấy quiz từ cơ sở dữ liệu
        const quiz = await Quiz.findById(quiz_id);
        console.log('3. Quiz found:', quiz ? 'Yes' : 'No');

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài quiz'
            });
        }

        // Tạo đối tượng Result mới
        const result = new Result({
            quizId: quiz_id,
            userId: user_id,
            answers: answers,  // Sử dụng trực tiếp answers từ request
            score: score,
            submittedAt: new Date(),
            userInfo: userInfo,
            quizTitle: quiz.title, // Lưu tiêu đề bài thi
        });

        console.log('4. Result object to save:', JSON.stringify(result, null, 2));

        try {
            const savedResult = await result.save();
            console.log('5. Result saved successfully:', savedResult);

            res.json({
                success: true,
                message: 'Kết quả bài quiz đã được lưu thành công',
                result: savedResult
            });
        } catch (saveError) {
            console.error('6. Error saving result:', saveError);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi lưu kết quả',
                error: saveError.message
            });
        }

    } catch (error) {
        console.error('7. General error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lưu kết quả quiz',
            error: error.message
        });
    }
});


// API tạo quiz mới
app.post('/api/quizzes', async (req, res) => {
    try {
        const quiz = new Quiz(req.body);
        await quiz.save();
        res.status(201).json({
            success: true,
            message: 'Tạo bài thi thành công',
            quiz
        });
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo bài thi'
        });
    }
});



// API lấy kết quả bài thi
app.get('/api/result/:id', async (req, res) => {
    try {
        const result = await Result.findById(req.params.id);
        
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy kết quả'
            });
        }

        res.json({
            success: true,
            result: {
                id: result._id,
                quiz_id: result.quiz_id,
                user_id: result.user_id,
                score: result.score,
                answers: result.answers,
                title: result.title,
                submittedAt: result.submittedAt,
                reading_id: result.reading_id
            }
        });

    } catch (error) {
        console.error('Error fetching result:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy kết quả',
            error: error.message
        });
    }
});

// Thêm routes cho user
app.get('/api/profile', authMiddleware, userController.getProfile);
app.put('/api/profile', authMiddleware, userController.updateProfile);
app.get('/api/quiz-history', authMiddleware, userController.getQuizHistory);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test URL: http://localhost:${PORT}/test`);
    console.log(`Register URL: http://localhost:${PORT}/api/register`);
    console.log(`Login URL: http://localhost:${PORT}/api/login`);
});

app.get('/api/results/:quizId', authMiddleware, async (req, res) => {
    try {
        const results = await Result.find({
            quizId: req.params.quizId,
            userId: req.user._id
        }).sort({ submittedAt: -1 });

        res.json({
            success: true,
            results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching results',
            error: error.message
        });
    }
});

// API để lấy lịch sử kết quả bài thi của user
app.get('/api/quiz-results/:userId', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
        }

        // Tìm tất cả kết quả của user
        const results = await Result.find({ userId })
            .sort({ submittedAt: -1 })
            .lean();

        if (!results.length) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy kết quả nào'
            });
        }

        // Format lại dữ liệu trước khi gửi về client
        const formattedResults = results.map(result => ({
            id: result._id,
            quizTitle: result.quizTitle || 'Unknown Quiz',
            quizDescription: result.quizDescription,
            score: result.score,
            submittedAt: result.submittedAt,
            correctAnswers: result.answers.filter(answer => answer.isCorrect).length,
            totalQuestions: result.answers.length
        }));

        res.json({
            success: true,
            results: formattedResults
        });

    } catch (error) {
        console.error('Error fetching quiz results:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy lịch sử bài thi',
            error: error.message
        });
    }
});




