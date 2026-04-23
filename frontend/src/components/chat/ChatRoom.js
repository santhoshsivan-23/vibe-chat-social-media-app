import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { IoSend } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessages,
  addMessage,
  clearMessages,
} from "../../slice/chatSlice";
import "./Chat.css";

export default function ChatRoom() {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const dispatch = useDispatch();

  // 🔥 GET FROM REDUX
  const messages = useSelector((state) => state.chat.messages);

  const [text, setText] = useState("");

  const socketRef = useRef();
  const scrollRef = useRef();

  // ================= FETCH + SOCKET =================
  useEffect(() => {
    if (!userId || !friendId) return;

    // 🔥 clear old chat
    dispatch(clearMessages());

    // 🔥 fetch messages
    dispatch(fetchMessages({ userId, friendId }));

    // 🔥 socket setup
    socketRef.current = io("http://localhost:5000");
    socketRef.current.emit("join", userId);

    socketRef.current.on("receive_message", (msg) => {
      if (
        (msg.sender === userId && msg.receiver === friendId) ||
        (msg.sender === friendId && msg.receiver === userId)
      ) {
        // 🔥 push into Redux
        dispatch(addMessage(msg));
      }
    });

    return () => socketRef.current.disconnect();
  }, [friendId, userId, dispatch]);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= SEND MESSAGE =================
  const sendMessage = () => {
    if (!text.trim()) return;

    socketRef.current.emit("send_message", {
      sender: userId,
      receiver: friendId,
      text,
    });

    setText("");
  };

  return (
    <div className="chatroom">

      {/* HEADER */}
      <div className="chatroom-header">
        <button onClick={() => navigate("/dashboard/chat")} className="back-btn">
          ←
        </button>

        <div className="chat-user">
          <div className="chat-avatar">
            {friendId?.charAt(0).toUpperCase()}
          </div>
          <span className="chat-name">{friendId}</span>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.sender === userId
                ? "message-row right"
                : "message-row left"
            }
          >
            <div className="message-bubble">
              {msg.text && <p>{msg.text}</p>}

              {msg.postImage && (
                <img
                  src={`http://localhost:5000/${msg.postImage}`}
                  className="chat-post-image"
                  alt="shared"
                />
              )}

              {msg.postText && (
                <p className="chat-post-text">{msg.postText}</p>
              )}
            </div>
          </div>
        ))}

        <div ref={scrollRef} />
      </div>

      {/* INPUT */}
      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />

        <button onClick={sendMessage}>
          <IoSend size={18} />
        </button>
      </div>

    </div>
  );
}