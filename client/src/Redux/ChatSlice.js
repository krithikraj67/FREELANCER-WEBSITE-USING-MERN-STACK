import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3001";

export const myConversations = createAsyncThunk(
  "chat/myConversations",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/chat/all`, {
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

export const conversationMessages = createAsyncThunk(
  "chat/conversationMessages",
  async (chatId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/chat/messages/${chatId}`, {
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

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ receiver, text }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/chat/sendMessage`,
        { receiver, text },
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

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    data: [], // List of conversations
    messages: [], // List of messages for the selected conversation
    error: null,
    loading: false,
  },
  reducers: {
    setNewMessages: (state, action) => {
      state.messages.push(action.payload); // Assuming payload is a new message
    },
  },
  extraReducers: (builder) => {
    // Get User Conversations
    builder
      .addCase(myConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(myConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(myConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Conversation Messages
    builder
      .addCase(conversationMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(conversationMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(conversationMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Send Message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload); // Assuming payload is the sent message
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setNewMessages } = chatSlice.actions;
export default chatSlice.reducer;
