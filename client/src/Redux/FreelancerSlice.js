import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  allServices: [],
  selectedService: null,
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

export const showService = createAsyncThunk(
  "freelancer/showService",
  async (serviceId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/freelancer/service/${serviceId}`); // Replace with your actual API endpoint
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateService = createAsyncThunk(
  "freelancer/updateService",
  async ({ serviceId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/api/freelancer/service/${serviceId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
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
      .addCase(showService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(showService.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedService = action.payload;
      })
      .addCase(showService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        // Update the selectedService with the updated data
        state.selectedService = action.payload.updatedService;
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default freelancerSlice.reducer;
