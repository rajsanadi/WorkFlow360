
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';


const initialState = {
  employees: [],
  status: 'idle',
  error: null,
};




export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
  const response = await axiosInstance.get('/Employees');
  return response.data;
});


export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (employeeData, { rejectWithValue }) => {
    try {
      
      const { name, email, phone, gender, dob, deptId } = employeeData;
      const payload = { name, email, phone, gender, dob, deptId };
      
      const response = await axiosInstance.post('/Employees', payload);
      toast.success('Employee created successfully!');
      return response.data;
    } catch (err) {
      
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message;
      toast.error(`Failed to create employee: ${errorMessage}`);
      return rejectWithValue(errorMessage);
    }
  }
);

// Update Emp
export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async (employeeData, { rejectWithValue }) => {
    try {
      const { id, name, email, phone, gender, dob, deptId } = employeeData;
      const payload = { id, name, email, phone, gender, dob, deptId };
      
      const response = await axiosInstance.put(`/Employees/${id}`, payload);
      toast.success('Employee updated successfully!');
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message;
      toast.error(`Failed to update employee: ${errorMessage}`);
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete Employee
export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/Employees/${id}`);
      toast.success('Employee deleted successfully!');
      return id;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message;
      toast.error(`Failed to delete employee: ${errorMessage}`);
      return rejectWithValue(errorMessage);
    }
  }
);


const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchEmployees.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        toast.error(`Failed to fetch employees: ${action.error.message}`);
      })
      
      
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.employees.push(action.payload);
      })
      
      
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      
      
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter(emp => emp.id !== action.payload);
      });
  },
});

export default employeesSlice.reducer;
