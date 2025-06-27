// BE/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model
require('dotenv').config();

// Middleware để bảo vệ các tuyến đường (route protection)
exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            next();
        } catch (error) {
            console.error('Token verification error:', error.message);
            if (error.name === 'TokenExpiredError') { return res.status(401).json({ message: 'Not authorized, token expired' }); }
            if (error.name === 'JsonWebTokenError') { return res.status(401).json({ message: 'Not authorized, token failed' }); }
            res.status(500).json({ message: 'Server error during token verification' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware để phân quyền (authorization) dựa trên vai trò
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user ? req.user.role : 'unauthenticated'} is not authorized to access this resource`
            });
        }
        next();
    };
};