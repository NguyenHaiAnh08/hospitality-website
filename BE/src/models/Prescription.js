// BE/src/models/Prescription.js
const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
    customPrescriptionId: { type: String, required: true, unique: true, trim: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Bệnh nhân (User PATIENT)
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Bác sĩ (User DOCTOR)
    receptionistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Lễ tân đã tạo (User RECEPTIONIST)
    pharmacistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Nhân viên quầy thuốc đã phát (User PHARMACIST)
    diagnosis: { type: String, default: 'Chờ chuẩn đoán', trim: true }, // Chuẩn đoán của bác sĩ
    date: { type: Date, default: Date.now, required: true }, // Ngày khám/kê đơn
    status: {
        type: String,
        enum: ['PENDING_EXAMINATION', 'PENDING_DISPENSE', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING_EXAMINATION',
        required: true
    },
    totalPrice: { type: Number, default: 0 } // Thêm vào để theo dõi doanh thu
}, { timestamps: true });

module.exports = mongoose.model('Prescription', PrescriptionSchema);