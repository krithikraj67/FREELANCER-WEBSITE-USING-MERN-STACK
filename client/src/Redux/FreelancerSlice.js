import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  allServices: [],
  selectedService: null,
  data: null,
  loading: false,
  error: null,
};

const API_URL = "http://localhost:3001";

export const myServices = createAsyncThunk(
  "freelancer/myServices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/freelancer/myServices`);
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
        `${API_URL}/freelancer/service/${serviceId}`
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
      const response = await axios.post(
        `${API_URL}/freelancer/service`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
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
      const response = await axios.get(
        `${API_URL}/freelancer/service/${serviceId}`
      ); // Replace with your actual API endpoint
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
        `${API_URL}/freelancer/service/${serviceId}`,
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

export const myDashboard = createAsyncThunk(
  "freelancer/myDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/freelancer/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add the token to the request headers
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
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
        state.allServices = state.allServices.filter(
          (service) => service._id !== action.meta.arg
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
        state.allServices.push(action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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
      })
      .addCase(myDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(myDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(myDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default freelancerSlice.reducer;
