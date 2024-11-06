

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createEmployee, updateEmployee, fetchEmployees } from './employeesSlice';
import { fetchDepartments } from '../departments/departmentsSlice';
import { Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';

function EmployeeForm({ employee, onClose }) {
  const dispatch = useDispatch();
  const isEdit = Boolean(employee);
  
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    deptId: '',
  });

  
  const [formErrors, setFormErrors] = useState({});
  
 
  const { departments, status: departmentsStatus, error: departmentsError } = useSelector((state) => state.departments);
  const { status: employeeStatus, error: employeeError } = useSelector((state) => state.employees);
  
  
  useEffect(() => {
    if (isEdit && employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        gender: employee.gender || '',
        dob: employee.dob ? employee.dob.slice(0, 10) : '', 
        deptId: employee.deptId || '',
      });
    }

    
    if (departmentsStatus === 'idle') {
      dispatch(fetchDepartments());
    }
  }, [isEdit, employee, departmentsStatus, dispatch]);

  
  const validate = () => {
    const errors = {};

    // Name Validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required.';
    }

    // Email Validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid.';
    }

    // Phone Validation
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Phone number must be 10 digits.';
    }

    // Gender Validation
    if (!formData.gender) {
      errors.gender = 'Gender is required.';
    }

    // Date of Birth Validation
    if (!formData.dob) {
      errors.dob = 'Date of birth is required.';
    } else {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      if (dobDate >= today) {
        errors.dob = 'Date of birth must be in the past.';
      }
    }

    // Department Validation
    if (!formData.deptId) {
      errors.deptId = 'Department is required.';
    }

    return errors;
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;

    
    setFormData({ ...formData, [name]: value });

    
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    
    const payload = {
      ...formData,
      deptId: parseInt(formData.deptId, 10), 
    };

    try {
      if (isEdit) {
        await dispatch(updateEmployee({ id: employee.id, ...payload })).unwrap();
      } else {
        await dispatch(createEmployee(payload)).unwrap();
      }

      
      //await dispatch(fetchEmployees()).unwrap();

      
      onClose();
    } catch (err) {
      
      console.error('Failed to submit:', err);
    }
  };

  return (
    <>
      {/* Display server-side error */}
      {employeeError && <Alert variant="danger">Error: {employeeError}</Alert>}

      {/* Form */}
      <Form onSubmit={handleSubmit} noValidate>
        <Row>
          {/* Name Field */}
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formEmployeeName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter employee name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!formErrors.name}
                required
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.name}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          {/* Email Field */}
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formEmployeeEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter employee email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!formErrors.email}
                required
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.email}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        
        <Row>
          {/* Phone Field */}
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formEmployeePhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter employee phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                isInvalid={!!formErrors.phone}
                required
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.phone}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          {/* Gender Field */}
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formEmployeeGender">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                isInvalid={!!formErrors.gender}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formErrors.gender}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        
        <Row>
          {/* Date of Birth Field */}
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formEmployeeDOB">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                isInvalid={!!formErrors.dob}
                required
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.dob}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          {/* Department Field */}
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formEmployeeDeptId">
              <Form.Label>Department</Form.Label>
              <Form.Select
                name="deptId"
                value={formData.deptId}
                onChange={handleChange}
                isInvalid={!!formErrors.deptId}
                required
              >
                <option value="">Select Department</option>
                {departmentsStatus === 'loading' && <option disabled>Loading departments...</option>}
                {departmentsStatus === 'failed' && <option disabled>Error loading departments</option>}
                {departmentsStatus === 'succeeded' && departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formErrors.deptId}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        
        {/* Submit and Cancel Buttons */}
        <div className="d-flex justify-content-end">
          <Button
            variant="primary"
            type="submit"
            className="me-2"
            disabled={employeeStatus === 'loading'}
          >
            {isEdit
              ? (employeeStatus === 'loading' ? 'Updating...' : 'Update')
              : (employeeStatus === 'loading' ? 'Creating...' : 'Create')}
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={employeeStatus === 'loading'}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </>
  );
}

export default EmployeeForm;
