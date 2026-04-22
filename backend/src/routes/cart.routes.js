const express = require('express');
const Cart = require('../Models/cart.model');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

// get current user's cart
router.get('/', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.userId }).populate('items.food');
        if (!cart) cart = { items: [] };
        res.json(cart);
    } catch (err) {
        console.error('Error fetching cart:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// replace entire cart
router.post('/', auth, async (req, res) => {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
        return res.status(400).json({ message: 'Items array required' });
    }
    try {
        let cart = await Cart.findOne({ user: req.userId });
        if (!cart) {
            cart = new Cart({ user: req.userId, items });
        } else {
            cart.items = items;
        }
        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error('Error saving cart:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
