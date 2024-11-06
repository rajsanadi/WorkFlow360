

import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { logout } from '../features/auth/authSlice';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import './Navbar.css'; 

function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
          Employee Management
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {token && (
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/employees" className="nav-link-custom">
                Employees
              </Nav.Link>
              <Nav.Link as={NavLink} to="/departments" className="nav-link-custom">
                Departments
              </Nav.Link>
              <Nav.Link as={NavLink} to="/salaries" className="nav-link-custom">
                Salaries
              </Nav.Link>
            </Nav>
          )}
          <Nav>
            {!token ? (
              <>
                <Nav.Link as={NavLink} to="/login" className="nav-link-custom">
                  Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/register" className="nav-link-custom">
                  Register
                </Nav.Link>
              </>
            ) : (
              <Button variant="outline-danger" onClick={handleLogout} className="logout-button">
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
