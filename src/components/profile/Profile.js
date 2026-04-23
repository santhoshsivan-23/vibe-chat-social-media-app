import "./Profile.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfile,
  fetchFriends,
  fetchStories,
  likePost,
  addComment
} from "../../slice/profileSlice";
import PostCard from "./PostCard";
import StoryCard from "./StoryCard";

export default function Profile() {
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();

  // 🔥 REDUX STATE
  const user = useSelector((state) => state.profile.user);
  const posts = useSelector((state) => state.profile.posts);
  const friends = useSelector((state) => state.profile.friends);
  const stories = useSelector((state) => state.profile.stories);

  // 🔥 LOCAL UI STATE
  const [desc, setDesc] = useState("");
  const [activeTab, setActiveTab] = useState("posts");
  const [image, setImage] = useState(null);
  const [storyImage, setStoryImage] = useState(null);
  const [showStoryPopup, setShowStoryPopup] = useState(false);
  const [commentText, setCommentText] = useState("");

  // ================= FETCH =================
  useEffect(() => {
    if (userId) {
      dispatch(fetchProfile(userId));
      dispatch(fetchFriends(userId));
      dispatch(fetchStories(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      setDesc(user.description || "");
    }
  }, [user]);

  // ================= ACTIONS =================
  const handleLike = (postId) => {
    dispatch(likePost({ postId, userId }));
  };

  const handleComment = (postId) => {
    if (!commentText.trim()) return;

    dispatch(addComment({ postId, userId, text: commentText }));
    setCommentText("");
  };

  // ================= SHARE =================
  const sendPostToFriend = async (post, friendId) => {
    try {
      await fetch("http://localhost:5000/api/message/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: userId,
          receiver: friendId,
          text: "",
          postImage: post.image,
          postText: post.text
        })
      });

      alert("Post shared ✅");
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-page">

      {/* ===== TOP SECTION ===== */}
      <div className="profile-top-section">

        <div className="profile-image-section">
          <img
            src={
              user.profileImage
                ? `http://localhost:5000/${user.profileImage}`
                : "https://via.placeholder.com/150"
            }
            className="profile-image"
            alt=""
          />

          <input
            type="file"
            className="profile-upload-input"
            onChange={(e) => setImage(e.target.files[0])}
          />

          {/* ⚠️ Upload API can stay here OR move to slice */}
          <button className="profile-upload-btn">
            Upload
          </button>
        </div>

        <div className="profile-info-section">
          <h2 className="profile-username">{user.name}</h2>
          <p className="profile-userid">@{user.userId}</p>

          <textarea
            className="profile-description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          {/* ⚠️ Update profile API optional to move to slice */}
          <button className="profile-save-btn">
            Save
          </button>
        </div>
      </div>

      {/* ===== TABS ===== */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === "posts" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </button>

        <button
          className={`tab-btn ${activeTab === "stories" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("stories")}
        >
          Stories
        </button>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="profile-content">

        {/* ===== POSTS ===== */}
        {activeTab === "posts" && (
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                handleLike={handleLike}
                handleComment={handleComment}
                commentText={commentText}
                setCommentText={setCommentText}
                friends={friends}
                sendPostToFriend={sendPostToFriend}
              />
            ))}
          </div>
        )}

        {/* ===== STORIES ===== */}
        {activeTab === "stories" && (
          <>
            <div className="create-story-section">
              <button
                className="upload-btn"
                onClick={() => setShowStoryPopup(true)}
              >
                + Add Story
              </button>
            </div>

            <div className="stories-grid">
              {stories.map((story) => (
                <StoryCard key={story._id} story={story} />
              ))}
            </div>

            {/* POPUP */}
            {showStoryPopup && (
              <div
                className="story-upload-overlay"
                onClick={() => setShowStoryPopup(false)}
              >
                <div
                  className="story-upload-popup"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3>Add Story</h3>

                  <input
                    type="file"
                    onChange={(e) => setStoryImage(e.target.files[0])}
                  />

                  <button className="upload-btn">
                    Upload
                  </button>

                  <button
                    className="story-cancel-btn"
                    onClick={() => setShowStoryPopup(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}