const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    itemName: { type: String, required: true, unique: true },
    category: { 
        type: String, 
        required: true, 
        enum: ['base', 'sauce', 'cheese', 'vegetables', 'vegetable', 'veggie'] 
    },
    stock: { type: Number, required: true, default: 50 }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);