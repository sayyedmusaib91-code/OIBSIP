const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    type: { type: String, enum: ['veg', 'non-veg'], required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String },
    stock: { type: Number, required: true, default: 50 }, // <-- Yeh stock field add kar di gayi hai
    ingredients: {
        base: { type: String, required: true },
        sauce: { type: String, required: true },
        cheese: { type: String, required: true },
        veggies: [String]
    }
}, { timestamps: true });

module.exports = mongoose.model('Pizza', pizzaSchema);