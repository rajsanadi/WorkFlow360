import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import Navbar from './components/Navbar';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import EmployeesList from './features/employees/EmployeesList';
import EmployeeForm from './features/employees/EmployeeForm';
import DepartmentsList from './features/departments/DepartmentsList';
import DepartmentForm from './features/departments/DepartmentFrom';
import SalariesList from './features/salaries/SalariesList';
import SalaryForm from './features/salaries/SalaryForm';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <div style={{ padding: '20px' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/employees"
              element={
                <PrivateRoute>
                  <EmployeesList />
                </PrivateRoute>
              }
            />
            <Route
              path="/employees/create"
              element={
                <PrivateRoute>
                  <EmployeeForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/employees/edit/:id"
              element={
                <PrivateRoute>
                  <EmployeeForm />
                </PrivateRoute>
              }
            />

            <Route
              path="/departments"
              element={
                <PrivateRoute>
                  <DepartmentsList />
                </PrivateRoute>
              }
            />
            <Route
              path="/departments/create"
              element={
                <PrivateRoute>
                  <DepartmentForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/departments/edit/:id"
              element={
                <PrivateRoute>
                  <DepartmentForm />
                </PrivateRoute>
              }
            />

            <Route
              path="/salaries"
              element={
                <PrivateRoute>
                  <SalariesList />
                </PrivateRoute>
              }
            />
            <Route
              path="/salaries/create"
              element={
                <PrivateRoute>
                  <SalaryForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/salaries/edit/:id"
              element={
                <PrivateRoute>
                  <SalaryForm />
                </PrivateRoute>
              }
            />

            {/* Default Route */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <EmployeesList />
                </PrivateRoute>
              }
            />

            
            <Route path="*" element={<h2>Page Not Found</h2>} />
          </Routes>
        </div>
        <ToastContainer />
      </Router>
    </Provider>
  );
}

export default App;
