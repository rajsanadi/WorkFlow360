

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify'; 

const initialState = {
  departments: [],
  status: 'idle',
  error: null,
};

// Async Thunks

export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/Departments');
      return response.data;
    } catch (err) {
      
      return rejectWithValue(err.response.data || 'Failed to fetch departments');
    }
  }
);

export const createDepartment = createAsyncThunk(
  'departments/createDepartment',
  async (deptData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/Departments', deptData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data || 'Failed to create department');
    }
  }
);

export const updateDepartment = createAsyncThunk(
  'departments/updateDepartment',
  async (deptData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/Departments/${deptData.id}`, deptData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data || 'Failed to update department');
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  'departments/deleteDepartment',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/Departments/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data || 'Failed to delete department');
    }
  }
);

// Slice

const departmentsSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Departments
      .addCase(fetchDepartments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.departments = action.payload;
       
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(`Error fetching departments: ${action.payload}`);
      })
      
      // Create Department
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.departments.push(action.payload);
        toast.success('Department created successfully!');
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(`Error creating department: ${action.payload}`);
      })
      
      // Update Department
      .addCase(updateDepartment.fulfilled, (state, action) => {
        const index = state.departments.findIndex((dept) => dept.id === action.payload.id);
        if (index !== -1) {
          state.departments[index] = action.payload;
          toast.success('Department updated successfully!');
        }
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(`Error updating department: ${action.payload}`);
      })
      
      // Delete Department
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.departments = state.departments.filter((dept) => dept.id !== action.payload);
        toast.success('Department deleted successfully!');
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(`Error deleting department: ${action.payload}`);
      });
  },
});

export default departmentsSlice.reducer;
