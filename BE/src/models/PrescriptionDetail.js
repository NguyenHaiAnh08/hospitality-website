// BE/src/models/PrescriptionDetail.js
const mongoose = require('mongoose');

const PrescriptionDetailSchema = new mongoose.Schema({
    customPrescriptionDetailId: { type: String, required: true, unique: true, trim: true },
    prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription', required: true },
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    quantity: { type: Number, required: true, min: 1 },
    dosage: { type: String, required: true, trim: true },
    priceAtTimeOfSale: { type: Number, required: true } // Lưu giá thuốc tại thời điểm bán
}, { timestamps: true });

module.exports = mongoose.model('PrescriptionDetail', PrescriptionDetailSchema);