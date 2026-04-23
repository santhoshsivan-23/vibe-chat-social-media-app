import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaHome, FaSearch, FaHistory, FaPlus } from "react-icons/fa";
import { BsChatFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { LuListTodo } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import axios from "axios";

export default function Sidebar() {
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [showMobileMore, setShowMobileMore] = useState(false);

  const userId = localStorage.getItem("userId");

  const createPost = async () => {
    if (!image && !text) return;

    const formData = new FormData();
    formData.append("image", image);
    formData.append("text", text);
    formData.append("userId", userId);

    await axios.post("http://localhost:5000/api/post", formData);

    setShowPopup(false);
    setImage(null);
    setText("");
  };

  const menuItems = [
    { icon: <FaHome />, path: "/dashboard/home" },
    { icon: <FaSearch />, path: "/dashboard/search" },
    { icon: <BsChatFill />, path: "/dashboard/chat" },
    { icon: <FaHistory />, path: "/dashboard/story" },
    { icon: <LuListTodo />, path: "/dashboard/todo" },

    { icon: <FaPlus />, action: () => setShowPopup(true) },

    { icon: <IoMdSettings />, path: "/dashboard/settings" },
    { icon: <CgProfile />, path: "/dashboard/profile" },
  ];

  return (
    <>
      <div className="sidebar">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="sidebar-item"
            onClick={() =>
              item.path ? navigate(item.path) : item.action()
            }
          >
            <span className="icon">{item.icon}</span>
          </div>
        ))}
      </div>

      {/* ===== MOBILE BOTTOM NAV (visible below 425px via CSS) ===== */}
      <nav className="mobile-bottom-nav">
        <div className="mobile-nav-item" onClick={() => navigate("/dashboard/home")}>
          <FaHome />
          <span>Home</span>
        </div>
        <div className="mobile-nav-item" onClick={() => navigate("/dashboard/search")}>
          <FaSearch />
          <span>Search</span>
        </div>
        <div className="mobile-nav-item" onClick={() => navigate("/dashboard/chat")}>
          <BsChatFill />
          <span>Chat</span>
        </div>
        <div className="mobile-nav-item" onClick={() => navigate("/dashboard/story")}>
          <FaHistory />
          <span>Stories</span>
        </div>
        <div className="mobile-nav-item" onClick={() => setShowMobileMore(prev => !prev)}>
          <FaPlus />
          <span>More</span>
        </div>
      </nav>

      {/* ===== MOBILE MORE POPUP ===== */}
      {showMobileMore && (
        <div className="mobile-more-overlay" onClick={() => setShowMobileMore(false)}>
          <div className="mobile-more-popup" onClick={(e) => e.stopPropagation()}>
            <div
              className="mobile-more-item"
              onClick={() => { setShowMobileMore(false); setShowPopup(true); }}
            >
              <FaPlus /> Add Post
            </div>
            <div
              className="mobile-more-item"
              onClick={() => { navigate("/dashboard/todo"); setShowMobileMore(false); }}
            >
              <LuListTodo /> Todo
            </div>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="post-popup-overlay">
          <div className="post-popup">

            <h3>Create Post</h3>

            {image ? (
              <div className="image-preview-container">
                <img
                  src={URL.createObjectURL(image)}
                  className="image-preview"
                  alt="preview"
                />
                <button
                  className="remove-image-btn"
                  onClick={() => setImage(null)}
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="custom-file-upload">
                Choose Image
                <input
                  type="file"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
            )}

            <textarea
              placeholder="Write something..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div className="popup-actions">
              <button onClick={createPost}>Post</button>
              <button onClick={() => setShowPopup(false)}>Cancel</button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}