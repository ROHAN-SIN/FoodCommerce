import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import FoodCard from '../components/FoodCard';

// Food categories for the filter buttons
const CATEGORIES = ['all', 'burger', 'pizza', 'sushi', 'dessert', 'drinks', 'other'];

const FoodsPage = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage so it persists on refresh
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  });

  const { api } = useContext(AuthContext);

  // Fetch foods from API, optionally filtered by category
  const fetchFoods = async (category) => {
    setLoading(true);
    try {
      const url = category === 'all' ? '/api/foods' : `/api/foods?category=${category}`;
      const res = await api.get(url);
      setFoods(res.data);
    } catch (err) {
      console.error('Failed to load foods:', err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever the category filter changes
  useEffect(() => {
    fetchFoods(activeCategory);
  }, [activeCategory]);

  // Add food to cart (stored in localStorage)
  const addToCart = (food) => {
    const existing = cart.find((item) => item._id === food._id);
    let updatedCart;

    if (existing) {
      // If already in cart, increase quantity
      updatedCart = cart.map((item) =>
        item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      // Add new item with quantity 1
      updatedCart = [...cart, { ...food, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const isInCart = (foodId) => cart.some((item) => item._id === foodId);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>🍽️ Our Menu</h1>
            <p>Fresh food made to order</p>
          </div>
          {cart.length > 0 && (
            <Link to="/cart" className="btn btn-primary">
              🛒 Cart ({cart.length})
            </Link>
          )}
        </div>

        {/* Category Filter Buttons */}
        <div className="filter-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Food Grid */}
        {loading ? (
          <div className="loading">Loading menu... 🍕</div>
        ) : foods.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <h3>No food in this category yet</h3>
            <p>Check back later or try a different category</p>
          </div>
        ) : (
          <div className="food-grid">
            {foods.map((food) => (
              <FoodCard
                key={food._id}
                food={food}
                onAddToCart={addToCart}
                isInCart={isInCart(food._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodsPage;
