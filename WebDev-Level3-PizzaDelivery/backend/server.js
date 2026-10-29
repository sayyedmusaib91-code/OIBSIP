const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cron = require('node-cron');
const nodemailer = require('nodemailer');

const pizzaRoutes = require('./routes/pizzaRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const path = require('path');

// Models import
const User = require('./models/User');
const Inventory = require('./models/Inventory');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// --- FRONTEND MULTI-PAGE EXPLICIT ROUTING (Static middleware se pehle honi chahiye) ---

// 1. Root Route: Link khulte hi sabse pehle login.html khulna chahiye
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'login.html'));
});

// 2. User Dashboard (index.html)
app.get('/dashboard', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'index.html'));
});

// 3. Admin Dashboard
app.get('/admin', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'admin.html'));
});

// 4. Admin Login Page
app.get('/admin-login', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'admin-login.html'));
});

// Serve Frontend Static Files (CSS, JS, Images, etc.)
app.use(express.static(path.join(__dirname, '../frontend')));

// Use API Routes
app.use('/api', pizzaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', paymentRoutes);

// Test Route / API Health Check
app.get('/api/health', (req, res) => {
    res.send('Oasis Infobyte Level 3 Pizza Delivery API is running...');
});

// Nodemailer Transporter Setup for Low Stock Email Alerts
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_EMAIL || 'slicecraft.official@gmail.com',
        pass: process.env.EMAIL_APP_PASSWORD || 'your_email_app_password'
    }
});

// Automated Cron Job: Runs every hour to check inventory stock (< 20 units)
cron.schedule('0 * * * *', async () => {
    try {
        const lowStockItems = await Inventory.find({ stock: { $lt: 20 } });
        if (lowStockItems.length > 0) {
            const itemList = lowStockItems.map(i => `• ${i.itemName}: ${i.stock} units left`).join('\n');
            
            const mailOptions = {
                from: 'slicecraft.official@gmail.com',
                to: process.env.ADMIN_EMAIL || 'musaib@example.com',
                subject: '⚠️ Urgent: SliceCraft Low Inventory Stock Alert!',
                text: `Hello Admin,\n\nThe following inventory ingredients have fallen below 20 units:\n\n${itemList}\n\nPlease restock them immediately to prevent order disruptions.\n\nRegards,\nSliceCraft System`
            };

            await transporter.sendMail(mailOptions);
            console.log('📧 Automated low stock alert email sent to admin successfully.');
        }
    } catch (err) {
        console.error('Cron job error during low stock check:', err);
    }
});

// Database Connection & Server Start
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log('MongoDB Atlas Connected Successfully!');
    
    // Automatically fix/sync collection indexes to prevent duplicate errors
    try {
        await User.syncIndexes();
        console.log('User indexes synced successfully!');
    } catch (indexErr) {
        console.error('Error syncing indexes:', indexErr);
    }

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((err) => {
    console.error('Database connection error:', err);
});