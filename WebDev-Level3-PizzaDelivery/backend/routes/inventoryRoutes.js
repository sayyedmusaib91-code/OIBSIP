const express = require('express');
const router = express.Router();
const { getInventory, addInventoryItem, updateStock } = require('../controllers/inventoryController');

router.get('/inventory', getInventory);
router.post('/inventory', addInventoryItem);
router.put('/inventory/:id', updateStock);

module.exports = router;