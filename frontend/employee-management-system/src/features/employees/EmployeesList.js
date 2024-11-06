import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEmployees, deleteEmployee } from './employeesSlice';
import { fetchDepartments } from '../departments/departmentsSlice'; 
import { Button, Table, Form, Modal } from 'react-bootstrap';
import EmployeeForm from './EmployeeForm';
import ConfirmModal from '../../components/ConfirmModal';
import { FaEdit, FaTrash, FaPlus , FaUsers } from 'react-icons/fa';
import './EmployeesList.css';

function EmployeesList() {
  const dispatch = useDispatch();

  const { employees, status: employeesStatus, error: employeesError } = useSelector((state) => state.employees);
  const { departments, status: departmentsStatus, error: departmentsError } = useSelector((state) => state.departments);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    if (employeesStatus === 'idle') {
      dispatch(fetchEmployees());
    }
    if (departmentsStatus === 'idle') {
      dispatch(fetchDepartments());
    }
  }, [employeesStatus, departmentsStatus, dispatch]);

  // Search
  const filteredEmployees = employees.filter((employee) => {
    const matchesName = employee.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept ? employee.deptId === parseInt(selectedDept) : true;
    return matchesName && matchesDept;
  });

  const handleDelete = () => {
    if (employeeToDelete) {
      dispatch(deleteEmployee(employeeToDelete.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="employees-container">
    <h2> <FaUsers size={30} color="#000" /> Employees</h2>

      {/* Search and Filter Section */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button 
          variant="primary" 
          className="add-employee-btn" 
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus className="me-2" /> Add Employee
        </Button>

        <Form className="filter-form d-flex">
          {/* Search Input */}
          <Form.Control
            type="text"
            placeholder="Search Employees"
            className="me-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Department Filter Dropdown */}
          <Form.Select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="me-2"
          >
            <option value="">All Departments</option>
            {departmentsStatus === 'succeeded' && departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </Form.Select>

          {/* Clear Filters Button */}
          <Button 
            variant="danger" 
            className="clear-filters-btn"
            onClick={() => { setSearchTerm(''); setSelectedDept(''); }}
          >
            Clear
          </Button>
        </Form>
      </div>

      {/* Loading and Error States */}
      {(employeesStatus === 'loading' || departmentsStatus === 'loading') && (
        <div className="status-message">Loading...</div>
      )}
      {(employeesStatus === 'failed' || departmentsStatus === 'failed') && (
        <div className="status-message status-error">
          Error: {employeesError || departmentsError}
        </div>
      )}

      {/* Employees Table */}
      {employeesStatus === 'succeeded' && departmentsStatus === 'succeeded' && (
        <Table className="employees-table" responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.gender}</td>
                  <td>{new Date(emp.dob).toLocaleDateString()}</td>
                  <td>{emp.departmentName}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="action-btn edit-btn"
                      onClick={() => {
                        setCurrentEmployee(emp);
                        setShowEditModal(true);
                      }}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="action-btn delete-btn"
                      onClick={() => {
                        setEmployeeToDelete(emp);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Create Emp Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EmployeeForm onClose={() => setShowCreateModal(false)} />
        </Modal.Body>
      </Modal>

      {/* Edit Emp Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EmployeeForm employee={currentEmployee} onClose={() => setShowEditModal(false)} />
        </Modal.Body>
      </Modal>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleDelete}
        title="Confirm Deletion"
        body={`Are you sure you want to delete employee "${employeeToDelete?.name}"?`}
      />
    </div>
  );
}

export default EmployeesList;
