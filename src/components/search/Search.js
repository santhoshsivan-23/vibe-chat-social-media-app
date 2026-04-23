import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers, clearUsers } from "../../slice/searchSlice";
import { useNavigate } from "react-router-dom";
import "./Search.css";

export default function Search() {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔥 GET FROM REDUX
  const users = useSelector((state) => state.search.users);

  const handleSearch = (value) => {
    setQuery(value);

    if (!value) {
      dispatch(clearUsers());
      return;
    }

    dispatch(searchUsers(value));
  };

  return (
    <div className="search-container">
      <h2 className="search-title">Search Users</h2>

      <input
        type="text"
        placeholder="Search by name or userId..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="search-input"
      />

      <div className="search-results">

        {users.length === 0 && query && (
          <p className="search-empty">No users found 😢</p>
        )}

        {users.map((user) => (
          <div
            key={user._id}
            className="search-card"
            onClick={() => navigate(`/dashboard/user/${user.userId}`)}
          >
            <div className="search-card-content">

              <div className="search-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="search-user-name">{user.name}</div>
                <div className="search-user-id">@{user.userId}</div>
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}