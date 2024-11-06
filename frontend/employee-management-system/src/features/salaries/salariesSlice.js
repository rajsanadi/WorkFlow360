import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../api/axios';




const initialState = {
  salaries: [],
  departmentSalaryReport: null,
  status: 'idle',
  error: null,
  reportStatus: 'idle',
  reportError: null,
  monthlyReportStatus: 'idle', 
  monthlyReportError: null,
};

export const fetchSalaries = createAsyncThunk('salaries/fetchSalaries', async () => {
  const response = await axiosInstance.get('/Salaries');
  return response.data;
});

export const fetchDepartmentMonthlySalaryReport = createAsyncThunk(
  'salaries/fetchDepartmentMonthlySalaryReport',
  async ({ departmentId, month, year }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/Salaries/DepartmentMonthlySalaryReport', {
        params: { departmentId, month, year },
      });
      return response.data;
    } catch (err) {
      let errorMessage = 'Failed to fetch department monthly salary report.';
      if (err.response && err.response.data) {
        errorMessage = err.response.data.message || 'Failed to fetch department monthly salary report.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const createSalary = createAsyncThunk(
  'salaries/createSalary',
  async (salaryData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/Salaries', salaryData);
      toast.success('Salary record created successfully!');
      return response.data;
    } catch (err) {
      let errorMessage = 'Failed to create salary record.';
      if (err.response && err.response.data) {
        errorMessage = err.response.data.message || 'Failed to create salary record.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateSalary = createAsyncThunk(
  'salaries/updateSalary',
  async (salaryData, { rejectWithValue, getState }) => {
    try {
      const employee = getState().employees.employees.find(emp => emp.id === salaryData.empId);
      const updatedSalaryData = {
        ...salaryData,
        employeeName: employee ? employee.name : '',
      };
      const response = await axiosInstance.put(`/Salaries/${salaryData.id}`, updatedSalaryData);
      toast.success('Salary record updated successfully!');
      return response.data;
    } catch (err) {
      let errorMessage = 'Failed to update salary record.';
      if (err.response && err.response.data) {
        errorMessage = err.response.data.message || 'Failed to update salary record.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteSalary = createAsyncThunk(
  'salaries/deleteSalary',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/Salaries/${id}`);
      toast.success('Salary record deleted successfully!');
      return id;
    } catch (err) {
      let errorMessage = 'Failed to delete salary record.';
      if (err.response && err.response.data) {
        errorMessage = err.response.data.message || 'Failed to delete salary record.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch Department Salary Report
export const fetchDepartmentSalaryReport = createAsyncThunk(
  'salaries/fetchDepartmentSalaryReport',
  async (year, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/Salaries/DepartmentSalaryReport`, {
        params: { year },
      });
      
      return response.data;
    } catch (err) {
      let errorMessage = 'Failed to fetch department salary report.';
      if (err.response && err.response.data) {
        errorMessage = err.response.data.message || 'Failed to fetch department salary report.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const salariesSlice = createSlice({
  name: 'salaries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalaries.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSalaries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.salaries = action.payload;
      })
      .addCase(fetchSalaries.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(createSalary.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createSalary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.salaries.push(action.payload);
      })
      .addCase(createSalary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(updateSalary.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateSalary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.salaries.findIndex((sal) => sal.id === action.payload.id);
        if (index !== -1) {
          state.salaries[index] = action.payload;
        }
      })
      .addCase(updateSalary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(deleteSalary.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteSalary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.salaries = state.salaries.filter((sal) => sal.id !== action.payload);
      })
      .addCase(deleteSalary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(fetchDepartmentSalaryReport.pending, (state) => {
        state.reportStatus = 'loading';
      })
      .addCase(fetchDepartmentSalaryReport.fulfilled, (state, action) => {
        state.reportStatus = 'succeeded';
        state.departmentSalaryReport = action.payload;
      })
      .addCase(fetchDepartmentSalaryReport.rejected, (state, action) => {
        state.reportStatus = 'failed';
        state.reportError = action.payload;
      })

      .addCase(fetchDepartmentMonthlySalaryReport.pending, (state) => {
        state.monthlyReportStatus = 'loading';
      })
      .addCase(fetchDepartmentMonthlySalaryReport.fulfilled, (state, action) => {
        state.monthlyReportStatus = 'succeeded';
        state.monthlyDepartmentSalaryReport = action.payload;
      })
      .addCase(fetchDepartmentMonthlySalaryReport.rejected, (state, action) => {
        state.monthlyReportStatus = 'failed';
        state.monthlyReportError = action.payload;
      });
  },
});

export default salariesSlice.reducer;
