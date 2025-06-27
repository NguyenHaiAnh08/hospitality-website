// BE/src/routes/medicineRoutes.js
const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController'); // Tên biến là 'medicineController'
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// === CÁC API CRUD CHO MEDICINE ===
router.post('/', protect, authorizeRoles('RECEPTIONIST', 'PHARMACIST'), medicineController.createMedicine); // <-- Sửa ở đây
router.get('/', protect, authorizeRoles('RECEPTIONIST', 'PHARMACIST', 'DOCTOR'), medicineController.getAllMedicines); // <-- Sửa ở đây
router.get('/:id', protect, authorizeRoles('RECEPTIONIST', 'PHARMACIST', 'DOCTOR'), medicineController.getMedicineById); // <-- Sửa ở đây
router.put('/:id', protect, authorizeRoles('RECEPTIONIST', 'PHARMACIST'), medicineController.updateMedicine); // <-- Sửa ở đây
router.delete('/:id', protect, authorizeRoles('RECEPTIONIST', 'PHARMACIST'), medicineController.deleteMedicine); // <-- Sửa ở đây

// === CÁC API THEO LUỒNG NGHIỆP VỤ ===
router.get('/prescriptions/pending', protect, authorizeRoles('PHARMACIST'), medicineController.getPendingPrescriptions); // <-- Sửa ở đây
router.post('/prescriptions/:id/dispense', protect, authorizeRoles('PHARMACIST'), medicineController.dispenseMedicine); // <-- Sửa ở đây
router.get('/invoices/:prescriptionId', protect, authorizeRoles('RECEPTIONIST', 'PHARMACIST'), medicineController.getInvoiceDetails); // <-- Sửa ở đây
router.get('/reports/revenue', protect, authorizeRoles('RECEPTIONIST'), medicineController.getRevenueStats); // <-- Sửa ở đây

module.exports = router;