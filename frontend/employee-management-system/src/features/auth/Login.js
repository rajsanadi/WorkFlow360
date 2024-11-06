
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './authSlice';
import { Navigate } from 'react-router-dom';
import './Login.css'; 

function Login() {
  const dispatch = useDispatch();
  const { token, status, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  
  const [passwordError, setPasswordError] = useState('');

  if (token) {
    return <Navigate to="/" />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h2 className="text-center mb-4">Login</h2>
        {status === 'failed' && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              className={`form-control ${status === 'failed' ? 'is-invalid' : ''}`}
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
            <div className="invalid-feedback">
              Please enter a valid email address.
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label">Password:</label>
            <input
              type="password"
              className={`form-control ${status === 'failed' ? 'is-invalid' : ''}`}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
            <div className="invalid-feedback">
              Please enter your password.
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
