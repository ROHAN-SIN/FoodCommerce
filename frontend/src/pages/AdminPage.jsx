import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

const CATEGORIES = ['burger', 'pizza', 'sushi', 'dessert', 'drinks', 'other'];

const CATEGORY_EMOJI = {
  burger: '🍔', pizza: '🍕', sushi: '🍣',
  dessert: '🍰', drinks: '🥤', other: '🍽️',
};

const AdminPage = () => {
  const { api } = useContext(AuthContext);

  // --- Foods State ---
  const [foods, setFoods] = useState([]);
  const [foodsLoading, setFoodsLoading] = useState(true);

  // --- Add Food Form State ---
  const [form, setForm] = useState({
    name: '', price: '', description: '',
    category: 'other', inStock: true,
  });
  const [formMessage, setFormMessage] = useState('');
  const [isFormError, setIsFormError] = useState(false);

  // --- Edit Mode ---
  const [editId, setEditId] = useState(null); // food being edited

  // --- Orders State (admin sees all orders) ---
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // --- Active Tab ---
  const [tab, setTab] = useState('foods'); // 'foods' or 'orders'

  // Fetch all foods
  const fetchFoods = async () => {
    setFoodsLoading(true);
    try {
      const res = await api.get('/api/foods');
      setFoods(res.data);
    } catch (err) {
      console.error('Failed to load foods:', err);
    } finally {
      setFoodsLoading(false);
    }
  };

  // Fetch all orders (admin sees everyone's)
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await api.get('/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
    fetchOrders();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Submit: either create or update food
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage('');
    setIsFormError(false);

    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
      };

      if (editId) {
        // Update existing food
        await api.put(`/api/foods/${editId}`, payload);
        setFormMessage('✅ Food updated successfully!');
        setEditId(null);
      } else {
        // Create new food
        await api.post('/api/foods', payload);
        setFormMessage('✅ Food added successfully!');
      }

      // Reset form
      setForm({ name: '', price: '', description: '', category: 'other', inStock: true });
      fetchFoods();
    } catch (err) {
      setIsFormError(true);
      setFormMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  // Load food data into form for editing
  const startEdit = (food) => {
    setEditId(food._id);
    setForm({
      name: food.name,
      price: food.price.toString(),
      description: food.description || '',
      category: food.category,
      inStock: food.inStock,
    });
    setFormMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete a food item
  const deleteFood = async (id) => {
    if (!window.confirm('Delete this food item?')) return;
    try {
      await api.delete(`/api/foods/${id}`);
      fetchFoods();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.patch(`/api/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>⚙️ Admin Dashboard</h1>
          <p>Manage your menu and track all orders</p>
        </div>

        {/* Tab switcher */}
        <div className="filter-bar" style={{ marginBottom: '24px' }}>
          <button
            className={`filter-btn ${tab === 'foods' ? 'active' : ''}`}
            onClick={() => setTab('foods')}
          >🍕 Manage Foods</button>
          <button
            className={`filter-btn ${tab === 'orders' ? 'active' : ''}`}
            onClick={() => setTab('orders')}
          >📦 All Orders ({orders.length})</button>
        </div>

        {/* ========== FOODS TAB ========== */}
        {tab === 'foods' && (
          <div className="two-col">
            {/* Left: Add / Edit Food Form */}
            <div>
              <div className="admin-form-card">
                <h3>{editId ? '✏️ Edit Food' : '➕ Add New Food'}</h3>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Food Name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g., Cheese Burger"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Price ($) *</label>
                    <input
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="e.g., 9.99"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Short description of the food..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={form.category} onChange={handleChange}>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="inStock"
                        name="inStock"
                        checked={form.inStock}
                        onChange={handleChange}
                      />
                      <label htmlFor="inStock">In Stock</label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary">
                      {editId ? 'Update Food' : 'Add Food'}
                    </button>
                    {editId && (
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => {
                          setEditId(null);
                          setForm({ name: '', price: '', description: '', category: 'other', inStock: true });
                          setFormMessage('');
                        }}
                      >Cancel</button>
                    )}
                  </div>
                </form>

                {formMessage && (
                  <div className={`alert ${isFormError ? 'alert-error' : 'alert-success'}`}>
                    {formMessage}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Foods List */}
            <div>
              <h3 style={{ marginBottom: '16px' }}>All Foods ({foods.length})</h3>
              {foodsLoading ? (
                <div className="loading">Loading...</div>
              ) : foods.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🍽️</div>
                  <p>No foods added yet. Add one using the form!</p>
                </div>
              ) : (
                foods.map((food) => (
                  <div key={food._id} className="card" style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.8rem' }}>{CATEGORY_EMOJI[food.category] || '🍽️'}</span>
                      <div>
                        <strong>{food.name}</strong>
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>
                          ${food.price.toFixed(2)} · {food.category}
                          {!food.inStock && <span style={{ color: 'var(--danger)', marginLeft: '8px' }}>Out of Stock</span>}
                        </div>
                      </div>
                    </div>

                    <div className="admin-actions">
                      <button className="btn btn-sm btn-outline" onClick={() => startEdit(food)}>
                        ✏️ Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteFood(food._id)}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========== ORDERS TAB ========== */}
        {tab === 'orders' && (
          <div>
            <h3 style={{ marginBottom: '16px' }}>All Customer Orders</h3>
            {ordersLoading ? (
              <div className="loading">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <p>No orders have been placed yet.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="order-card">
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
                    <span className={`status-badge status-${order.status}`}>{order.status}</span>
                  </div>

                  {/* Order items */}
                  <div style={{ marginBottom: '12px' }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ fontSize: '0.9rem', color: '#444', marginBottom: '4px' }}>
                        {CATEGORY_EMOJI[item.food?.category] || '🍽️'} {item.food?.name || 'Unknown'} × {item.quantity}
                      </div>
                    ))}
                  </div>

                  {/* Total and status controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                    <strong style={{ color: 'var(--primary)' }}>Total: ${order.total.toFixed(2)}</strong>

                    {/* Admin can update order status */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['pending', 'preparing', 'delivered'].map((status) => (
                        <button
                          key={status}
                          className={`btn btn-sm ${order.status === status ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => updateOrderStatus(order._id, status)}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
