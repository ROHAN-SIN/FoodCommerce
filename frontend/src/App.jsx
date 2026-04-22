import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layout
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import FoodsPage from './pages/FoodsPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/foods" element={<FoodsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes (must be logged in) */}
            <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />

            {/* Admin only */}
            <Route path="/admin" element={<PrivateRoute adminOnly><AdminPage /></PrivateRoute>} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
