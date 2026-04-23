import { useEffect, useState } from "react";
import FriendsList from "./FriendsList";
import ChatRoom from "./ChatRoom";
import { Routes, Route, useLocation } from "react-router-dom";
import { IoChatbox } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFriends,
  fetchRequests,
  acceptRequest
} from "../../slice/chatSlice";
import "./Chat.css";

export default function Chat() {
  const userId = localStorage.getItem("userId");
  const location = useLocation();
  const dispatch = useDispatch();

  const [showMobileRequests, setShowMobileRequests] = useState(false);

  // GET DATA FROM REDUX
  const friends = useSelector((state) => state.chat.friends);
  const requests = useSelector((state) => state.chat.requests);

  const isInChatRoom = /\/dashboard\/chat\/.+/.test(location.pathname);

  useEffect(() => {
    if (isInChatRoom) setShowMobileRequests(false);
  }, [isInChatRoom]);

  // FETCH DATA FROM REDUX
  useEffect(() => {
    if (userId) {
      dispatch(fetchFriends(userId));
      dispatch(fetchRequests(userId));
    }
  }, [dispatch, userId]);

  // ACCEPT REQUEST
  const handleAccept = (fromUserId) => {
    dispatch(acceptRequest({ fromUserId, toUserId: userId }));
  };

  return (
    <div
      className={`chat-layout${
        isInChatRoom ? " chatroom-active" : ""
      }${showMobileRequests ? " show-requests" : ""}`}
    >
      {/* LEFT SIDEBAR */}
      <div className="chat-left">
        <div className="chat-header">
          <IoChatbox className="chat-icon" />
          <span>Chats</span>
        </div>

        {/* Mobile Friend Requests Button */}
        <div
          className="mobile-req-btn"
          onClick={() => setShowMobileRequests(true)}
        >
          <FaUserPlus className="mobile-req-icon" />
          <span>Friend Requests</span>
          {requests.length > 0 && (
            <span className="req-badge">{requests.length}</span>
          )}
        </div>

        {/* FRIENDS LIST */}
        <FriendsList friends={friends} />
      </div>

      {/* MOBILE REQUEST PANEL */}
      <div className="mobile-req-panel">
        <div className="mobile-req-header">
          <button
            className="back-btn"
            onClick={() => setShowMobileRequests(false)}
          >
            ←
          </button>
          <h3>Friend Requests</h3>
        </div>

        <div className="request-list">
          {requests.length === 0 ? (
            <p className="empty-text">No requests</p>
          ) : (
            requests.map((r) => (
              <div key={r._id} className="request-card">
                <div className="request-user">
                  <div className="request-avatar">
                    {r.from.charAt(0).toUpperCase()}
                  </div>
                  <span>{r.from}</span>
                </div>

                <button
                  className="accept-btn"
                  onClick={() => handleAccept(r.from)}
                >
                  Accept
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="chat-right">
        <Routes>
          {/* FRIEND REQUESTS */}
          <Route
            path="/"
            element={
              <div className="request-section">
                <div className="request-header">
                  <h3>Friend Requests</h3>
                </div>

                <div className="request-list">
                  {requests.length === 0 ? (
                    <p className="empty-text">No requests</p>
                  ) : (
                    requests.map((r) => (
                      <div key={r._id} className="request-card">
                        <div className="request-user">
                          <div className="request-avatar">
                            {r.from.charAt(0).toUpperCase()}
                          </div>
                          <span>{r.from}</span>
                        </div>

                        <button
                          className="accept-btn"
                          onClick={() => handleAccept(r.from)}
                        >
                          Accept
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            }
          />

          {/* CHAT ROOM */}
          <Route path=":friendId" element={<ChatRoom />} />
        </Routes>
      </div>
    </div>
  );
}