import "./Profile.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfile,
  fetchFriends,
  fetchStories,
  likePost,
  addComment,
  uploadStory,
  deleteStory
} from "../../slice/profileSlice";
import PostCard from "./PostCard";
import StoryCard from "./StoryCard";
import imageCompression from "browser-image-compression";
import { showToast } from "../../utils/toast";

const MAX_SIZE_10MB = 10 * 1024 * 1024; // 10MB
const MAX_SIZE_50MB = 50 * 1024 * 1024; // 50MB

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
  const [storyMedia, setStoryMedia] = useState(null);
  const [showStoryPopup, setShowStoryPopup] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const profileFileRef = useRef(null);

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

  const handleStoryUpload = () => {
    if (!storyMedia) return;
    dispatch(uploadStory({ userId, media: storyMedia }));
    setStoryMedia(null);
    setShowStoryPopup(false);
  };

  const handleDeleteStory = (storyId) => {
    dispatch(deleteStory(storyId));
  };

  // ================= COMPRESS MEDIA =================
  const compressMedia = async (file) => {
    const isVideo = file.type.startsWith("video/");
    const fileSize = file.size;

    // If under 10MB, no compression needed
    if (fileSize <= MAX_SIZE_10MB) {
      return file;
    }

    setIsCompressing(true);

    try {
      if (isVideo) {
        // For videos > 10MB, we can't compress in browser easily
        // Show warning and still allow upload (or could implement server-side compression)
        showToast.warning("Video is larger than 10MB. Upload may take time.");
        return file;
      } else {
        // Compress image
        const options = {
          maxSizeMB: 10,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        console.log(`Compressed from ${(fileSize / 1024 / 1024).toFixed(2)}MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
        return compressedFile;
      }
    } catch (error) {
      console.error("Compression error:", error);
      return file;
    } finally {
      setIsCompressing(false);
    }
  };

  // ================= HANDLE MEDIA SELECT =================
  const handleMediaSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileSize = file.size;

    // Check if file exceeds 50MB
    if (fileSize > MAX_SIZE_50MB) {
      showToast.error("File size exceeds 50MB limit. Please choose a smaller file.");
      e.target.value = "";
      return;
    }

    // Compress if needed
    const processedFile = await compressMedia(file);
    setStoryMedia(processedFile);
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

      showToast.success("Post shared ✅");
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
          {/* Mobile-only name above image */}
          <h2 className="profile-username profile-username-mobile">{user.name}</h2>

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
            ref={profileFileRef}
            className="profile-upload-input"
            onChange={(e) => setImage(e.target.files[0])}
          />

          {/* ⚠️ Upload API can stay here OR move to slice */}
          <button
            className="profile-upload-btn"
            onClick={() => profileFileRef.current.click()}
          >
            {image ? "✓ " + image.name.slice(0, 14) + "…" : "Change Photo"}
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
        {/* Sliding indicator */}
        <div
          className="tab-indicator"
          style={{
            transform: activeTab === "posts" ? "translateX(0%)" : "translateX(100%)"
          }}
        />

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
                <StoryCard key={story._id} story={story} deleteStory={handleDeleteStory} />
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

                  {isCompressing && <p className="compress-msg">Compressing... ⏳</p>}

                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaSelect}
                  />

                  {storyMedia && (
                    <p className="file-name">
                      {storyMedia.name.slice(0, 20)}... ({(storyMedia.size / 1024 / 1024).toFixed(2)}MB)
                    </p>
                  )}

                  <button
                    className="upload-btn"
                    onClick={handleStoryUpload}
                    disabled={!storyMedia || isCompressing}
                  >
                    {isCompressing ? "Compressing..." : "Upload"}
                  </button>

                  <button
                    className="story-cancel-btn"
                    onClick={() => {
                      setStoryMedia(null);
                      setShowStoryPopup(false);
                    }}
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