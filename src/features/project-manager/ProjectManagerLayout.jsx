import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import {
  Folder,
  ClipboardList,
  Users,
  GitBranch,
  BarChart3,
  LogOut,
  Camera,
} from "lucide-react";

import "./ProjectManagerLayout.css";

export default function ProjectManagerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [selectedProjectId, setSelectedProjectId] = useState(
    localStorage.getItem("project_id")
  );

  const [userName, setUserName] = useState(
    localStorage.getItem("name") ||
      localStorage.getItem("username") ||
      localStorage.getItem("full_name") ||
      "Project Manager"
  );

  const [profilePic, setProfilePic] = useState(
    localStorage.getItem("profile_picture") || ""
  );

  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const avatarMenuRef = useRef(null);

  useEffect(() => {
    setSelectedProjectId(localStorage.getItem("project_id"));
    setUserName(
      localStorage.getItem("name") ||
        localStorage.getItem("username") ||
        localStorage.getItem("full_name") ||
        "Project Manager"
    );
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target)) {
        setShowAvatarMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAvatarClick = () => {
    setShowAvatarMenu((prev) => !prev);
  };

  const handleUploadPhoto = () => {
    fileInputRef.current?.click();
    setShowAvatarMenu(false);
  };

  const handleRemovePhoto = () => {
    localStorage.removeItem("profile_picture");
    setProfilePic("");
    setShowAvatarMenu(false);
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      localStorage.setItem("profile_picture", base64);
      setProfilePic(base64);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("project_id");
    localStorage.removeItem("name");
    localStorage.removeItem("username");
    localStorage.removeItem("full_name");
    localStorage.removeItem("email");
    navigate("/login");
  };

  function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

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
            <img src="/cvision-logo.png" alt="CVision Logo" className="tm-logo" />
          </div>
          <div className="tm-brand-text">
            <h2>CVision</h2>
            <p>Project Manager Dashboard</p>
          </div>
        </div>

        <div className="tm-topbar-right">
          <div className="tm-user-info">
            <h4>{userName}</h4>
            <p>Project Manager</p>
          </div>

          <div className="tm-avatar-wrapper" ref={avatarMenuRef}>
            <div
              className="tm-avatar"
              onClick={handleAvatarClick}
              title="Click to manage photo"
            >
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="tm-avatar-img" />
              ) : (
                getInitials(userName)
              )}
              <div className="tm-avatar-overlay">
                <Camera size={14} />
              </div>
            </div>

            {showAvatarMenu && (
              <div className="tm-avatar-menu">
                <button onClick={handleUploadPhoto}>
                  <Camera size={14} />
                  {profilePic ? "Change Photo" : "Upload Photo"}
                </button>
                {profilePic && (
                  <button className="remove-photo" onClick={handleRemovePhoto}>
                    Remove Photo
                  </button>
                )}
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handlePicChange}
          />

          <button className="tm-logout-btn" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
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
                  item.label !== "Project" && !selectedProjectId ? "disabled" : ""
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
