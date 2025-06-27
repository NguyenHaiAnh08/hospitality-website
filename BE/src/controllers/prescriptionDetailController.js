// BE/src/controllers/prescriptionDetailController.js
const PrescriptionDetail = require('../models/PrescriptionDetail');
const Prescription = require('../models/Prescription');
const Medicine = require('../models/Medicine');

exports.createPrescriptionDetail = async (req, res) => {
    const { customPrescriptionDetailId, prescriptionId, medicineId, quantity, dosage } = req.body;
    try {
        const prescription = await Prescription.findById(prescriptionId);
        if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
        if (req.user.role === 'DOCTOR' && prescription.doctorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to add medicine to this prescription' });
        }
        const medicine = await Medicine.findById(medicineId);
        if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
        if (medicine.totalPills < quantity) {
            return res.status(400).json({ message: `Not enough stock for ${medicine.name}. Available: ${medicine.totalPills}`});
        }
        medicine.totalPills -= quantity;
        await medicine.save();
        const newDetail = new PrescriptionDetail({
            customPrescriptionDetailId, prescriptionId, medicineId, quantity, dosage,
            priceAtTimeOfSale: medicine.price
        });
        const savedDetail = await newDetail.save();
        res.status(201).json(savedDetail);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

// ... (thêm các hàm get, update, delete cho chi tiết đơn thuốc nếu cần)