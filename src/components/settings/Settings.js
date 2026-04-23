import { useTheme } from "../../context/ThemeContext";
import "./Settings.css";

export default function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="settings-page">
      <h2 className="settings-title">⚙️ Settings</h2>

      <div className="settings-card">
        <div className="settings-row">
          <div className="settings-label">
            <span className="settings-label-title">Dark Mode</span>
            <span className="settings-label-sub">Switch between light and dark theme</span>
          </div>

          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>
    </div>
  );
}
