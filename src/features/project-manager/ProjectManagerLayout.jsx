import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  Folder,
  ClipboardList,
  Users,
  GitBranch,
  BarChart3,
  LogOut,
} from "lucide-react";

import "../team-member/TeamMemberLayout.css";

export default function ProjectManagerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

const [selectedProjectId, setSelectedProjectId] = useState(
  localStorage.getItem("project_id")
);

  const [userName, setUserName] = useState(
    localStorage.getItem("name") ||
      localStorage.getItem("username") ||
      localStorage.getItem("full_name") ||
      localStorage.getItem("email") ||
      "Project Manager"
  );

  useEffect(() => {
    setSelectedProjectId(localStorage.getItem("project_id"));

    setUserName(
      localStorage.getItem("name") ||
        localStorage.getItem("username") ||
        localStorage.getItem("full_name") ||
        localStorage.getItem("email") ||
        "Project Manager"
    );
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("project_id");
    localStorage.removeItem("name");
    localStorage.removeItem("username");
    localStorage.removeItem("full_name");
    localStorage.removeItem("email");

    navigate("/login");
  };

  const menuItems = [
    {
      label: "Project",
      icon: <Folder size={18} />,
      path: "/project-manager/my-project",
    },
    {
      label: "Project Details",
      icon: <ClipboardList size={18} />,
      path: "/project-manager/project-details",
    },
    {
      label: "Team Members",
      icon: <Users size={18} />,
      path: "/project-manager/team-members",
    },
    {
      label: "Role Match",
      icon: <GitBranch size={18} />,
      path: "/project-manager/role-match",
    },
    {
      label: "Skill Gaps",
      icon: <BarChart3 size={18} />,
      path: "/project-manager/skill-gaps",
    },
  ];

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
            <p>Project Manager Dashboard</p>
          </div>
        </div>

        <div className="tm-topbar-right">
          <div className="tm-user-info">
            <h4>{userName}</h4>
            <p>Dashboard</p>
          </div>

          <div className="tm-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>

          <button className="tm-logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="tm-tabs-wrapper">
        <nav className="tm-tabs">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                disabled={item.label !== "Project" && !selectedProjectId}
                className={`tm-tab ${isActive ? "active" : ""} ${
                  item.label !== "Project" && !selectedProjectId
                    ? "disabled"
                    : ""
                }`}
                onClick={() => {
                  if (item.label !== "Project" && !selectedProjectId) return;
                  navigate(item.path);
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <main className="tm-content">
        <Outlet />
      </main>
    </div>
  );
}