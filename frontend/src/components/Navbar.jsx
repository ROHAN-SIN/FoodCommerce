import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Helper: add "active-link" class if current path matches
  const activeClass = (path) =>
    location.pathname === path ? 'active-link' : '';

  return (
    <nav className="navbar">
      <div className="container">
        {/* Brand Logo */}
        <Link to="/" className="brand">
          🍔 Food<span>Hub</span>
        </Link>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li><Link to="/foods" className={activeClass('/foods')}>Menu</Link></li>

          {user ? (
            <>
              <li><Link to="/cart" className={activeClass('/cart')}>🛒 Cart</Link></li>
              <li><Link to="/orders" className={activeClass('/orders')}>My Orders</Link></li>

              {/* Admin link - only shown to admin users */}
              {user.isAdmin && (
                <li>
                  <Link to="/admin" className={activeClass('/admin')}>
                    ⚙️ Admin
                  </Link>
                </li>
              )}

              <li>
                <span className="user-badge">
                  👤 {user.fullname}
                  {user.isAdmin && <span className="admin-badge" style={{marginLeft:'6px'}}>Admin</span>}
                </span>
              </li>
              <li>
                <button className="btn-outline btn-sm btn" onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="btn-outline btn-sm btn">Login</Link></li>
              <li><Link to="/register" className="btn-primary-nav btn-sm btn">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
