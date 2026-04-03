import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Folder, Upload, Settings, LogOut } from "lucide-react";
import "./TeamMemberLayout.css";

export default function TeamMemberLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const fullName = localStorage.getItem("full_name") || "User";
  const firstLetter = fullName.charAt(0).toUpperCase();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="tm-page">
      <header className="tm-topbar">
        <div className="tm-topbar-left">
          <div className="tm-logo-box">
            <img
              src="/cvision-logo.png"
              alt="CVision Logo"
              className="tm-logo"
            />
          </div>

          <div className="tm-brand-text">
            <h2>CVision</h2>
            <p>Team Member Dashboard</p>
          </div>
        </div>

        <div className="tm-topbar-right">
          <div className="tm-user-info">
            <h4>{fullName}</h4>
            <p>Dashboard</p>
          </div>

          <div className="tm-avatar">{firstLetter}</div>

          <button
            className="tm-logout-btn"
            title="Logout"
            onClick={handleLogout}
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="tm-tabs-wrapper">
        <div className="tm-tabs">
          <button
            className={`tm-tab ${
              location.pathname === "/team-member/my-project" ? "active" : ""
            }`}
            onClick={() => navigate("/team-member/my-project")}
          >
            <Folder size={16} />
            <span>My Project</span>
          </button>

          <button
            className={`tm-tab ${
              location.pathname === "/team-member/upload-cv" ? "active" : ""
            }`}
            onClick={() => navigate("/team-member/upload-cv")}
          >
            <Upload size={16} />
            <span>Upload CV</span>
          </button>

          <button
            className={`tm-tab ${
              location.pathname === "/team-member/my-skills" ? "active" : ""
            }`}
            onClick={() => navigate("/team-member/my-skills")}
          >
            <Settings size={16} />
            <span>My Skills</span>
          </button>
        </div>
      </div>

      <div className="tm-content">
        <Outlet />
      </div>
    </div>
  );
}