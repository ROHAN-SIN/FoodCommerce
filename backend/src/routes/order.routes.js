const express = require('express');
const Order = require('../Models/order.model');
const Cart = require('../Models/cart.model');
const auth = require('../middleware/auth.middleware');
const User = require('../Models/user.model');

const router = express.Router();

// GET /api/orders - get orders for current user (admin sees all)
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        // Admin sees every order; normal user only sees their own
        const query = user && user.isAdmin ? {} : { user: req.userId };
        const orders = await Order.find(query)
            .populate('items.food')
            .sort({ createdAt: -1 }); // newest first
        res.json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/orders - place a new order from the cart
router.post('/', auth, async (req, res) => {
    const { items, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Items are required for order' });
    }
    if (total == null) {
        return res.status(400).json({ message: 'Total amount required' });
    }

    try {
        const order = new Order({ user: req.userId, items, total });
        await order.save(); // BUG FIX: was missing await order.save()

        // Clear the user's cart after successful order
        await Cart.findOneAndUpdate(
            { user: req.userId },
            { items: [] }
        );

        res.status(201).json({ message: 'Order placed successfully!', order });
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PATCH /api/orders/:id/status - admin updates order status
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Admin privileges required' });
        }
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('items.food');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        console.error('Error updating order status:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
