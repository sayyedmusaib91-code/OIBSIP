const Inventory = require('../models/Inventory');

// Get all inventory stock
exports.getInventory = async (req, res) => {
    try {
        const items = await Inventory.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add or initialize inventory item (for admin setup)
exports.addInventoryItem = async (req, res) => {
    try {
        const newItem = new Inventory(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update stock manually (Admin Panel)
exports.updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;
        const updatedItem = await Inventory.findByIdAndUpdate(id, { stock }, { new: true });
        res.status(200).json({ message: 'Stock updated successfully', updatedItem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};