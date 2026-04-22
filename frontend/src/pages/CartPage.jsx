import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

const CATEGORY_EMOJI = {
  burger: '🍔', pizza: '🍕', sushi: '🍣',
  dessert: '🍰', drinks: '🥤', other: '🍽️',
};

const CartPage = () => {
  // Load cart from localStorage (set by FoodsPage)
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  });

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [ordering, setOrdering] = useState(false);

  const { api } = useContext(AuthContext);
  const navigate = useNavigate();

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Remove an item from cart
  const removeItem = (foodId) => {
    setCart(cart.filter((item) => item._id !== foodId));
  };

  // Change quantity of a cart item
  const updateQuantity = (foodId, newQty) => {
    if (newQty < 1) {
      removeItem(foodId);
      return;
    }
    setCart(cart.map((item) =>
      item._id === foodId ? { ...item, quantity: newQty } : item
    ));
  };

  // Calculate total price
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Place the order
  const placeOrder = async () => {
    if (cart.length === 0) return;
    setOrdering(true);
    setMessage('');

    try {
      // Format items as { food: id, quantity }
      const items = cart.map((item) => ({ food: item._id, quantity: item.quantity }));

      await api.post('/api/orders', { items, total });

      // Clear cart after successful order
      setCart([]);
      localStorage.removeItem('cart');
      setIsError(false);
      setMessage('🎉 Order placed successfully!');

      // Redirect to orders page after 2 seconds
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || 'Failed to place order. Try again.');
    } finally {
      setOrdering(false);
    }
  };

  if (cart.length === 0 && !message) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some food from the menu</p>
            <Link to="/foods" className="btn btn-primary" style={{ marginTop: '16px' }}>
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>🛒 Your Cart</h1>
          <p>{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
          {/* Cart Items List */}
          <div className="card">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-info">
                  <div className="cart-item-emoji">
                    {CATEGORY_EMOJI[item.category] || '🍽️'}
                  </div>
                  <div>
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">${item.price.toFixed(2)} each</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Quantity controls */}
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  >−</button>
                  <span style={{ fontWeight: '700', minWidth: '24px', textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >+</button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeItem(item._id)}
                  >Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Order Summary</h3>
            {cart.map((item) => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                <span>{item.name} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="cart-total">
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
            </div>

            <button
              className="btn btn-success"
              style={{ width: '100%', marginTop: '16px' }}
              onClick={placeOrder}
              disabled={ordering || cart.length === 0}
            >
              {ordering ? 'Placing Order...' : '✅ Place Order'}
            </button>

            {message && (
              <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>
                {message}
              </div>
            )}

            <Link to="/foods" style={{ display: 'block', textAlign: 'center', marginTop: '12px', fontSize: '0.88rem' }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
