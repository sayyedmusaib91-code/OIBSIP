const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'slicecraft_super_secret_key_2026';

// Register User or Admin
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role === 'admin' ? 'admin' : 'user'
        });

        await newUser.save();
        res.status(201).json({ message: 'Registration successful!', userId: newUser._id });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

// Login User or Admin
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            role: user.role,
            name: user.name
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: 'Server error during login' });
    }
};

// Admin Login Controller
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid admin credentials' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Access Denied! You are not authorized as admin.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid admin credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Admin Login Successful',
            token,
            role: user.role,
            name: user.name
        });
    } catch (err) {
        console.error("Admin Login Error:", err);
        res.status(500).json({ error: 'Server error during admin login' });
    }
};

// Forgot Password Controller
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User with this email does not exist' });
        }

        // Temporary reset token generate karein jo 15 minute mein expire ho jaye
        const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '15m' });

        // Real application mein yahan Nodemailer se email bheji jati hai. 
        // Abhi ke liye hum response mein resetToken bhej rahe hain taaki testing asan ho.
        res.status(200).json({ 
            message: 'Password reset link generated successfully!', 
            resetToken,
            note: 'Use this token in reset password endpoint.' 
        });
    } catch (err) {
        console.error("Forgot Password Error:", err);
        res.status(500).json({ error: 'Server error during forgot password' });
    }
};

// Reset Password Controller
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully! Please login with your new password.' });
    } catch (err) {
        console.error("Reset Password Error:", err);
        res.status(400).json({ error: 'Invalid or expired reset token' });
    }
};