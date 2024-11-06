

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchSalaries,
  deleteSalary,
  fetchDepartmentSalaryReport,
  fetchDepartmentMonthlySalaryReport, 
} from './salariesSlice';
import { fetchEmployees } from '../employees/employeesSlice';
import { Button, Table, Form, Modal, Row, Col, Alert } from 'react-bootstrap';
import SalaryForm from './SalaryForm';
import ConfirmModal from '../../components/ConfirmModal';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaChartBar, FaDollarSign } from 'react-icons/fa';
import './SalariesList.css';
import { Bar } from 'react-chartjs-2'; 
import 'chart.js/auto'; 
import { ToastContainer, toast } from 'react-toastify';

function SalariesList() {
  const dispatch = useDispatch();

  const {
    salaries,
    departmentSalaryReport,
    monthlyDepartmentSalaryReport, 
    status,
    error,
    reportStatus,
    reportError,
    monthlyReportStatus, 
    monthlyReportError,   
  } = useSelector((state) => state.salaries);

  const {
    employees,
    status: employeesStatus,
    error: employeesError,
  } = useSelector((state) => state.employees);

 
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');

  
  const [reportYear, setReportYear] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);

  // New state variables for Monthly Report
  const [monthlyReportDept, setMonthlyReportDept] = useState('');
  const [monthlyReportMonth, setMonthlyReportMonth] = useState('');
  const [monthlyReportYear, setMonthlyReportYear] = useState('');
  const [showMonthlyReportModal, setShowMonthlyReportModal] = useState(false);

  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentSalary, setCurrentSalary] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [salaryToDelete, setSalaryToDelete] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSalaries());
    }
    if (employeesStatus === 'idle') {
      dispatch(fetchEmployees());
    }
  }, [status, employeesStatus, dispatch]);

 
  const handleFetchReport = (e) => {
    e.preventDefault();
    if (reportYear) {
      dispatch(fetchDepartmentSalaryReport(reportYear));
      setShowReportModal(true);
    }
  };

  // New handleFetchMonthlyReport function
  const handleFetchMonthlyReport = (e) => {
    e.preventDefault();
    if (monthlyReportDept && monthlyReportMonth && monthlyReportYear) {
      dispatch(fetchDepartmentMonthlySalaryReport({
        departmentId: parseInt(monthlyReportDept, 10),
        month: parseInt(monthlyReportMonth, 10),
        year: parseInt(monthlyReportYear, 10),
      }));
      setShowMonthlyReportModal(true);
    } else {
      toast.error('Please select department, month, and year for the report.');
    }
  };

  
  const filteredSalaries = salaries.filter((sal) => {
    const withinRange =
      (!minSalary || sal.amount >= parseFloat(minSalary)) &&
      (!maxSalary || sal.amount <= parseFloat(maxSalary));
    return withinRange;
  });

  const handleDelete = () => {
    if (salaryToDelete) {
      dispatch(deleteSalary(salaryToDelete.id));
      setShowDeleteModal(false);
    }
  };

  
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 20; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  // New getMonthOptions function
  const getMonthOptions = () => {
    const months = [
      { value: 1, name: 'January' },
      { value: 2, name: 'February' },
      { value: 3, name: 'March' },
      { value: 4, name: 'April' },
      { value: 5, name: 'May' },
      { value: 6, name: 'June' },
      { value: 7, name: 'July' },
      { value: 8, name: 'August' },
      { value: 9, name: 'September' },
      { value: 10, name: 'October' },
      { value: 11, name: 'November' },
      { value: 12, name: 'December' },
    ];
    return months;
  };

  // Extract unique departments from employees
  const getUniqueDepartments = () => {
    const departments = employees.map((emp) => ({
      id: emp.deptId,
      name: emp.departmentName,
    }));
    // Remove duplicates
    return departments.filter((dept, index, self) =>
      index === self.findIndex((d) => d.id === dept.id)
    );
  };

  return (
    <div className="salaries-container">
      <h2> <FaDollarSign className="me-2" />Salaries</h2>

      {/* Filter and Add Salary Section */}
      <div className="controls-section">
        <Row className="align-items-center mb-3">
          <Col md={4} sm={12} className="mb-2 mb-md-0">
            <Button
              variant="primary"
              className="add-salary-btn"
              onClick={() => setShowCreateModal(true)}
            >
              <FaPlus className="me-2" />Add Salary
            </Button>
          </Col>
          <Col md={8} sm={12}>
            <Form className="filter-form d-flex align-items-center">
              <Row className="w-100">
                <Col md={4} sm={12} className="mb-2 mb-md-0">
                  <Form.Group controlId="formMinSalary" className="mb-0">
                    <Form.Control
                      type="number"
                      placeholder="Min Salary"
                      value={minSalary}
                      onChange={(e) => setMinSalary(e.target.value)}
                      min="0"
                    />
                  </Form.Group>
                </Col>
                <Col md={4} sm={12} className="mb-2 mb-md-0">
                  <Form.Group controlId="formMaxSalary" className="mb-0">
                    <Form.Control
                      type="number"
                      placeholder="Max Salary"
                      value={maxSalary}
                      onChange={(e) => setMaxSalary(e.target.value)}
                      min="0"
                    />
                  </Form.Group>
                </Col>
                <Col md={4} sm={12} className="d-flex align-items-end">
                  <Button
                    variant="danger"
                    className="clear-filters-btn w-100"
                    onClick={() => {
                      setMinSalary('');
                      setMaxSalary('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>

      {/* Annual Report Generation Section */}
      <div className="report-section">
        <Form onSubmit={handleFetchReport}>
          <Row className="align-items-center">
            <Col md={6} sm={12} className="mb-2 mb-md-0">
              <Form.Group controlId="formReportYear">
                <Form.Label><FaChartBar className="me-2" /> Enter Year for Report</Form.Label>
                <Form.Control
                  as="select"
                  value={reportYear}
                  onChange={(e) => setReportYear(e.target.value)}
                  required
                >
                  <option value="">Select Year</option>
                  {getYearOptions().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6} sm={12}>
              <Button variant="secondary" type="submit" className="w-100">
                Show Annual Report
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      {/* New: Monthly Report Generation Section */}
      <div className="monthly-report-section mt-4">
        <Form onSubmit={handleFetchMonthlyReport}>
          <Row className="align-items-center">
            <Col md={3} sm={12} className="mb-2 mb-md-0">
              <Form.Group controlId="formReportDepartment">
                <Form.Label><FaChartBar className="me-2" /> Select Department</Form.Label>
                <Form.Control
                  as="select"
                  value={monthlyReportDept}
                  onChange={(e) => setMonthlyReportDept(e.target.value)}
                  required
                >
                  <option value="">Select Department</option>
                  {employeesStatus === 'succeeded' && getUniqueDepartments().map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={3} sm={12} className="mb-2 mb-md-0">
              <Form.Group controlId="formReportMonth">
                <Form.Label><FaChartBar className="me-2" /> Select Month</Form.Label>
                <Form.Control
                  as="select"
                  value={monthlyReportMonth}
                  onChange={(e) => setMonthlyReportMonth(e.target.value)}
                  required
                >
                  <option value="">Select Month</option>
                  {getMonthOptions().map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={3} sm={12} className="mb-2 mb-md-0">
              <Form.Group controlId="formReportYearMonthly">
                <Form.Label><FaChartBar className="me-2" /> Enter Year</Form.Label>
                <Form.Control
                  as="select"
                  value={monthlyReportYear}
                  onChange={(e) => setMonthlyReportYear(e.target.value)}
                  required
                >
                  <option value="">Select Year</option>
                  {getYearOptions().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={3} sm={12} className="d-flex align-items-end">
              <Button variant="secondary" type="submit" className="w-100">
                Show Monthly Report
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Loading and Error States */}
      {(status === 'loading' ||
        employeesStatus === 'loading' ||
        reportStatus === 'loading' ||
        monthlyReportStatus === 'loading') && (
        <div className="status-message">Loading...</div>
      )}
      {(status === 'failed' ||
        employeesStatus === 'failed' ||
        reportStatus === 'failed' ||
        monthlyReportStatus === 'failed') && (
        <div className="status-message status-error">
          Error: {error || employeesError || reportError || monthlyReportError}
        </div>
      )}

      {/* Salaries Table */}
      {status === 'succeeded' && (
        <Table className="salaries-table mt-3" responsive>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalaries.length > 0 ? (
              filteredSalaries.map((sal) => (
                <tr key={sal.id}>
                  <td>{sal.employeeName}</td>
                  <td>${sal.amount.toLocaleString()}</td>
                  <td>{new Date(sal.date).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="action-btn edit-btn me-2"
                      onClick={() => {
                        setCurrentSalary(sal);
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
                        setSalaryToDelete(sal);
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
                <td colSpan="4" className="text-center">
                  No salaries found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Annual Department Salary Report Modal */}
      <Modal
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Department Salary Report for {reportYear}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reportStatus === 'loading' && (
            <div className="status-message">Loading report...</div>
          )}
          {reportStatus === 'failed' && (
            <div className="status-message status-error">
              Error: {reportError}
            </div>
          )}
          {reportStatus === 'succeeded' && departmentSalaryReport && (
            <>
              <Table className="report-table" striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Total Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentSalaryReport.length > 0 ? (
                    departmentSalaryReport.map((report) => (
                      <tr key={report.departmentId}>
                        <td>{report.departmentName}</td>
                        <td>${report.totalSalary.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center">
                        No data available for the selected year.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* Optional: Add a Bar Chart for Visualization */}
              <Bar
                data={{
                  labels: departmentSalaryReport.map((report) => report.departmentName),
                  datasets: [
                    {
                      label: 'Total Salary',
                      data: departmentSalaryReport.map((report) => report.totalSalary),
                      backgroundColor: 'rgba(75, 192, 192, 0.6)',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: `Total Salary by Department in ${reportYear}`,
                    },
                  },
                }}
              />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>
            <FaTimes className="me-2" /> Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* New: Monthly Department Salary Report Modal */}
      <Modal
        show={showMonthlyReportModal}
        onHide={() => setShowMonthlyReportModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Department Salary Report for {monthlyReportMonth && monthlyReportYear ? `${new Date(monthlyReportMonth - 1, 0).toLocaleString('default', { month: 'long' })} ${monthlyReportYear}` : ''}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {monthlyReportStatus === 'loading' && (
            <div className="status-message">Loading monthly report...</div>
          )}
          {monthlyReportStatus === 'failed' && (
            <div className="status-message status-error">
              Error: {monthlyReportError}
            </div>
          )}
          {monthlyReportStatus === 'succeeded' && monthlyDepartmentSalaryReport && (
            <>
              <Table className="report-table" striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Total Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyDepartmentSalaryReport.length > 0 ? (
                    monthlyDepartmentSalaryReport.map((report) => (
                      <tr key={report.departmentId}>
                        <td>{report.departmentName}</td>
                        <td>${report.totalSalary.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center">
                        No data available for the selected month and year.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* Optional: Add a Bar Chart for Visualization */}
              <Bar
                data={{
                  labels: monthlyDepartmentSalaryReport.map((report) => report.departmentName),
                  datasets: [
                    {
                      label: 'Total Salary',
                      data: monthlyDepartmentSalaryReport.map((report) => report.totalSalary),
                      backgroundColor: 'rgba(153, 102, 255, 0.6)',
                      borderColor: 'rgba(153, 102, 255, 1)',
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: `Total Salary by Department in ${monthlyReportMonth && monthlyReportYear ? `${new Date(monthlyReportMonth - 1, 0).toLocaleString('default', { month: 'long' })} ${monthlyReportYear}` : ''}`,
                    },
                  },
                }}
              />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMonthlyReportModal(false)}>
            <FaTimes className="me-2" /> Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Existing Create Salary Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Salary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SalaryForm onClose={() => setShowCreateModal(false)} />
        </Modal.Body>
      </Modal>

      {/* Existing Edit Salary Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Salary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SalaryForm salary={currentSalary} onClose={() => setShowEditModal(false)} />
        </Modal.Body>
      </Modal>

      {/* Existing Delete Confirmation Modal */}
      <ConfirmModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleDelete}
        title="Confirm Deletion"
        body={`Are you sure you want to delete the salary record for "${salaryToDelete?.employeeName}"?`}
      />
    </div>
  );
}

export default SalariesList;
