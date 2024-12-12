const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    User_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Thêm method so sánh password trực tiếp
userSchema.methods.comparePassword = function(candidatePassword) {
    return this.password === candidatePassword;
};

module.exports = mongoose.model('users', userSchema);
