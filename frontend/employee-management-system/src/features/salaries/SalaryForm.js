

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSalary, updateSalary, fetchSalaries } from './salariesSlice';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';

function SalaryForm({ salary, onClose }) {
  const dispatch = useDispatch();
  const isEdit = Boolean(salary);

  const [formData, setFormData] = useState({
    empId: '',
    amount: '',
    date: '',
  });

  
  const { employees, status: employeesStatus, error: employeesError } = useSelector((state) => state.employees);

  useEffect(() => {
    if (isEdit && salary) {
      setFormData({
        empId: salary.empId,
        amount: salary.amount,
        date: salary.date.slice(0, 10), 
      });
    }
  }, [isEdit, salary]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      dispatch(updateSalary({ id: salary.id, ...formData })).then(() => {
        dispatch(fetchSalaries()); 
        onClose();
      });
    } else {
      dispatch(createSalary(formData)).then(() => {
        dispatch(fetchSalaries()); 
        onClose();
      });
    }
  };


  if (employeesStatus === 'loading') {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading employees...</span>
        </Spinner>
      </div>
    );
  }

  if (employeesStatus === 'failed') {
    return <div className="text-danger">Error fetching employees: {employeesError}</div>;
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group controlId="formEmpId" className="mb-3">
            <Form.Label>Employee</Form.Label>
            <Form.Select
              name="empId"
              value={formData.empId}
              onChange={handleChange}
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group controlId="formAmount" className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter salary amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group controlId="formDate" className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex justify-content-end">
        <Button variant="primary" type="submit" className="me-2">
          {isEdit ? 'Update' : 'Create'}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Form>
  );
}

export default SalaryForm;
