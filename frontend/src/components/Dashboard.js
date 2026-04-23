import Sidebar from "../pages/Sidebar";
import MainSection from "../pages/MainSection";
import Header from "../pages/Header";
import { useTheme } from "../context/ThemeContext";
import "./dashboard.css";

export default function Dashboard() {
  const { darkMode } = useTheme();

  return (
    <div className={darkMode ? "dark" : ""}>
      <Header />

      <div className="layout">
        <Sidebar />
        <MainSection />
      </div>
    </div>
  );
}