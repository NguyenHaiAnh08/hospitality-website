// BE/src/controllers/medicinesController.js

const Prescription = require('../models/Prescription');
const PrescriptionDetail = require('../models/PrescriptionDetail');
const Medicine = require('../models/Medicine');
// const User = require('../models/User'); // Không cần import trực tiếp User ở đây nếu không kiểm tra role trong controller

// === CÁC HÀM CRUD CỦA MEDICINE (LOGIC GỐC CỦA FILE) ===

// @desc    Tạo một Medicine mới
// @route   POST /api/medicines
// @access  Protected (RECEPTIONIST, PHARMACIST)
exports.createMedicine = async (req, res) => {
    const { customMedicineId, name, totalPills, price } = req.body;
    try {
        let medicine = await Medicine.findOne({ customMedicineId });
        if (medicine) {
            return res.status(400).json({ message: `Medicine with custom ID '${customMedicineId}' already exists.` });
        }
        medicine = new Medicine({ customMedicineId, name, totalPills, price });
        const savedMedicine = await medicine.save();
        res.status(201).json(savedMedicine);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: `Custom Medicine ID '${customMedicineId}' already exists.` });
        }
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        console.error('Error in createMedicine:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// @desc    Lấy tất cả Medicines
// @route   GET /api/medicines
// @access  Protected (Mọi vai trò)
exports.getAllMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find();
        res.status(200).json(medicines);
    } catch (err) {
        console.error('Error in getAllMedicines:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// @desc    Lấy một Medicine theo _id
// @route   GET /api/medicines/:id
// @access  Protected (Mọi vai trò)
exports.getMedicineById = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
        res.status(200).json(medicine);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Medicine ID format' });
        }
        console.error('Error in getMedicineById:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// @desc    Cập nhật một Medicine theo _id
// @route   PUT /api/medicines/:id
// @access  Protected (RECEPTIONIST, PHARMACIST)
exports.updateMedicine = async (req, res) => {
    try {
        const updatedMedicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedMedicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        res.status(200).json(updatedMedicine);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Medicine ID format' });
        }
        if (err.code === 11000) {
            return res.status(400).json({ message: `Custom Medicine ID '${req.body.customMedicineId}' already exists.` });
        }
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        console.error('Error in updateMedicine:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// @desc    Xóa một Medicine theo _id
// @route   DELETE /api/medicines/:id
// @access  Protected (RECEPTIONIST, PHARMACIST)
exports.deleteMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndDelete(req.params.id);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        res.status(200).json({ message: 'Medicine deleted successfully' });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Medicine ID format' });
        }
        console.error('Error in deleteMedicine:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// === LOGIC TỪ CÁC CONTROLLER KHÁC ĐƯỢC CHUYỂN VÀO ĐÂY ===

// @desc    (PHARMACIST) Lấy các đơn thuốc đang chờ phát
// @route   GET /api/medicines/prescriptions/pending
// @access  Protected (PHARMACIST)
exports.getPendingPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ status: 'PENDING_DISPENSE' })
            .populate('patientId', 'fullName email phone')
            .populate('doctorId', 'fullName');
        res.status(200).json(prescriptions);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// @desc    (PHARMACIST) Phát thuốc, cập nhật trạng thái và tính tiền cho đơn thuốc
// @route   POST /api/medicines/prescriptions/:id/dispense
// @access  Protected (PHARMACIST)
exports.dispenseMedicine = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id);

        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }
        if (prescription.status !== 'PENDING_DISPENSE') {
            return res.status(400).json({ message: `Cannot dispense. Prescription status is '${prescription.status}', not 'PENDING_DISPENSE'.` });
        }

        // Đánh dấu đã phát thuốc và tính tổng tiền
        prescription.status = 'COMPLETED';
        prescription.pharmacistId = req.user._id;

        const details = await PrescriptionDetail.find({ prescriptionId: prescription._id });
        let totalPrice = 0;
        for (const item of details) {
            if (item.priceAtTimeOfSale) {
                totalPrice += item.quantity * item.priceAtTimeOfSale;
            }
        }
        prescription.totalPrice = totalPrice;

        await prescription.save();

        res.status(200).json({
            message: 'Medicine dispensed and invoice details calculated.',
            updatedPrescription: prescription
        });

    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// @desc    (PHARMACIST/RECEPTIONIST) Xem hóa đơn/chi tiết đơn thuốc đã hoàn thành
// @route   GET /api/medicines/invoices/:prescriptionId
// @access  Protected (PHARMACIST, RECEPTIONIST)
exports.getInvoiceDetails = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.prescriptionId)
            .populate('patientId', 'fullName email phone')
            .populate('doctorId', 'fullName')
            .populate('receptionistId', 'fullName')
            .populate('pharmacistId', 'fullName');

        if (!prescription) {
            return res.status(404).json({ message: 'Prescription for invoice not found' });
        }

        const details = await PrescriptionDetail.find({ prescriptionId: prescription._id })
            .populate('medicineId', 'name price');

        const invoice = {
            prescriptionInfo: prescription,
            medicineDetails: details.map(d => ({
                medicineName: d.medicineId.name,
                quantity: d.quantity,
                pricePerUnit: d.priceAtTimeOfSale,
                lineTotal: d.quantity * d.priceAtTimeOfSale,
                dosage: d.dosage
            })),
            grandTotal: prescription.totalPrice
        };

        res.status(200).json(invoice);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// @desc    (RECEPTIONIST) Xem thống kê doanh thu theo ngày
// @route   GET /api/medicines/reports/revenue
// @access  Protected (RECEPTIONIST)
exports.getRevenueStats = async (req, res) => {
    try {
        const revenue = await Prescription.aggregate([
            {
                $match: {
                    status: 'COMPLETED',
                    totalPrice: { $gt: 0 }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
                    totalRevenue: { $sum: '$totalPrice' },
                    numberOfPrescriptions: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.status(200).json(revenue);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};