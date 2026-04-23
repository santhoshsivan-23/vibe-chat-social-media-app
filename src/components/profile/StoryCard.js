import "./Profile.css";

export default function StoryCard({ story, deleteStory }) {
  return (
    <div className="story-card-container">
      <img
        className="story-card-image"
        src={`http://localhost:5000/${story.image}`}
        alt="story"
      />

      <button
        className="story-card-delete-btn"
        onClick={() => deleteStory(story._id)}
      >
        ❌ Delete
      </button>
    </div>
  );
}