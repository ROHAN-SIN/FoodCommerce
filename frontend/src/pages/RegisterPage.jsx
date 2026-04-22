import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

const RegisterPage = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      await register(fullname, email, password);
      setMessage('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || 'Registration failed. Try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account 🍔</h2>
        <p>Join FoodHub and start ordering</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

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
              placeholder="Minimum 6 characters"
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Create Account
          </button>
        </form>

        {message && (
          <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
