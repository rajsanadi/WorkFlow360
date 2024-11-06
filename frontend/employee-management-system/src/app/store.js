
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import employeesReducer from '../features/employees/employeesSlice';
import departmentsReducer from '../features/departments/departmentsSlice';
import salariesReducer from '../features/salaries/salariesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeesReducer,
    departments: departmentsReducer,
    salaries: salariesReducer,
  },
});

export default store;
