import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔥 FETCH STORIES
export const fetchStories = createAsyncThunk(
  "story/fetchStories",
  async (userId) => {
    const res = await axios.get(
      `http://localhost:5000/api/stories/${userId}`
    );

    const allStories = res.data || [];

    // remove own stories
    const friendStories = allStories.filter(
      (s) => s.userId !== userId
    );

    // group by user
    const grouped = {};
    friendStories.forEach((story) => {
      if (!grouped[story.userId]) {
        grouped[story.userId] = [];
      }
      grouped[story.userId].push(story);
    });

    return grouped;
  }
);

const storySlice = createSlice({
  name: "story",

  initialState: {
    groupedStories: {},
  },

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(fetchStories.fulfilled, (state, action) => {
      state.groupedStories = action.payload;
    });
  },
});

export default storySlice.reducer;