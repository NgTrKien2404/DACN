const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        console.log('Headers:', req.headers);
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Không tìm thấy token xác thực' });
        }

        console.log('Processing token:', token);
        const decoded = jwt.verify(token, 'your_jwt_secret');
        console.log('Decoded token:', decoded);

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Token không hợp lệ',
                error: error.message 
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token đã hết hạn',
                error: error.message 
            });
        }
        res.status(500).json({ 
            message: 'Lỗi xác thực',
            error: error.message 
        });
    }
};

module.exports = authMiddleware; 