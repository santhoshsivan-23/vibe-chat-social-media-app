import { configureStore } from "@reduxjs/toolkit";

import chatReducer from "./slice/chatSlice";
import postReducer from "./slice/postSlice";
import profileReducer from "./slice/profileSlice";
import searchReducer from "./slice/searchSlice";
import userReducer from "./slice/userSlice";
import storyReducer from "./slice/storySlice";
import authReducer from "./slice/authSlice";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    post: postReducer, 
    profile: profileReducer,
    search: searchReducer,
    user: userReducer,
    story: storyReducer,
    auth: authReducer,
  },
});