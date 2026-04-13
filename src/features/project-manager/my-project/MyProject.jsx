import React, { useEffect, useState } from "react";
import "./myProject.css";
import {
  getMyProjects,
  createProject,
  inviteToProject,
} from "./myProject.service";

export default function MyProject() {
  const [projects, setProjects] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [openShareId, setOpenShareId] = useState(null);
  const [email, setEmail] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getMyProjects(token);
      setProjects(data || []);
    };

    if (token) fetchProjects();
  }, [token]);

  // 🔹 Create Project
  const handleCreate = async () => {
    const data = {
      name: form.name,
      description: form.description,
      start_date: form.start_date,
      end_date: form.end_date,
    };

    await createProject(data, token);

    setProjects((prev) => [
      {
        project_id: Date.now(),
        name: form.name,
        description: form.description,
        members_count: 0,
        roles_count: 0,
        end_date: form.end_date,
        status: "active",
      },
      ...prev,
    ]);

    setForm({
      name: "",
      description: "",
      start_date: "",
      end_date: "",
    });

    setOpenCreate(false);
  };

  // 🔥 Invite
  const handleInvite = async (projectId) => {
    try {
      await inviteToProject(projectId, email, token);

      alert("Invitation sent ✅");

      setEmail("");
      setOpenShareId(null);
    } catch (err) {
      console.log(err);
      alert("Error ❌");
    }
  };

  return (
    <div className="container">

      {/* Header */}
      <div className="header">
        <h1>My Projects</h1>

        <button
          className="create-btn"
          onClick={() => setOpenCreate(!openCreate)}
        >
          + Create Project
        </button>
      </div>

      {/* Create Form */}
      {openCreate && (
        <div className="create-form">
          <h2>Create New Project</h2>
          <p>Fill in the project details</p>

          <input
            className="input-pro"
            placeholder="Project Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <textarea
            className="input-pro"
            placeholder="Project Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <div className="date-row">
            <div className="date-box">
              <label>Start Date</label>
              <input
                type="date"
                className="input-pro"
                value={form.start_date}
                onChange={(e) =>
                  setForm({ ...form, start_date: e.target.value })
                }
              />
            </div>

            <div className="date-box">
              <label>End Date</label>
              <input
                type="date"
                className="input-pro"
                value={form.end_date}
                min={form.start_date}
                onChange={(e) =>
                  setForm({ ...form, end_date: e.target.value })
                }
              />
            </div>
          </div>

          <div className="actions">
            <button
              className="btn-cancel"
              onClick={() => setOpenCreate(false)}
            >
              Cancel
            </button>

            <button
              className="btn-create"
              onClick={handleCreate}
            >
              Create Project
            </button>
          </div>
        </div>
      )}

      {/* Empty */}
      {projects.length === 0 && !openCreate && (
        <p className="empty-text">No Projects Yet</p>
      )}

      {/* Projects */}
      <div className="projects">
        {projects.map((p) => (
          <div key={p.project_id} className="card">

            {/* 3 dots */}
            <div className="menu">
              <button
                onClick={() =>
                  setOpenMenuId(
                    openMenuId === p.project_id ? null : p.project_id
                  )
                }
              >
                ⋮
              </button>

              {openMenuId === p.project_id && (
                <div className="dropdown">
                  <p
                    onClick={(e) => {
                      e.stopPropagation(); // 🔥 يمنع الفليكر
                      setOpenShareId(p.project_id);
                      setOpenMenuId(null);
                    }}
                  >
                    Share
                  </p>
                </div>
              )}
            </div>

            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p>👥 {p.members_count} team members</p>
            <p>⚙️ {p.roles_count} roles defined</p>
            <p>📅 {p.end_date}</p>

          </div>
        ))}
      </div>

      {/* 🔥 Share Modal (خارج الماب) */}
      {openShareId && (
        <div
          className="share-overlay"
          onClick={() => setOpenShareId(null)}
        >
          <div
            className="share-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Share board</h3>

            <div className="share-input-row">
              <input
                placeholder="Email address or name"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button onClick={() => handleInvite(openShareId)}>
                Share
              </button>
            </div>

            <div className="share-link">
              <span>🔗 Share this board with a link</span>
              <p>Create Link</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}