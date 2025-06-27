// BE/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, match: [/.+@.+\..+/, 'Please enter a valid email address'] },
    password: { type: String, required: true, select: false },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: false, trim: true },
    role: {
        type: String,
        required: true,
        enum: ['DOCTOR', 'PHARMACIST', 'RECEPTIONIST', 'PATIENT'], // Bỏ 'ADMIN' nếu bạn không dùng
        default: 'PATIENT'
    }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) { return next(); }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);