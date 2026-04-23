import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// FETCH USER PROFILE
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (userId) => {
    const res = await axios.get(
      `http://localhost:5000/api/profile/${userId}`
    );
    return res.data;
  }
);

// LIKE POST
export const likeUserPost = createAsyncThunk(
  "user/likeUserPost",
  async ({ postId, userId, profileId }) => {
    await axios.post("http://localhost:5000/api/post/like", {
      postId,
      userId,
    });

    // refetch profile
    const res = await axios.get(
      `http://localhost:5000/api/profile/${profileId}`
    );
    return res.data;
  }
);

// COMMENT
export const commentUserPost = createAsyncThunk(
  "user/commentUserPost",
  async ({ postId, userId, text, profileId }) => {
    await axios.post("http://localhost:5000/api/post/comment", {
      postId,
      userId,
      text,
    });

    const res = await axios.get(
      `http://localhost:5000/api/profile/${profileId}`
    );
    return res.data;
  }
);

// FRIEND REQUEST
export const sendFriendRequest = createAsyncThunk(
  "user/sendFriendRequest",
  async ({ fromUserId, toUserId }) => {
    await axios.post("http://localhost:5000/api/friend/request", {
      fromUserId,
      toUserId,
    });
  }
);

const userSlice = createSlice({
  name: "user",

  initialState: {
    user: null,
    posts: [],
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.posts = action.payload.posts;
      })
      .addCase(likeUserPost.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.posts = action.payload.posts;
      })
      .addCase(commentUserPost.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.posts = action.payload.posts;
      });
  },
});

export default userSlice.reducer;