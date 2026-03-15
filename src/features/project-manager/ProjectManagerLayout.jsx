import { Outlet, useNavigate, useLocation } from "react-router-dom";
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
            <h4>Project Manager</h4>
            <p>Dashboard</p>
          </div>

          <div className="tm-avatar">P</div>

          <button
            className="tm-logout-btn"
            onClick={() => navigate("/login")}
          >
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
                className={`tm-tab ${isActive ? "active" : ""}`}
                onClick={() => navigate(item.path)}
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