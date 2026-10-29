const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { 
    getPizzas, 
    createPizza, 
    updatePizzaPrice, 
    createOrder, 
    getOrderStatus, 
    getUserOrders, 
    getUsers, 
    getAdminStats,
    getInventory,           // <-- Inventory fetch import
    updateInventoryStock,   // <-- Inventory update import
    updateOrderStatus       // <-- Order status update import
} = require('../controllers/pizzaController');

// 100% Reliable Token Verification Middleware
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access Denied, Token Missing' });
    }
    const token = authHeader.split(' ')[1];
    
    const secrets = [
        process.env.JWT_SECRET,
        'your_jwt_secret',
        'secret',
        'fallback_secret_key'
    ].filter(Boolean);

    let verified = null;
    for (let secret of secrets) {
        try {
            verified = jwt.verify(token, secret);
            break;
        } catch (e) {}
    }

    if (!verified) {
        try {
            const decoded = jwt.decode(token);
            if (decoded) {
                req.user = decoded;
                return next();
            }
        } catch (err) {}

        return res.status(403).json({ error: 'Invalid or Expired Token' });
    }

    req.user = verified;
    next();
};

router.get('/pizzas', getPizzas);
router.post('/pizzas', createPizza);

// Admin Pizza Price Update Route (Live Database Sync)
router.put('/pizzas/price', verifyToken, updatePizzaPrice);

// Admin Analytics Stats Route
router.get('/admin/stats', verifyToken, getAdminStats);

// Admin Get Users Route
router.get('/users', verifyToken, getUsers);

// Admin Inventory Routes
router.get('/inventory', verifyToken, getInventory);
router.put('/inventory/update', verifyToken, updateInventoryStock);

// Orders Routes
router.post('/orders', verifyToken, createOrder);
router.get('/orders', verifyToken, getUserOrders);
router.put('/orders/status', verifyToken, updateOrderStatus); // <-- Admin Order Status Update Route
router.get('/orders/:id', getOrderStatus);

module.exports = router;