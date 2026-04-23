import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔥 FETCH POSTS
export const fetchPosts = createAsyncThunk(
  "post/fetchPosts",
  async (userId) => {
    const res = await axios.get(
      `http://localhost:5000/api/feed/${userId}?limit=6`
    );
    return res.data || [];
  }
);

// 🔥 ADD COMMENT
export const addComment = createAsyncThunk(
  "post/addComment",
  async ({ postId, userId, text }) => {
    const res = await axios.post(
      "http://localhost:5000/api/post/comment",
      { postId, userId, text }
    );

    return {
      postId,
      comment: { userId, text }, // UI update
    };
  }
);

// 🔥 LIKE POST
export const likePost = createAsyncThunk(
  "post/likePost",
  async ({ postId, userId }) => {
    const res = await axios.post(
      "http://localhost:5000/api/post/like",
      { postId, userId }
    );

    return res.data; // updated post
  }
);

const postSlice = createSlice({
  name: "post",

  initialState: {
    posts: [],
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = [...state.posts, ...action.payload];
      })

      // LIKE
      .addCase(likePost.fulfilled, (state, action) => {
        state.posts = state.posts.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      });
  },
});

export default postSlice.reducer;