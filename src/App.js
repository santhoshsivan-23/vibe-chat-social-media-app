import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import UserProfile from "./components/search/UserProfile";
import Register from "./components/Register";
import Friends from "./components/chat/FriendsList";
import ChatRoom from "./components/chat/ChatRoom";
import { ThemeProvider } from "./context/ThemeContext";
function App() {
  return (
    <ThemeProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="user/:userId" element={<UserProfile />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/chat/:friendId" element={<ChatRoom />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;