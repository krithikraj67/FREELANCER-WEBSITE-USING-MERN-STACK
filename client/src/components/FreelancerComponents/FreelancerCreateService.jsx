import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  allServices: [],
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

const freelancerSlice = createSlice({
  name: "freelancer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(myServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(myServices.fulfilled, (state, action) => {
        state.loading = false;
        state.allServices = action.payload;
      })
      .addCase(myServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        // Update state to reflect deleted service
        state.allServices = state.allServices.filter(
          (service) => service._id !== action.payload.deletedServiceId
        );
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        // Assuming the response includes the created service
        state.allServices.push(action.payload.service);
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default freelancerSlice.reducer;
