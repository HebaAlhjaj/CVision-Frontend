import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Folder, Upload, Settings, LogOut, Camera } from "lucide-react";
import "./TeamMemberLayout.css";

export default function TeamMemberLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const avatarMenuRef = useRef(null);

  const userName =
    localStorage.getItem("name") ||
    localStorage.getItem("username") ||
    localStorage.getItem("full_name") ||
    "Team Member";

  const [profilePic, setProfilePic] = useState(
    localStorage.getItem("profile_picture") || ""
  );
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target)) {
        setShowAvatarMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

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
    localStorage.removeItem("access_token");
    localStorage.removeItem("project_id");
    localStorage.removeItem("name");
    localStorage.removeItem("username");
    localStorage.removeItem("full_name");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  const tabs = [
    { label: "My Project", icon: <Folder size={16} />, path: "/team-member/my-project" },
    { label: "Upload CV", icon: <Upload size={16} />, path: "/team-member/upload-cv" },
    { label: "My Skills", icon: <Settings size={16} />, path: "/team-member/my-skills" },
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
            <p>Team Member Dashboard</p>
          </div>
        </div>

        <div className="tm-topbar-right">
          <div className="tm-user-info">
            <h4>{userName}</h4>
            <p>Team Member</p>
          </div>

          <div className="tm-avatar-wrapper" ref={avatarMenuRef}>
            <div
              className="tm-avatar"
              onClick={() => setShowAvatarMenu((p) => !p)}
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

          <button className="tm-logout-btn" title="Logout" onClick={handleLogout}>
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className="tm-tabs-wrapper">
        <div className="tm-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.path}
              className={`tm-tab ${location.pathname === tab.path ? "active" : ""}`}
              onClick={() => navigate(tab.path)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="tm-content">
        <Outlet />
      </div>
    </div>
  );
}
