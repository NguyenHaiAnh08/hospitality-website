// BE/src/routes/prescriptionDetailRoutes.js
const express = require('express');
const router = express.Router();
const prescriptionDetailController = require('../controllers/prescriptionDetailController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, authorizeRoles('DOCTOR'), prescriptionDetailController.createPrescriptionDetail);
// ... các route get, update, delete khác
module.exports = router;