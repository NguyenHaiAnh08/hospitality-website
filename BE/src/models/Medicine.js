// BE/src/models/Medicine.js
const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
    customMedicineId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    totalPills: { type: Number, required: true, default: 0, min: 0 },
    price: { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', MedicineSchema);