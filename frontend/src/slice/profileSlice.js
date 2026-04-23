import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ================= PROFILE =================
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (userId) => {
    const res = await axios.get(`http://localhost:5000/api/profile/${userId}`);
    return res.data;
  }
);

// ================= FRIENDS =================
export const fetchFriends = createAsyncThunk(
  "profile/fetchFriends",
  async (userId) => {
    const res = await axios.get(`http://localhost:5000/api/friends/${userId}`);
    return res.data;
  }
);

// ================= STORIES =================
export const fetchStories = createAsyncThunk(
  "profile/fetchStories",
  async (userId) => {
    const res = await axios.get(`http://localhost:5000/api/stories/${userId}`);
    return res.data.filter(s => s.userId === userId);
  }
);

// ================= LIKE =================
export const likePost = createAsyncThunk(
  "profile/likePost",
  async ({ postId, userId }) => {
    const res = await axios.post(
      "http://localhost:5000/api/post/like",
      { postId, userId }
    );
    return res.data;
  }
);

// ================= COMMENT =================
export const addComment = createAsyncThunk(
  "profile/addComment",
  async ({ postId, userId, text }) => {
    const res = await axios.post(
      "http://localhost:5000/api/post/comment",
      { postId, userId, text }
    );
    return res.data;
  }
);

// ================= SLICE =================
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: null,
    posts: [],
    friends: [],
    stories: [],
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.posts = action.payload.posts;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.friends = action.payload;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.stories = action.payload;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.posts = state.posts.map(p =>
          p._id === action.payload._id ? action.payload : p
        );
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.posts = state.posts.map(p =>
          p._id === action.payload._id ? action.payload : p
        );
      });
  },
});

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ userId, description }) => {
    const res = await axios.put(
      "http://localhost:5000/api/profile/update",
      { userId, description }
    );

    return res.data; // updated user
  }
);

export default profileSlice.reducer;