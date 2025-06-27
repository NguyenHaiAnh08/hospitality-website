// BE/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// --- PUBLIC ---
router.post('/login', userController.loginUser);

// --- PROTECTED ---
router.get('/me', protect, userController.getMe);

// --- RECEPTIONIST MANAGEMENT ---
router.post('/register', protect, authorizeRoles('RECEPTIONIST'), userController.registerUser);
router.get('/', protect, authorizeRoles('RECEPTIONIST'), userController.getAllUsers);

// --- GENERAL INFO & MANAGEMENT (Hợp nhất các quyền) ---
// Lễ tân có thể cập nhật, các vai trò khác có thể xem chi tiết
router.put('/:id', protect, authorizeRoles('RECEPTIONIST'), userController.updateUser);
router.delete('/:id', protect, authorizeRoles('RECEPTIONIST'), userController.deleteUser);
router.get('/:id', protect, authorizeRoles('RECEPTIONIST', 'DOCTOR', 'PHARMACIST'), userController.getUserById);
router.get('/custom/:userId', protect, authorizeRoles('RECEPTIONIST', 'DOCTOR', 'PHARMACIST'), userController.getUserByCustomId);

module.exports = router;