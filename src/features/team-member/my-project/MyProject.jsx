import { useEffect, useState } from "react";
import "./myProject.css";
import { getMyProjects } from "./myProject.service";

export default function MyProject() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError("");

        const data = await getMyProjects();

        if (Array.isArray(data)) {
          setProjects(data);
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
    <main className="tm-content">
      <h1 className="tm-title">My Project</h1>
      <p className="tm-subtitle">
        View all projects you&apos;re part of and your role assignment
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
          <p>You are not assigned to any project yet.</p>
        </section>
      )}

      {!loading && !error && projects.length > 0 && (
        <section className="tm-projects-list">
          {projects.map((project) => (
            <div className="tm-project-card" key={project.project_id}>
              <h3>{project.project_name}</h3>
              <p>Role: {project.role_name}</p>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}