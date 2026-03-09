import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./myProject.css";
import { LogOut } from "lucide-react";
import { getMyProjects } from "./myProject.service";

export default function MyProject() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    navigate("/login");
  };

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError("");

        const data = await getMyProjects();

        if (Array.isArray(data)) {
          setProjects(data);
        } else if (Array.isArray(data.projects)) {
          setProjects(data.projects);
        } else {
          setProjects([]);
        }
      } catch (err) {
        setError(err?.message || "Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

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
            <h4>Team Member</h4>
            <p>Dashboard</p>
          </div>

          <div className="tm-avatar">T</div>

          <button
            className="tm-logout-btn"
            title="Logout"
            onClick={handleLogout}
          >
            <LogOut size={22} />
          </button>
        </div>
      </header>

      <div className="tm-tabs-wrapper">
        <div className="tm-tabs">
          <button className="tm-tab active">📁 My Project</button>
          <button className="tm-tab">⬆ Upload CV</button>
          <button className="tm-tab">⚙ My Skills</button>
        </div>
      </div>

      <main className="tm-content">
        <h1 className="tm-title">My Project</h1>
        <p className="tm-subtitle">
          View all projects you’re part of and your role assignment
        </p>

        {loading && (
          <section className="tm-message-card">
            <p>Loading projects...</p>
          </section>
        )}

        {!loading && error && (
          <section className="tm-message-card error">
            <p>{error}</p>
          </section>
        )}

        {!loading && !error && projects.length === 0 && (
          <section className="tm-empty-card">
            <div className="tm-empty-icon">📁</div>
            <h3>No projects joined yet</h3>
            <p>
              Use the "Join Team" tab to enter a team code and join a project
            </p>
          </section>
        )}

        {!loading && !error && projects.length > 0 && (
          <section className="tm-projects-list">
            {projects.map((project) => (
              <div
                className="tm-project-card"
                key={project.id || project.project_id}
              >
                <h3>{project.project_name || project.name || "Untitled Project"}</h3>
                <p>
                  Role: {project.role_name || project.role || "Not assigned yet"}
                </p>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}