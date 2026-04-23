import "./Profile.css";
import { FaHeart, FaComment, FaShare } from "react-icons/fa";
import { useState } from "react";

export default function PostCard({
  post,
  handleLike,
  handleComment,
  commentText,
  setCommentText,
  friends = [],
  sendPostToFriend
}) {
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <>
      {/* ===== POST CARD ===== */}
      <div className="post-card-container">
        <img
          className="post-card-image"
          src={`http://localhost:5000/${post.image}`}
          alt="post"
        />

        <p className="post-card-text">{post.text}</p>

        {/* ACTION BUTTONS */}
        <div className="post-actions">
          <button onClick={() => handleLike(post._id)}>
            <FaHeart /> {post.likes?.length || 0}
          </button>

          <button onClick={() => setShowComments(true)}>
            <FaComment /> {post.comments?.length || 0}
          </button>

          <button onClick={() => setShowShare(true)}>
            <FaShare />
          </button>
        </div>
      </div>

      {/* ===== COMMENT POPUP ===== */}
      {showComments && (
        <div className="popup-overlay">
          <div className="comment-popup">

            {/* LEFT IMAGE */}
            <div className="popup-left">
              <img
                src={`http://localhost:5000/${post.image}`}
                alt="post"
              />
            </div>

            {/* RIGHT COMMENTS */}
            <div className="popup-right">
              <h3>Comments</h3>

              <div className="comments-list">
                {post.comments.length === 0 ? (
                  <p>No comments yet 😢</p>
                ) : (
                  post.comments.map((c, i) => (
                    <div key={i} className="comment-item">
                      <b>{c.userId}</b>: {c.text || "..." }
                    </div>
                  ))
                )}
              </div>

              <div className="comment-input-box">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                />
                <button onClick={() => handleComment(post._id)}>
                  Send
                </button>
              </div>

              <button
                className="close-btn"
                onClick={() => setShowComments(false)}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== SHARE POPUP ===== */}
      {showShare && (
        <div className="popup-overlay">
          <div className="share-popup">

            <h3>Send to Friends</h3>

            {/* SEARCH */}
            <input
              className="friend-search"
              placeholder="Search friends..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* FRIEND LIST */}
            <div className="friends-list">

              {friends.length === 0 ? (
                <p className="no-friends">No friends found 😢</p>
              ) : (
                friends
                  .filter((f) =>
                    f.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((f, i) => (
                    <div key={i} className="friend-item">

                      <div className="friend-info">
                        <div className="friend-avatar">
                          {f.name?.charAt(0).toUpperCase()}
                        </div>

                        <span className="friend-name">{f.name}</span>
                      </div>

                      <button
                        className="send-btn"
                        onClick={() => sendPostToFriend(post, f.userId)}
                      >
                        Send
                      </button>
                    </div>
                  ))
              )}

            </div>

            <button
              className="close-btn"
              onClick={() => setShowShare(false)}
            >
              ✕
            </button>

          </div>
        </div>
      )}
    </>
  );
}