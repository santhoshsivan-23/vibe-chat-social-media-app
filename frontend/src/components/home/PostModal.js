import { useState } from "react";
import { useDispatch } from "react-redux";
import { addComment } from "../../slice/postSlice";
import "./Home.css";

export default function PostModal({ post, userId, onClose }) {
  const [text, setText] = useState("");
  const dispatch = useDispatch();

  const handleComment = () => {
    if (!text.trim()) return;

    dispatch(
      addComment({
        postId: post._id,
        userId,
        text,
      })
    );

    setText("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >

        {/* LEFT IMAGE */}
        <div className="modal-left">
          {post.image && (
            <img
              src={`http://localhost:5000/${post.image}`}
              alt=""
            />
          )}
        </div>

        {/* RIGHT COMMENTS */}
        <div className="modal-right">

          <div className="modal-header">
            <div className="modal-header-avatar">
              {post.userId?.charAt(0).toUpperCase()}
            </div>
            <span className="modal-header-name">{post.userId}</span>
          </div>

          <div className="modal-comments">
            {post.comments?.length === 0 && (
              <p style={{
                color: "#aaa",
                fontSize: "13px",
                textAlign: "center",
                marginTop: "20px"
              }}>
                No comments yet
              </p>
            )}

            {post.comments?.map((c, i) => (
              <div key={i} className="modal-comment-item">
                <div className="modal-comment-avatar">
                  {c.userId?.charAt(0).toUpperCase()}
                </div>
                <div className="modal-comment-bubble">
                  <b>{c.userId}</b> {c.text}
                </div>
              </div>
            ))}
          </div>

          <div className="modal-input">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add comment..."
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
            />
            <button onClick={handleComment}>Send</button>
          </div>

        </div>

      </div>
    </div>
  );
}