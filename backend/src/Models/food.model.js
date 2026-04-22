const mongoose = require('mongoose');

// Food item sold in the store
const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: '' },
    category: {
        type: String,
        enum: ['burger', 'pizza', 'sushi', 'dessert', 'drinks', 'other'],
        default: 'other',
    },
    image: { type: String, default: '' }, // URL or emoji placeholder
    inStock: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);
