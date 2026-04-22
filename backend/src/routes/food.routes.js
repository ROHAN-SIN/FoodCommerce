const express = require('express');
const Food = require('../Models/food.model');
const auth = require('../middleware/auth.middleware');
const User = require('../Models/user.model');

const router = express.Router();

// GET /api/foods - get all foods (public, no login needed)
// Optional query: ?category=burger
router.get('/', async (req, res) => {
    try {
        const query = {};
        if (req.query.category) {
            query.category = req.query.category;
        }
        const foods = await Food.find(query).sort({ createdAt: -1 });
        res.json(foods);
    } catch (err) {
        console.error('Error fetching foods:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/foods/:id - get single food item
router.get('/:id', async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        if (!food) return res.status(404).json({ message: 'Food not found' });
        res.json(food);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/foods - add a new food item (admin only)
router.post('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const { name, price, description, category, image, inStock } = req.body;
        if (!name || price == null) {
            return res.status(400).json({ message: 'Name and price are required' });
        }

        const food = new Food({ name, price, description, category, image, inStock });
        await food.save();
        res.status(201).json(food);
    } catch (err) {
        console.error('Error creating food:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/foods/:id - update a food item (admin only)
router.put('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const updated = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Food not found' });
        res.json(updated);
    } catch (err) {
        console.error('Error updating food:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/foods/:id - delete a food item (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const deleted = await Food.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Food not found' });
        res.json({ message: 'Food deleted successfully' });
    } catch (err) {
        console.error('Error deleting food:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
