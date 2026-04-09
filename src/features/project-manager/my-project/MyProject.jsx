import { useEffect, useState } from "react";
import "./myProject.css";
import { getMyProjects } from "./myProject.service";

export default function MyProject() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProjects() {
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
        setError(err?.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  function formatDate(dateString) {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString();
  }

  return (
    <div className="my-project-page">
      <div className="page-header">
        <div>
          <h1>My Project</h1>
          <p>View all projects you're part of and your role assignment</p>
        </div>
      </div>

      {loading && <p>Loading projects...</p>}
      {!loading && error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <div className="projects-grid">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div className="project-card" key={project.project_id}>
                <div className="project-card-top">
                  <div className="project-folder">📁</div>
                  <span className={`status-badge ${project.status || "active"}`}>
                    {project.status || "active"}
                  </span>
                </div>

                <h3 className="project-title">{project.name}</h3>
                <p className="project-description">
                  {project.description || "No description available"}
                </p>

                <div className="project-meta">
                  <div className="meta-row">
                    <span className="meta-label">Members</span>
                    <span className="meta-value">
                      {project.members_count ?? 0} members
                    </span>
                  </div>

                  <div className="meta-row">
                    <span className="meta-label">Roles</span>
                    <span className="meta-value">
                      {project.roles_count ?? 0} roles defined
                    </span>
                  </div>

                  <div className="meta-row">
                    <span className="meta-label">Deadline</span>
                    <span className="meta-value">
                      {formatDate(project.end_date)}
                    </span>
                  </div>
                </div>

                <div className="roles-section">
                  <div className="roles-title">Project Roles</div>
                  <div className="roles-list">
                    {Array.isArray(project.roles) && project.roles.length > 0 ? (
                      project.roles.map((role, index) => (
                        <span className="role-chip" key={index}>
                          {role}
                        </span>
                      ))
                    ) : (
                      <span className="no-roles">No roles defined</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📁</div>
              <h3>No project joined yet</h3>
              <p>Use the team invitation or join link to access a project.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}