import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

const CATEGORY_EMOJI = {
  burger: '🍔', pizza: '🍕', sushi: '🍣',
  dessert: '🍰', drinks: '🥤', other: '🍽️',
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { api } = useContext(AuthContext);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="loading">Loading your orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Place an order from the menu to see it here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>📦 My Orders</h1>
          <p>Track all your orders here</p>
        </div>

        {orders.map((order) => (
          <div key={order._id} className="order-card">
            {/* Order header with ID and status badge */}
            <div className="order-card-header">
              <div>
                <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '2px' }}>
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </div>
              </div>
              <span className={`status-badge status-${order.status}`}>
                {order.status}
              </span>
            </div>

            {/* Order items */}
            <div style={{ marginBottom: '12px' }}>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '0.92rem' }}>
                  <span>{CATEGORY_EMOJI[item.food?.category] || '🍽️'}</span>
                  <span>{item.food?.name || 'Unknown item'}</span>
                  <span style={{ color: '#666' }}>× {item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666', fontSize: '0.9rem' }}>Total</span>
              <strong style={{ color: 'var(--primary)' }}>${order.total.toFixed(2)}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
