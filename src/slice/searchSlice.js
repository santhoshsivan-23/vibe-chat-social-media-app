import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔥 SEARCH USERS
export const searchUsers = createAsyncThunk(
  "search/searchUsers",
  async (query) => {
    if (!query) return [];

    const res = await axios.get(
      `http://localhost:5000/api/search?query=${query}`
    );

    return res.data || [];
  }
);

const searchSlice = createSlice({
  name: "search",

  initialState: {
    users: [],
    loading: false,
  },

  reducers: {
    clearUsers: (state) => {
      state.users = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(searchUsers.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearUsers } = searchSlice.actions;
export default searchSlice.reducer;