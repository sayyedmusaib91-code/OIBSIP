const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    adminLogin, 
    forgotPassword, 
    resetPassword 
} = require('../controllers/authController');

// Standard User Routes
router.post('/register', register);
router.post('/login', login);

// Dedicated Secure Admin Login Route
router.post('/admin-login', adminLogin);

// Forgot & Reset Password Routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;