// BE/src/controllers/prescriptionController.js
const Prescription = require('../models/Prescription');
const PrescriptionDetail = require('../models/PrescriptionDetail');
const User = require('../models/User');

exports.createPrescription = async (req, res) => {
    const { customPrescriptionId, patientId, doctorId, date } = req.body;
    try {
        const patient = await User.findById(patientId);
        if (!patient || patient.role !== 'PATIENT') return res.status(404).json({ message: 'Patient user not found.' });
        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== 'DOCTOR') return res.status(404).json({ message: 'Doctor user not found.' });

        const newPrescription = new Prescription({
            customPrescriptionId,
            patientId,
            doctorId,
            receptionistId: req.user._id,
            date: date || new Date(),
            status: 'PENDING_EXAMINATION'
        });
        const savedPrescription = await newPrescription.save();
        res.status(201).json(savedPrescription);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

exports.getAllPrescriptions = async (req, res) => {
    const { status, doctorId, patientId } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (doctorId) filter.doctorId = doctorId;
    if (patientId) filter.patientId = patientId;
    try {
        if (req.user.role === 'PATIENT') filter.patientId = req.user._id;
        else if (req.user.role === 'DOCTOR') filter.doctorId = req.user._id;
        const prescriptions = await Prescription.find(filter)
            .populate('patientId', 'fullName email phone')
            .populate('doctorId', 'fullName')
            .populate('receptionistId', 'fullName')
            .populate('pharmacistId', 'fullName');
        res.status(200).json(prescriptions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

exports.getPrescriptionById = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id).populate('patientId', 'fullName').populate('doctorId', 'fullName');
        if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
        // Phân quyền chi tiết
        if (req.user.role === 'PATIENT' && prescription.patientId._id.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
        if (req.user.role === 'DOCTOR' && prescription.doctorId._id.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
        res.status(200).json(prescription);
    } catch(err) { /* ... xử lý lỗi ... */ }
};

exports.updatePrescription = async (req, res) => {
    const { diagnosis, status } = req.body;
    try {
        const prescription = await Prescription.findById(req.params.id);
        if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
        if (req.user.role === 'DOCTOR') {
            if (prescription.doctorId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
            if (diagnosis) prescription.diagnosis = diagnosis;
            if (status === 'PENDING_DISPENSE' && prescription.status === 'PENDING_EXAMINATION') {
                prescription.status = status;
            } else if (status) return res.status(400).json({ message: `Doctor cannot set status to ${status}` });
        } else if (req.user.role === 'PHARMACIST') {
            if (status === 'COMPLETED' && prescription.status === 'PENDING_DISPENSE') {
                prescription.status = status;
                prescription.pharmacistId = req.user._id;
                const details = await PrescriptionDetail.find({ prescriptionId: prescription._id }).populate('medicineId');
                let totalPrice = 0;
                details.forEach(item => {
                    totalPrice += item.quantity * item.priceAtTimeOfSale;
                });
                prescription.totalPrice = totalPrice;
            } else if (status) return res.status(400).json({ message: `Pharmacist can only set status to COMPLETED` });
        } else if (req.user.role !== 'ADMIN' && req.user.role !== 'RECEPTIONIST') { // Cho phép Receptionist cập nhật nếu cần
            return res.status(403).json({ message: 'Not authorized' });
        }
        const updatedPrescription = await prescription.save();
        res.status(200).json(updatedPrescription);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};
// Thêm deletePrescription nếu cần, phân quyền cho RECEPTIONIST/ADMIN