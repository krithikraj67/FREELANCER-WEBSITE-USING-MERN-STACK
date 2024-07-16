import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  allServices: [],
  dashboardData: null,
  loading: false,
  error: null,
};

export const myServices = createAsyncThunk(
  "freelancer/myServices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/freelancer/services"); // Replace with your actual API endpoint
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteService = createAsyncThunk(
  "freelancer/deleteService",
  async (serviceId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `/api/freelancer/service/${serviceId}`
      ); // Replace with your actual API endpoint
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createService = createAsyncThunk(
  "freelancer/createService",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/freelancer/service", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const myDashboard = createAsyncThunk(
  "freelancer/myDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/freelancer/dashboard"); // Replace with your actual API endpoint
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const freelancerSlice = createSlice({
  name: "freelancer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ... existing cases for myServices, deleteService, and createService
      .addCase(myDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(myDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(myDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default freelancerSlice.reducer;
