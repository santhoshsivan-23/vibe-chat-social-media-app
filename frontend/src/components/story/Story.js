import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStories } from "../../slice/storySlice";
import "./Story.css";
import { FaUserCircle } from "react-icons/fa";

export default function Story() {
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();

  // 🔥 FROM REDUX
  const groupedStories = useSelector(
    (state) => state.story.groupedStories
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  // 🔥 FETCH
  useEffect(() => {
    dispatch(fetchStories(userId));
  }, [dispatch, userId]);

  // AUTO NEXT
  useEffect(() => {
    if (!activeUser || paused) return;

    const timer = setTimeout(() => {
      const userStories = groupedStories[activeUser];

      if (currentIndex < userStories.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setActiveUser(null);
      }
    }, 6000);

    return () => clearTimeout(timer);
  }, [currentIndex, activeUser, paused, groupedStories]);

  const nextStory = () => {
    const userStories = groupedStories[activeUser];
    if (currentIndex < userStories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setActiveUser(null);
    }
  };

  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <>
      {/* USERS */}
      <div className="story-users">
        {Object.keys(groupedStories).length === 0 && (
          <p className="no-story">No stories from friends</p>
        )}

        {Object.keys(groupedStories).map((user) => {
          const firstStory = groupedStories[user][0];

          return (
            <div
              key={user}
              className="story-card"
              onClick={() => {
                setActiveUser(user);
                setCurrentIndex(0);
              }}
            >
              <img
                className="story-bg"
                src={`http://localhost:5000/${firstStory.image}`}
                alt=""
              />

              <div className="story-user-info">
                {firstStory.profileImage ? (
                  <img
                    className="story-profile-img"
                    src={`http://localhost:5000/${firstStory.profileImage}`}
                    alt=""
                  />
                ) : (
                  <FaUserCircle className="story-profile-icon" />
                )}
              </div>

              <div className="story-username">{user}</div>
            </div>
          );
        })}
      </div>

      {/* POPUP */}
      {activeUser && (
        <div
          className="story-popup-overlay"
          onClick={() => setActiveUser(null)}
        >
          <div
            className="story-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="story-popup-header">
              <h4>{activeUser}</h4>
              <button onClick={() => setActiveUser(null)}>✖</button>
            </div>

            <div className="story-popup-images">

              <div className="click-left" onClick={prevStory} />
              <div
                className="click-center"
                onClick={() => setPaused(!paused)}
              />
              <div className="click-right" onClick={nextStory} />

              <img
                src={`http://localhost:5000/${
                  groupedStories[activeUser][currentIndex].image
                }`}
                alt=""
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}