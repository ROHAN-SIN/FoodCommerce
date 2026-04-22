const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
            quantity: { type: Number, default: 1 },
        },
    ],
    total: { type: Number, required: true },
    // Order status: pending -> preparing -> delivered
    status: {
        type: String,
        enum: ['pending', 'preparing', 'delivered'],
        default: 'pending',
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
