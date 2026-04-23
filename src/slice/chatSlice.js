import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ================= FRIENDS =================
export const fetchFriends = createAsyncThunk(
  "chat/fetchFriends",
  async (userId) => {
    const res = await axios.get(`http://localhost:5000/api/friends/${userId}`);
    return res.data || [];
  }
);

// ================= REQUESTS =================
export const fetchRequests = createAsyncThunk(
  "chat/fetchRequests",
  async (userId) => {
    const res = await axios.get(
      `http://localhost:5000/api/friend/requests/${userId}`
    );
    return res.data || [];
  }
);

// ================= ACCEPT =================
export const acceptRequest = createAsyncThunk(
  "chat/acceptRequest",
  async ({ fromUserId, toUserId }, { dispatch }) => {
    await axios.post("http://localhost:5000/api/friend/accept", {
      fromUserId,
      toUserId,
    });

    dispatch(fetchRequests(toUserId));
    dispatch(fetchFriends(toUserId));
  }
);

// ================= MESSAGES =================
export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async ({ userId, friendId }) => {
    const res = await axios.get(
      `http://localhost:5000/api/message/${userId}/${friendId}`
    );

    return res.data.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  }
);

// ================= SLICE =================
const chatSlice = createSlice({
  name: "chat",

  initialState: {
    friends: [],     // 🔥 ADD THIS
    requests: [],    // 🔥 ADD THIS
    messages: [],
    loading: false,
  },

  reducers: {
    addMessage: (state, action) => {
      state.messages = [...state.messages, action.payload].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    },

    clearMessages: (state) => {
      state.messages = [];
    },
  },

  extraReducers: (builder) => {
    builder
      // FRIENDS
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.friends = action.payload;
      })

      // REQUESTS
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.requests = action.payload;
      })

      // MESSAGES
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      });
  },
});

export const { addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;