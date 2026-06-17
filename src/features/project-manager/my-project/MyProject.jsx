import React, { useEffect, useState } from "react";
import "./myProject.css";
import { Share2, Pencil, Trash2, Users, Layers, Calendar } from "lucide-react";
import {
  getMyProjects,
  createProject,
  inviteToProject,
  deleteProject,
  updateProject,
} from "./myProject.service";

function formatDate(dateStr) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function MyProject() {
  const [projects, setProjects] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);

  const [openMenuId,  setOpenMenuId]  = useState(null);
  const [openShareId, setOpenShareId] = useState(null);
  const [shareLink,   setShareLink]   = useState("");
  const [copying,     setCopying]     = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    localStorage.removeItem("project_id");
    if (!token) return;
    getMyProjects(token).then((data) => setProjects(data || []));
  }, [token]);

  const handleCreate = async () => {
    try {
      const created = await createProject(
        {
          name: form.name,
          description: form.description,
          start_date: form.start_date,
          end_date: form.end_date,
        },
        token
      );
      localStorage.setItem("project_id", created.project_id);
      window.location.href = "/project-manager/project-details";
    } catch (err) {
      alert(err.message || "Failed to create project");
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(projectId, token);
      setProjects((prev) => prev.filter((p) => p.project_id !== projectId));
    } catch {
      alert("Failed to delete project");
    }
  };

  const handleUpdate = async (project) => {
    const newName = window.prompt("Update project name", project.name);
    if (!newName) return;
    try {
      await updateProject(
        project.project_id,
        {
          name: newName,
          description: project.description,
          start_date: project.start_date || "",
          end_date: project.end_date,
          status: project.status || "active",
        },
        token
      );
      setProjects((prev) =>
        prev.map((p) =>
          p.project_id === project.project_id ? { ...p, name: newName } : p
        )
      );
    } catch {
      alert("Failed to update project");
    }
  };

  const handleShare = async (projectId) => {
    try {
      const response = await inviteToProject(projectId, "", token);
      const link =
        response.invite_link ||
        response.share_link ||
        response.join_link ||
        response.invitation_link ||
        response.url ||
        "";
      if (!link) { alert("Invite link not returned from server"); return; }
      setShareLink(link);
      setOpenShareId(projectId);
      setOpenMenuId(null);
    } catch {
      alert("Failed to generate link");
    }
  };

  return (
    <div className="container">
      {/* ── Header ── */}
      <div className="header">
        <div>
          <h1>My Projects</h1>
          <p className="header-sub">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="create-btn" onClick={() => setOpenCreate(true)}>
          + Create Project
        </button>
      </div>

      {/* ── Create Modal ── */}
      {openCreate && (
        <div className="create-overlay" onClick={() => setOpenCreate(false)}>
          <div className="create-form" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Project</h2>
            <p>Fill in the project details below</p>

            <input
              className="input-pro"
              placeholder="Project Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <textarea
              className="input-pro"
              placeholder="Project Description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <div className="date-row">
              <div className="date-box">
                <label>Start Date</label>
                <input
                  type="date"
                  className="input-pro"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                />
              </div>
              <div className="date-box">
                <label>End Date</label>
                <input
                  type="date"
                  className="input-pro"
                  value={form.end_date}
                  min={form.start_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="actions">
              <button className="btn-cancel" onClick={() => setOpenCreate(false)}>
                Cancel
              </button>
              <button className="btn-create" onClick={handleCreate}>
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {projects.length === 0 && !openCreate && (
        <div className="empty-projects">
          <div className="empty-projects-icon">📁</div>
          <h3>No projects yet</h3>
          <p>Create your first project to get started</p>
        </div>
      )}

      {/* ── Projects Grid ── */}
      <div className="projects">
        {projects.map((p) => (
          <div
            key={p.project_id}
            className="card"
            onClick={() => {
              localStorage.setItem("project_id", p.project_id);
              window.location.href = "/project-manager/project-details";
            }}
          >
            {/* ── Card Header ── */}
            <div className="card-header">
              <div className="card-avatar">
                {(p.name || "P").charAt(0).toUpperCase()}
              </div>
              <div className="card-header-info">
                <h3 className="card-name">{p.name}</h3>
                <span className="active-badge">● Active</span>
              </div>
              <div className="menu" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === p.project_id ? null : p.project_id);
                  }}
                >
                  ⋮
                </button>
                {openMenuId === p.project_id && (
                  <div className="dropdown">
                    <p onClick={(e) => { e.stopPropagation(); handleShare(p.project_id); }}>
                      <Share2 size={14} /> Share
                    </p>
                    <p onClick={(e) => { e.stopPropagation(); handleUpdate(p); setOpenMenuId(null); }}>
                      <Pencil size={14} /> Rename
                    </p>
                    <p onClick={(e) => { e.stopPropagation(); handleDelete(p.project_id); setOpenMenuId(null); }}>
                      <Trash2 size={14} /> Delete
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Card Body ── */}
            {p.description && (
              <div className="card-body">
                <p className="card-desc">{p.description}</p>
              </div>
            )}

            {/* ── Stats ── */}
            <div className="card-stats">
              <div className="card-stat-item">
                <div className="card-stat-icon stat-icon-members">
                  <Users size={13} />
                </div>
                <span className="card-stat-value">{p.members_count ?? 0}</span>
                <span className="card-stat-label">Members</span>
              </div>
              <div className="card-stat-item">
                <div className="card-stat-icon stat-icon-roles">
                  <Layers size={13} />
                </div>
                <span className="card-stat-value">{p.roles_count ?? 0}</span>
                <span className="card-stat-label">Roles</span>
              </div>
              <div className="card-stat-item">
                <div className="card-stat-icon stat-icon-date">
                  <Calendar size={13} />
                </div>
                <span className="card-stat-value">{p.end_date ? formatDate(p.end_date) : "—"}</span>
                <span className="card-stat-label">Deadline</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Share Modal ── */}
      {openShareId && (
        <div
          className="share-overlay"
          onClick={() => { setOpenShareId(null); setShareLink(""); }}
        >
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Share Project</h3>
            <div className="share-input-row">
              <input readOnly value={shareLink} />
              <button
                disabled={copying || !shareLink}
                onClick={async () => {
                  try {
                    setCopying(true);
                    await navigator.clipboard.writeText(shareLink);
                    alert("Link copied ✅");
                  } catch {
                    alert("Failed ❌");
                  } finally {
                    setCopying(false);
                  }
                }}
              >
                {copying ? "Copying…" : "Copy"}
              </button>
            </div>
            <div className="share-link">
              <span>🔗 Share this link with team members to invite them</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
