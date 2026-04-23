import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "./profileSlice";

export default function ProfileHeader({ user }) {
  const dispatch = useDispatch();
  const [desc, setDesc] = useState("");

  // sync with redux user
  useEffect(() => {
    if (user) {
      setDesc(user.description || "");
    }
  }, [user]);

  const handleUpdate = () => {
    dispatch(
      updateProfile({
        userId: user.userId,
        description: desc,
      })
    );
  };

  return (
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <h2>{user.name}</h2>

      <img
        src={
          user.profileImage
            ? `http://localhost:5000/${user.profileImage.replace(/\\/g, "/")}`
            : "https://via.placeholder.com/120"
        }
        width="120"
        style={{ borderRadius: "50%" }}
        alt=""
      />

      <p>@{user.userId}</p>

      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <br />

      <button onClick={handleUpdate}>
        Update
      </button>
    </div>
  );
}