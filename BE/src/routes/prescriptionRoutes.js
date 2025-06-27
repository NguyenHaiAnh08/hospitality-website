// BE/src/routes/prescriptionRoutes.js
const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, authorizeRoles('RECEPTIONIST'), prescriptionController.createPrescription);
router.get('/', protect, authorizeRoles('RECEPTIONIST', 'DOCTOR', 'PHARMACIST', 'PATIENT'), prescriptionController.getAllPrescriptions);
router.get('/:id', protect, authorizeRoles('RECEPTIONIST', 'DOCTOR', 'PHARMACIST', 'PATIENT'), prescriptionController.getPrescriptionById);
router.put('/:id', protect, authorizeRoles('DOCTOR', 'PHARMACIST', 'RECEPTIONIST'), prescriptionController.updatePrescription);

module.exports = router;