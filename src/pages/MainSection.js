import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../components/home/Home";
import Search from "../components/search/Search";
import Chat from "../components/chat/Chat";
import Story from "../components/story/Story";
import Todo from "../components/todo/Todo";
import Settings from "../components/settings/Settings";
import UserProfile from "../components/search/UserProfile";
import Profile from "../components/profile/Profile";

export default function MainSection() {
  return (
    <div className="main">
      <Routes>
        <Route path="/" element={<Navigate to="home" />} />
        <Route path="home" element={<Home />} />
        <Route path="search" element={<Search />} />

        {/* ✅ FIXED (important) */}
        <Route path="chat/*" element={<Chat />} />

        <Route path="story" element={<Story />} />
        <Route path="todo" element={<Todo />} />
        <Route path="settings" element={<Settings />} />
        <Route path="user/:userId" element={<UserProfile />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </div>
  );
}