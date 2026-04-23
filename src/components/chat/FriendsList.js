  import { useNavigate } from "react-router-dom";
  import { FaUserFriends, FaUserCircle } from "react-icons/fa";
  import { IoSearch } from "react-icons/io5";
  import "./Chat.css";

  export default function FriendsList({ friends = [] }) {
    const navigate = useNavigate();

    return (
      <div className="friends-container">


        {/* SEARCH */}
        <div className="friends-search">
          <IoSearch className="search-icon" />
          <input placeholder="Search chats..." />
        </div>

        {/* LIST */}
        <div className="friends-list">
          {friends.length === 0 ? (
            <p className="friends-empty">No friends yet</p>
          ) : (
            friends.map((f) => (
              <div
                key={f.userId}
                className="friend-item"
                onClick={() => navigate(`/dashboard/chat/${f.userId}`)}
              >
                {/* AVATAR */}
                {f.profileImage ? (
                  <img
                    src={`http://localhost:5000/${f.profileImage}`}
                    className="friend-avatar"
                    alt=""
                  />
                ) : (
                  <FaUserCircle className="friend-avatar-icon" />
                )}

                {/* INFO */}
                <div className="friend-details">
                  <span className="friend-name">{f.name}</span>
                  <span className="friend-sub">Tap to chat</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    );
  }