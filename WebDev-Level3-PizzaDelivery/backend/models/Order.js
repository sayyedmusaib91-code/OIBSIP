const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    pizzaDetails: {
        name: { type: String, required: true },
        base: { type: String, required: true },
        sauce: { type: String, required: true },
        cheese: { type: String, required: true },
        veggies: [String],
        price: { type: Number, required: true }
    },
    paymentId: { type: String, default: 'COD' },
    status: { 
        type: String, 
        enum: ['Order Received', 'In Kitchen', 'Sent to Delivery', 'Delivered'], 
        default: 'Order Received' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);