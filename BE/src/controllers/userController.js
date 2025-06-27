// BE/src/controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Đăng ký (do RECEPTIONIST tạo, nên cần được bảo vệ)
exports.registerUser = async (req, res) => {
    const { userId, username, email, password, fullName, phone, role } = req.body;
    try {
        let user = await User.findOne({ $or: [{ userId }, { username }, { email }] });
        if (user) { return res.status(400).json({ message: 'User with that ID, username or email already exists' }); }
        user = new User({ userId, username, email, password, fullName, phone, role });
        const savedUser = await user.save();
        const userResponse = savedUser.toObject();
        delete userResponse.password;
        res.status(201).json({ ...userResponse, token: generateToken(savedUser._id) });
    } catch (err) { /* Xử lý lỗi đầy đủ */ }
};

// Đăng nhập
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) { return res.status(400).json({ message: 'Please provide email and password' }); }
        const user = await User.findOne({ email }).select('+password');
        if (!user) { return res.status(400).json({ message: 'Invalid Credentials (User not found)' }); }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) { return res.status(400).json({ message: 'Invalid Credentials (Password incorrect)' }); }
        const userResponse = user.toObject();
        delete userResponse.password;
        res.status(200).json({ ...userResponse, token: generateToken(user._id) });
    } catch (err) { /* Xử lý lỗi */ }
};

// Lấy thông tin user hiện tại
exports.getMe = async (req, res) => { res.status(200).json(req.user); };

// Lấy tất cả users (RECEPTIONIST có quyền)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) { /* Xử lý lỗi */ }
};

// Lấy một user
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) { return res.status(404).json({ message: 'User not found' }); }
        // Thêm logic phân quyền xem nếu cần
        res.status(200).json(user);
    } catch (err) { /* Xử lý lỗi */ }
};

exports.getUserByCustomId = async (req, res) => {
    console.log('--- getUserByCustomId controller function called with userId:', req.params.userId);
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (!user) {
            return res.status(404).json({ message: 'User with that custom ID not found' });
        }
        // Logic phân quyền tương tự như getUserById nếu cần
        if (req.user.role === 'PATIENT' && req.user._id.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this user profile' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error('Error in getUserByCustomId:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
// Cập nhật user (RECEPTIONIST có quyền)
exports.updateUser = async (req, res) => { /* ... code đầy đủ ... */ };

// Xóa user (RECEPTIONIST có quyền)
exports.deleteUser = async (req, res) => { /* ... code đầy đủ ... */ };