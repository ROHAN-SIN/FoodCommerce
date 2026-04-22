import React from 'react';
import { Link } from 'react-router-dom';

// Home / Landing page - shows hero section with CTA buttons
const Home = () => {
  return (
    <>
      {/* Hero section */}
      <div className="hero">
        <h1>Delicious Food, <span>Delivered Fast</span> 🚀</h1>
        <p>Browse our menu, add to cart, and order in minutes.</p>
        <div className="hero-actions">
          <Link to="/foods" className="btn btn-primary">Browse Menu</Link>
          <Link to="/register" className="btn btn-outline">Sign Up Free</Link>
        </div>
      </div>

      {/* How it works */}
      <div className="page">
        <div className="container">
          <div className="page-header" style={{ textAlign: 'center' }}>
            <h1>How It Works</h1>
            <p>Three simple steps to get food delivered</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🍕</div>
              <h3>1. Browse Menu</h3>
              <p style={{ color: '#666', marginTop: '8px', fontSize: '0.9rem' }}>
                Explore burgers, pizza, sushi, desserts and more.
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🛒</div>
              <h3>2. Add to Cart</h3>
              <p style={{ color: '#666', marginTop: '8px', fontSize: '0.9rem' }}>
                Pick your favorites and review your cart.
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📦</div>
              <h3>3. Place Order</h3>
              <p style={{ color: '#666', marginTop: '8px', fontSize: '0.9rem' }}>
                Confirm and track your order status.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
