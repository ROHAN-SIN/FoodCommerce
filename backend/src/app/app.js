require('dotenv').config();
const express = require("express")
const cors = require("cors");
const connectDB = require("../db/db");
const authRoutes = require("../routes/auth.routes");
const foodRoutes = require("../routes/food.routes");
const orderRoutes = require("../routes/order.routes");
const cartRoutes = require("../routes/cart.routes");




connectDB();
const app = express();
app.use(cors());
app.use(express.json());





// basic health check (useful for verifying proxy and deployment)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// mount auth routes under /api/auth
app.use('/api/auth', authRoutes);

// convenience endpoint for current user
const auth = require('../middleware/auth.middleware');
app.get('/api/auth/me', auth, async (req, res) => {
  const User = require('../Models/user.model');
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
});

// simple endpoints for food items
app.use('/api/foods', foodRoutes);

// basic order endpoints
app.use('/api/orders', orderRoutes);

// cart endpoints
app.use('/api/cart', cartRoutes);

module.exports = app