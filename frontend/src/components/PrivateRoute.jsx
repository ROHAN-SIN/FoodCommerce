import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

// PrivateRoute protects pages that need login
// If adminOnly=true, also checks if user is admin
const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  // Still loading user info from server
  if (loading) return <div className="loading">Loading...</div>;

  // Not logged in → redirect to login page
  if (!user) return <Navigate to="/login" />;

  // Admin page but user is not admin → redirect to home
  if (adminOnly && !user.isAdmin) return <Navigate to="/" />;

  return children;
};

export default PrivateRoute;
