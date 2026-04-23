import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import vibechatLogo from "../assets/images/VC.png";
import vibechatLogoWhite from "../assets/images/VC-White.png";
import { useTheme } from "../context/ThemeContext";
export default function Header() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    userId: ""
  });

  useEffect(() => {
    const name = localStorage.getItem("name");
    const userId = localStorage.getItem("userId");

    if (name && userId) {
      setUser({ name, userId });
    }
  }, []);

return (
<header className="header">
  <div className="header-inner">

    <div className="header-left">
      <img src={darkMode ? vibechatLogo : vibechatLogoWhite} className="header-logo" alt="VibeChat" />
      <h2 className="logo">VibeChat</h2>
    </div>

    <div className="userSection" onClick={() => navigate("/dashboard/profile")} style={{ cursor: "pointer" }}>
      <span className="username">{user.name}</span>
      <FaUserCircle size={32} />
    </div>

  </div>
</header>
  );
}