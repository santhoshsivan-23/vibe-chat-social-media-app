import "./Profile.css";

export default function StoryCard({ story, deleteStory }) {
  const mediaUrl = `http://localhost:5000/${story.image}`;

  return (
    <div className="story-card-container">
      {story.type === "video" ? (
        <video
          className="story-card-image"
          src={mediaUrl}
          alt="story"
          controls
        />
      ) : (
        <img
          className="story-card-image"
          src={mediaUrl}
          alt="story"
        />
      )}

      <button
        className="story-card-delete-btn"
        onClick={() => deleteStory(story._id)}
      >
        ❌ Delete
      </button>
    </div>
  );
}