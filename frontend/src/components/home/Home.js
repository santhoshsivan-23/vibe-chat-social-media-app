import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, likePost } from "../../slice/postSlice";
import PostModal from "./PostModal";
import vibechatLogo from "../../assets/images/logo.png";
import { FaHeart, FaRegHeart, FaRegComment, FaRegPaperPlane } from "react-icons/fa";
import "./Home.css";

export default function Home() {
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();

  // 🔥 GET FROM REDUX
  const posts = useSelector((state) => state.post.posts);

  const [selectedPost, setSelectedPost] = useState(null);

  // 🔥 FETCH POSTS
  useEffect(() => {
    if (userId) {
      dispatch(fetchPosts(userId));
    }
  }, [dispatch, userId]);

  // 🔥 LIKE
  const handleLike = (postId) => {
    dispatch(likePost({ postId, userId }));
  };

  return (
    <div className="home-layout">

      {/* FEED */}
      <div className="home-feed">
        <div className="home-feed-inner">

          {posts.map((post) => (
            <div key={post._id} className="post-card">

              {/* USER */}
              <div className="post-user">
                <div className="post-user-avatar">
                  {post.userId?.charAt(0).toUpperCase()}
                </div>
                {post.userId}
              </div>

              {/* IMAGE */}
              {post.image && (
                <img
                  src={`http://localhost:5000/${post.image}`}
                  className="post-img"
                  alt=""
                />
              )}

              {/* ACTIONS */}
              <div className="post-actions">
                <button
                  className={`post-action-btn${
                    post.likes?.includes(userId) ? " liked" : ""
                  }`}
                  onClick={() => handleLike(post._id)}
                >
                  {post.likes?.includes(userId) ? <FaHeart /> : <FaRegHeart />}
                  <span>{post.likes?.length || 0}</span>
                </button>

                <button
                  className="post-action-btn"
                  onClick={() => setSelectedPost(post)}
                >
                  <FaRegComment />
                  <span>{post.comments?.length || 0}</span>
                </button>

                <button className="post-action-btn">
                  <FaRegPaperPlane />
                </button>
              </div>

              {/* TEXT */}
              {post.text && <p className="post-text">{post.text}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="home-right">
        <img src={vibechatLogo} className="home-logo" alt="VibeChat" />
        <p className="home-tagline">Connect. Share. Vibe.</p>
        <p className="home-sub">
          Discover posts from people around you and stay connected with your friends.
        </p>
      </div>

      {/* MODAL */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          userId={userId}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}