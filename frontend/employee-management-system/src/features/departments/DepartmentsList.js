import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDepartments, deleteDepartment } from './departmentsSlice';
import { Button, Table, Form, Modal } from 'react-bootstrap';
import DepartmentForm from './DepartmentFrom';
import ConfirmModal from '../../components/ConfirmModal';
import { FaEdit, FaTrash , FaPlus,  FaBuilding} from 'react-icons/fa';
import './DepartmentsList.css';

function DepartmentsList() {
  const dispatch = useDispatch();
  const { departments, status, error } = useSelector((state) => state.departments);
  const [searchTerm, setSearchTerm] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDepartments());
    }
  }, [status, dispatch]);

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = () => {
    if (departmentToDelete) {
      dispatch(deleteDepartment(departmentToDelete.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="departments-container">
      <h2><FaBuilding size={24} color="#000" /> Departments</h2>
      <div className="controls-section d-flex justify-content-between align-items-center mb-3">
        <Button
          variant="primary"
          className="add-department-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus className="me-2" />Add Department
        </Button>
        <Form className="search-form d-flex">
          <Form.Control
            type="text"
            placeholder="Search Departments"
            className="me-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="danger"
            className="clear-search-btn"
            onClick={() => setSearchTerm('')}
          >
            Clear
          </Button>
        </Form>
      </div>

      {status === 'loading' && <div className="status-message">Loading...</div>}
      {status === 'failed' && <div className="status-message status-error">Error: {error}</div>}

      {status === 'succeeded' && (
        <Table className="departments-table" responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((dept) => (
                <tr key={dept.id}>
                  <td>{dept.name}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="action-btn edit-btn me-2"
                      onClick={() => {
                        setCurrentDepartment(dept);
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
                        setDepartmentToDelete(dept);
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
                <td colSpan="2" className="text-center">
                  No departments found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DepartmentForm onClose={() => setShowCreateModal(false)} />
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DepartmentForm department={currentDepartment} onClose={() => setShowEditModal(false)} />
        </Modal.Body>
      </Modal>

      <ConfirmModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleDelete}
        title="Confirm Deletion"
        body={`Are you sure you want to delete department "${departmentToDelete?.name}"?`}
      />
    </div>
  );
}

export default DepartmentsList;
