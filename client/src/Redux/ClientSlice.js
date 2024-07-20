/* eslint-disable eqeqeq */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3001";

export const myDashboard = createAsyncThunk(
  "client/myDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/client/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Check The Server"
      );
    }
  }
);

export const freelancersServices = createAsyncThunk(
  "client/freelancersServices",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/client/allServices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Check The Server"
      );
    }
  }
);

export const serviceInfo = createAsyncThunk(
  "client/serviceInfo",
  async (serviceId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/client/service/${serviceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Check The Server"
      );
    }
  }
);

export const getOrders = createAsyncThunk(
  "client/getOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/client/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Check The Server"
      );
    }
  }
);

export const orderInfo = createAsyncThunk(
  "client/orderInfo",
  async (orderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/client/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Check The Server"
      );
    }
  }
);

export const makeOrder = createAsyncThunk(
  "client/makeOrder",
  async (serviceId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/client/order`,
        { serviceId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Check The Server"
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "client/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/client/order/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Check The Server"
      );
    }
  }
);

export const makeTestimonial = createAsyncThunk(
  "client/makeTestimonial",
  async ({ orderId, text, rating }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/client/testimonial/${orderId}`,
        { text, rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Check The Server"
      );
    }
  }
);

const initialState = {
  dashboard: null,
  allServices: [],
  serviceInfo: null,
  orders: [],
  orderInfo: null,
  error: null,
  loading: false,
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  extraReducers: (builder) => {
    // Get Client Dashboard
    builder
      .addCase(myDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(myDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(myDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Freelancers Services
    builder
      .addCase(freelancersServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(freelancersServices.fulfilled, (state, action) => {
        state.loading = false;
        state.allServices = action.payload;
      })
      .addCase(freelancersServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Service Info
    builder
      .addCase(serviceInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(serviceInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceInfo = action.payload;
      })
      .addCase(serviceInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Orders
    builder
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Order Info
    builder
      .addCase(orderInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(orderInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.orderInfo = action.payload;
      })
      .addCase(orderInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Make Order
    builder
      .addCase(makeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(makeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderInfo = action.payload;
      })
      .addCase(makeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Order Status
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.orderInfo = action.payload;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Make Testimonial
    builder
      .addCase(makeTestimonial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(makeTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the payload according to the application needs
      })
      .addCase(makeTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default clientSlice.reducer;
