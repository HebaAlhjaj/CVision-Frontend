import { useEffect, useState } from "react";
import "./myProject.css";
import { getMyProjects } from "./myProject.service";

export default function MyProject() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openJoin, setOpenJoin] = useState(false);
  const [joinLink, setJoinLink] = useState("");

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

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleJoinByLink = async () => {
    try {
      const url = new URL(joinLink);
      const inviteToken = url.searchParams.get("token");
      const authToken = localStorage.getItem("token");

      if (!inviteToken) {
        alert("Invite token is missing");
        return;
      }

      const res = await fetch("http://127.0.0.1:8000/projects/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          token: inviteToken,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.detail || "Failed to join project");
      }

      alert("Joined successfully ✅");

      setOpenJoin(false);
      setJoinLink("");
      fetchProjects();
    } catch (err) {
      console.log(err);
      alert(err?.message || "Invalid link");
    }
  };

  return (
    <main className="tm-content">
      <div className="tm-header-row">
        <div>
          <h1 className="tm-title">My Project</h1>
          <p className="tm-subtitle">
            View all projects you&apos;re part of and your role assignment
          </p>
        </div>

        <button className="join-btn" onClick={() => setOpenJoin(true)}>
          + Join Project
        </button>
      </div>

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
          <p>Use the “Join Project” button to enter a team code and join a project</p>
        </section>
      )}

      {!loading && !error && projects.length > 0 && (
        <section className="tm-projects-list">
          {projects.map((project) => (
            <div className="tm-project-card" key={project.project_id}>
              <div className="project-card-top">
                <div className="project-folder-icon">📁</div>
                <span className="project-status">Active</span>
              </div>

              <h3 className="project-title">
                {project.project_name || project.name}
              </h3>

              <p className="project-desc">
                {project.description ||
                  "Building a modern e-commerce platform with React and Node.js"}
              </p>

              <div className="project-info-box role-box">
                <div className="role-title-row">
                  <span className="role-icon">♟</span>
                  <strong>My Role</strong>
                </div>

                {project.role_name && (
                  <div className="role-desc-row">
                    <span className="info-icon">ⓘ</span>
                    <span>{project.role_name}</span>
                  </div>
                )}
              </div>

              <div className="cv-status-row">
                <span>CV Status :</span>
                <b>{project.cv_status || "Not Uploaded"}</b>
              </div>

              <div className="project-info-box members-box">
                <div className="members-row">
                  <span>▣</span>
                  <strong>{project.team_members_count || 1} Team Member</strong>
                </div>

                <div className="members-row">
                  <span>♟</span>
                  <strong>Started {project.start_date || "15/1/2025"}</strong>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {openJoin && (
        <div className="join-overlay" onClick={() => setOpenJoin(false)}>
          <div className="join-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Join Project</h3>

            <div className="join-row">
              <input
                placeholder="Paste your link here"
                value={joinLink}
                onChange={(e) => setJoinLink(e.target.value)}
              />

              <button onClick={handleJoinByLink}>Paste Link</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}