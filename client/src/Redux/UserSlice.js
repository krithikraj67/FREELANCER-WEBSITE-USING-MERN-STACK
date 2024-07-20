import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = "http://localhost:3001";

// Async thunk for user registration
export const signUp = createAsyncThunk(
  "user/signUp",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/user/register`, userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for user login
export const login = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/user/login`, credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating user profile
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (formData) => {
    try {
      const id = formData.get("userID");
      const response = await axios.put(`${apiUrl}/user/users/${id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();
      return data; // Adjust as per your API response structure
    } catch (error) {
      throw Error("Failed to update user profile");
    }
  }
);

const initialState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
    },
  },
  extraReducers: (builder) => {
    // Handle user sign up
    builder.addCase(signUp.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.status = "succeeded";
      toast.success(action.payload.msg);
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.status = "failed";
      toast.error(action.payload.error);
    });

    // Handle user login
    builder.addCase(login.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.token = action.payload.token;
      state.user = action.payload.userInfo;
      localStorage.setItem("token", action.payload.token);
    });
    builder.addCase(login.rejected, (state, action) => {
      state.status = "failed";
      toast.error(action.payload.error);
    });

    // Handle user update
    builder.addCase(updateUser.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.user = action.payload.updatedUserInfo;
      toast.success(action.payload.msg);
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.status = "failed";
      toast.error(action.payload.error);
    });
  },
});

export const { logout } = userSlice.actions;

export const tokenExists = (token) => {
  if (!token) {
    return false;
  }

  try {
    const userInfoString = localStorage.getItem("userInfo");
    if (!userInfoString) return false;
    return true;
  } catch (error) {
    console.error("Error parsing userInfo from localStorage:", error);
    return false;
  }
};

export default userSlice.reducer;
