// BE/src/app.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors'); // Import cors

// Import routes
const userRoutes = require('./routes/userRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const prescriptionDetailRoutes = require('./routes/prescriptionDetailRoutes');

require('dotenv').config();

const app = express();

// --- CẤU HÌNH CORS ---
const allowedOrigins = [
    'http://localhost:3000',      // Frontend dev server (port mặc định)
    'http://localhost:3001',      // Frontend dev server (nếu port 3000 bận)
    'http://192.168.1.183:3000',  // IP mạng và port FE bạn đã dùng
    'http://192.168.1.183:3001'   // IP mạng và port FE khác có thể dùng
    // Thêm các origin của frontend đã triển khai (production) ở đây nếu có
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
// -------------------------

connectDB();
app.use(express.json()); // Để parse JSON body

// Định nghĩa Routes
app.use('/api/users', userRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/prescriptiondetails', prescriptionDetailRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    if (err.message && err.message.includes('Not allowed by CORS')) {
        return res.status(403).json({ message: 'CORS policy does not allow access from this origin.' });
    }
    res.status(500).json({ message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend API Server running on port ${PORT}`);
    console.log(`MongoDB Connected. Ready to handle API requests.`);
});