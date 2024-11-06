
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { createDepartment, updateDepartment, fetchDepartments } from './departmentsSlice';
import { Form, Button } from 'react-bootstrap';

function DepartmentForm({ department, onClose }) {
  const dispatch = useDispatch();
  const isEdit = Boolean(department);
  
  const [name, setName] = useState('');

  useEffect(() => {
    if (isEdit && department) {
      setName(department.name);
    }
  }, [isEdit, department]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      dispatch(updateDepartment({ id: department.id, name })).then(() => {
        dispatch(fetchDepartments());
        onClose();
      });
    } else {
      dispatch(createDepartment({ name })).then(() => {
        //dispatch(fetchDepartments());
        onClose();
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formDepartmentName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter department name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Form.Group>
      
      <Button variant="primary" type="submit">
        {isEdit ? 'Update' : 'Create'}
      </Button>
      {' '}
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
    </Form>
  );
}

export default DepartmentForm;
