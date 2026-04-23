import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  likeUserPost,
  commentUserPost,
  sendFriendRequest,
} from "../../slice/userSlice";
import { useParams } from "react-router-dom";
import "./Search.css";

export default function UserProfile() {
  const { userId } = useParams();
  const dispatch = useDispatch();

  const currentUserId = localStorage.getItem("userId");

  const user = useSelector((state) => state.user.user);
  const posts = useSelector((state) => state.user.posts);

  const [commentText, setCommentText] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🔥 FETCH
  useEffect(() => {
    dispatch(fetchUserProfile(userId));
  }, [dispatch, userId]);

  // 🔥 ACTIONS
  const handleLike = (postId) => {
    dispatch(
      likeUserPost({
        postId,
        userId: currentUserId,
        profileId: userId,
      })
    );
  };

  const handleComment = (postId) => {
    if (!commentText.trim()) return;

    dispatch(
      commentUserPost({
        postId,
        userId: currentUserId,
        text: commentText,
        profileId: userId,
      })
    );

    setCommentText("");
  };

  const sendRequest = () => {
    dispatch(
      sendFriendRequest({
        fromUserId: currentUserId,
        toUserId: userId,
      })
    );
    alert("Request sent ✅");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-container">

      <h2 className="profile-name">{user.name}</h2>

      <div className="profile-header-row">
        <img
          src={
            user.profileImage
              ? `http://localhost:5000/${user.profileImage}`
              : "https://via.placeholder.com/150"
          }
          alt=""
          className="profile-image"
        />

        <div className="profile-right">
          <p>@{user.userId}</p>
          <p>{user.description}</p>

          <button onClick={sendRequest}>
            ➕ Add Friend
          </button>
        </div>
      </div>

      {/* POSTS */}
      <div className="profile-posts">
        {posts.length === 0 ? (
          <p>No posts yet 😢</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">

              {post.image && (
                <img
                  src={`http://localhost:5000/${post.image}`}
                  alt=""
                  className="post-image"
                />
              )}

              <p>{post.text}</p>

              <button onClick={() => handleLike(post._id)}>
                ❤️ {post.likes?.length || 0}
              </button>

              <button
                onClick={() => {
                  setSelectedPost(post);
                  setShowModal(true);
                }}
              >
                💬 Comments
              </button>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {showModal && selectedPost && (
        <div onClick={() => setShowModal(false)} className="modal-overlay">
          <div onClick={(e) => e.stopPropagation()} className="modal-content">

            <img
              src={`http://localhost:5000/${selectedPost.image}`}
              alt=""
            />

            <p>{selectedPost.text}</p>

            <div onClick={() => handleLike(selectedPost._id)}>
              ❤️ {selectedPost.likes?.length || 0}
            </div>

            {selectedPost.comments?.map((c, i) => (
              <p key={i}>
                <b>{c.userId}</b>: {c.text}
              </p>
            ))}

            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />

            <button onClick={() => handleComment(selectedPost._id)}>
              Send
            </button>

          </div>
        </div>
      )}
    </div>
  );
}