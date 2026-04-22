import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      await login(email, password);
      navigate('/foods'); // redirect to menu after login
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back 👋</h2>
        <p>Login to your FoodHub account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Login
          </button>
        </form>

        {message && (
          <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
