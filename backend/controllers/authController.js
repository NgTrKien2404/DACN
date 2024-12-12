const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authController = {
    // Đăng ký
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;
            
            // Kiểm tra email tồn tại
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email đã được sử dụng' });
            }

            // Tạo user mới
            const newUser = new User({ username, email, password });
            await newUser.save();

            res.status(201).json({ message: 'Đăng ký thành công' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Đăng nhập
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            
            // Tìm user
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Email không tồn tại' });
            }

            // Kiểm tra password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Mật khẩu không đúng' });
            }

            // Tạo token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1d'
            });

            res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = authController; 