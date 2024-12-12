const User = require('../model/User');
const Result = require('../model/Result');

const userController = {
    getProfile: async (req, res) => {
        try {
            console.log('Getting profile for user:', req.user);
            
            const user = await User.findById(req.user.id);
            console.log('Found user:', user);
            
            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng' });
            }
            
            const userObject = user.toObject();
            delete userObject.password;
            
            res.json(userObject);
        } catch (error) {
            console.error('getProfile error:', error);
            res.status(500).json({ 
                message: 'Lỗi server',
                error: error.message 
            });
        }
    },

    updateProfile: async (req, res) => {
        try {
            console.log('Updating profile for user:', req.user);
            console.log('Update data:', req.body);
            
            const { User_name, email } = req.body;

            const updatedUser = await User.findByIdAndUpdate(
                req.user.id,
                { User_name, email },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng' });
            }

            const userObject = updatedUser.toObject();
            delete userObject.password;
            
            res.json(userObject);
        } catch (error) {
            console.error('updateProfile error:', error);
            res.status(500).json({ 
                message: 'Lỗi server',
                error: error.message 
            });
        }
    },

    getQuizHistory: async (req, res) => {
        try {
            console.log('Getting quiz history for user:', req.user);
            
            const history = await Result.find({ user_id: req.user.id })
                .sort('-created_at');
            
            console.log('Found history:', history);
            res.json(history);
        } catch (error) {
            console.error('getQuizHistory error:', error);
            res.status(500).json({ 
                message: 'Lỗi server',
                error: error.message 
            });
        }
    }
};

module.exports = userController; 