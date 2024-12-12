const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
// Register route
router.post('/register', async (req, res) => {
    try {
        console.log('Received request body:', req.body);

        const { User_name, email, password } = req.body;

        // Validate input
        if (!User_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin'
            });
        }

        // Check if user exists
        const existingUser = await users.findOne({ 
            $or: [{ email }, { User_name }] 
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email hoặc tên người dùng đã tồn tại'
            });
        }

        // Create new user (không hash password)
        const user = new users({
            User_name,
            email,
            password // Lưu password trực tiếp
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công'
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});
// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email, password });

        // Tìm user theo email
        const user = await users.findOne({ email });
        console.log('Found user:', user);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email không tồn tại'
            });
        }

        // So sánh password trực tiếp
        if (password !== user.password) {
            return res.status(401).json({
                success: false,
                message: 'Mật khẩu không đúng'
            });
        }

        // Tạo token
        const token = jwt.sign(
            { 
                userId: users._id,
                email: users.email,
                User_name: users.User_name 
            },
            'your_jwt_secret',
            { expiresIn: '24h' }
        );

        // Trả về thông tin
        res.json({
            success: true,
            message: 'Đăng nhập thành công',
            token,
            user: {
                id: users._id,
                User_name: users.User_name,
                email: users.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
});

module.exports = router; 