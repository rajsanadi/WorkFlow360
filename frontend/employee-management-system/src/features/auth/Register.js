

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from './authSlice';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa'; 
import './Register.css'; 

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const { token, status, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  
  const [passwordError, setPasswordError] = useState('');

  
  const [showSuccessModal, setShowSuccessModal] = useState(false);

 
  useEffect(() => {
    if (status === 'succeeded') {
      setShowSuccessModal(true);
    }
  }, [status]);

  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match.");
      return;
    } else {
      setPasswordError('');
    }
    dispatch(register({ email, password, confirmPassword }));
  };

  
  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <h2 className="text-center mb-4">Register</h2>
        {status === 'failed' && <p className="error-message">{error}</p>}
        {passwordError && <p className="error-message">{passwordError}</p>}
        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              className={`form-control ${status === 'failed' || passwordError ? 'is-invalid' : ''}`}
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
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password:</label>
            <input
              type="password"
              className={`form-control ${status === 'failed' || passwordError ? 'is-invalid' : ''}`}
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
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
            <input
              type="password"
              className={`form-control ${status === 'failed' || passwordError ? 'is-invalid' : ''}`}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
            />
            <div className="invalid-feedback">
              {passwordError || "Please confirm your password."}
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={handleCloseModal}
        centered
        backdrop="static" 
        keyboard={false}  
        animation
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCheckCircle className="me-2 text-success" /> Registration Successful
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your account has been successfully created!</p>
          <p>You will be redirected to the home page.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleCloseModal}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Register;
