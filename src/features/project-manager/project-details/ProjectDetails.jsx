import React, { useEffect, useState } from "react";
import "./projectDetails.css";
import { Pencil, Trash2, X, Plus } from "lucide-react";
import {
  getRoles,
  createRole,
  deleteRole,
  getProject,
} from "./projectDetails.service";

export default function ProjectDetails() {
  const token     = localStorage.getItem("token");
  const projectId = localStorage.getItem("project_id");

  const [roles,   setRoles]   = useState([]);
  const [project, setProject] = useState(null);

  /* ── Add Role modal ── */
  const [openModal, setOpenModal] = useState(false);
  const [roleName,  setRoleName]  = useState("");
  const [skills,    setSkills]    = useState([{ name: "", weight: 5 }]);
  const [loading,   setLoading]   = useState(false);

  /* ── Edit Role modal ── */
  const [editModal,   setEditModal]   = useState(false);
  const [editRole,    setEditRole]    = useState(null);
  const [editName,    setEditName]    = useState("");
  const [editSkills,  setEditSkills]  = useState([]);
  const [editLoading, setEditLoading] = useState(false);

  const fetchRoles = async () => {
    if (!token) return;
    try {
      const data = await getRoles(projectId, token);
      if (Array.isArray(data)) setRoles(data);
    } catch {
      /* silently ignore */
    }
  };

  const fetchProject = async () => {
    if (!token || !projectId) return;
    try {
      const data = await getProject(projectId, token);
      setProject(data);
    } catch {
      /* silently ignore */
    }
  };

  useEffect(() => {
    fetchProject();
    fetchRoles();
  }, []);

  /* ── Add skill helpers ── */
  const addSkill = () =>
    setSkills((p) => [...p, { name: "", weight: 5 }]);

  const updateSkill = (i, field, value) =>
    setSkills((p) => p.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));

  const removeSkill = (i) =>
    setSkills((p) => p.filter((_, idx) => idx !== i));

  const handleCreateRole = async () => {
    const clean = skills
      .filter((s) => s.name.trim())
      .map((s) => ({ name: s.name.trim(), weight: Number(s.weight) }));

    if (!roleName.trim() || clean.length === 0) {
      alert("Please enter a role name and at least one skill.");
      return;
    }

    try {
      setLoading(true);
      await createRole(projectId, { name: roleName.trim(), skills: clean }, token);
      await fetchRoles();
      setRoleName("");
      setSkills([{ name: "", weight: 5 }]);
      setOpenModal(false);
    } catch (err) {
      alert(err.message || "Failed to create role");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (roleId) => {
    const ok = window.confirm("Delete this role?");
    if (!ok) return;
    try {
      await deleteRole(roleId, token);
      await fetchRoles();
    } catch (err) {
      alert(err.message || "Failed to delete role");
    }
  };

  /* ── Edit Role helpers ── */
  const handleEditRole = (role) => {
    setEditRole(role);
    setEditName(role.name);
    setEditSkills(
      (role.skills || []).map((s) => ({ name: s.name, weight: s.weight }))
    );
    setEditModal(true);
  };

  const updateEditSkill = (i, field, value) =>
    setEditSkills((p) => p.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));

  const removeEditSkill = (i) =>
    setEditSkills((p) => p.filter((_, idx) => idx !== i));

  const addEditSkill = () =>
    setEditSkills((p) => [...p, { name: "", weight: 5 }]);

  const handleSaveEdit = async () => {
    const clean = editSkills
      .filter((s) => s.name.trim())
      .map((s) => ({ name: s.name.trim(), weight: Number(s.weight) }));

    if (!editName.trim() || clean.length === 0) {
      alert("Please enter a role name and at least one skill.");
      return;
    }

    try {
      setEditLoading(true);
      await deleteRole(editRole.role_id, token);
      await createRole(projectId, { name: editName.trim(), skills: clean }, token);
      setEditModal(false);
      await fetchRoles();
    } catch (err) {
      alert(err.message || "Failed to update role");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="details-page">
      {/* ── Project Summary ── */}
      <section className="project-summary-card">
        <div className="proj-header">
          <div className="proj-avatar">
            {(project?.name || "P").charAt(0).toUpperCase()}
          </div>
          <div className="proj-info">
            <h2 className="proj-title">{project?.name || "Loading…"}</h2>
            {project?.description && (
              <p className="proj-desc">{project.description}</p>
            )}
          </div>
          <span className="status-pill">{project?.status || "Active"}</span>
        </div>
      </section>

      {/* ── Roles Section ── */}
      <section className="roles-wrapper">
        <div className="roles-title-row">
          <div>
            <h2>Project Roles &amp; Requirements</h2>
            <p>Define the roles and required skills for this project</p>
          </div>
          <button className="add-role-btn" onClick={() => setOpenModal(true)}>
            <Plus size={15} /> Add Role
          </button>
        </div>

        <div className="roles-list">
          {roles.map((role) => (
            <div key={role.role_id} className="role-card">
              <div className="role-card-top">
                <div className="role-icon-chip">⚙</div>
                <h3>{role.name}</h3>
              </div>

              {role.skills?.length > 0 && (
                <>
                  <p className="required-title">Required Skills</p>
                  <div className="skill-tags">
                    {role.skills.map((skill, i) => (
                      <span key={i}>
                        {skill.name}
                        <em>· {skill.weight}/10</em>
                      </span>
                    ))}
                  </div>
                </>
              )}

              <div className="role-card-footer">
                <button
                  className="btn-edit-role"
                  onClick={() => handleEditRole(role)}
                >
                  <Pencil size={13} /> Edit
                </button>
                <button
                  className="btn-delete-role"
                  onClick={() => handleDeleteRole(role.role_id)}
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}

          {roles.length === 0 && (
            <div className="roles-empty">
              <span>No roles defined yet.</span>
              <span>Click "Add Role" to get started.</span>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════
           ADD ROLE MODAL
         ════════════════════════════════ */}
      {openModal && (
        <div
          className="role-modal-overlay"
          onClick={() => setOpenModal(false)}
        >
          <div className="role-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setOpenModal(false)}>
              <X size={16} />
            </button>

            <h2>Add New Role</h2>
            <p>Define the role and its required skills with importance weights</p>

            <label>Role Name *</label>
            <input
              className="modal-input"
              placeholder="e.g., Frontend Developer"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />

            <div className="skills-header">
              <label>Required Skills *</label>
              <button onClick={addSkill}>
                <Plus size={13} /> Add Skill
              </button>
            </div>

            {skills.map((skill, i) => (
              <div key={i} className="skill-editor">
                <div className="skill-editor-row">
                  <input
                    placeholder="Skill name (e.g., React)"
                    value={skill.name}
                    onChange={(e) => updateSkill(i, "name", e.target.value)}
                  />
                  {skills.length > 1 && (
                    <button
                      className="skill-remove-btn"
                      onClick={() => removeSkill(i)}
                      title="Remove skill"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
                <div className="skill-weight-row">
                  <span>Weight: <strong>{skill.weight}/10</strong></span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={skill.weight}
                    onChange={(e) => updateSkill(i, "weight", Number(e.target.value))}
                  />
                </div>
              </div>
            ))}

            <div className="modal-actions">
              <button className="cancel-role" onClick={() => setOpenModal(false)}>
                Cancel
              </button>
              <button
                className="create-role"
                disabled={loading}
                onClick={handleCreateRole}
              >
                {loading ? "Adding…" : "Add Role"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════
           EDIT ROLE MODAL
         ════════════════════════════════ */}
      {editModal && editRole && (
        <div
          className="role-modal-overlay"
          onClick={() => setEditModal(false)}
        >
          <div className="role-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setEditModal(false)}>
              <X size={16} />
            </button>

            <h2>Edit Role</h2>
            <p>Update the role name and skill requirements</p>

            <label>Role Name *</label>
            <input
              className="modal-input"
              placeholder="e.g., Frontend Developer"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <div className="skills-header">
              <label>Required Skills *</label>
              <button onClick={addEditSkill}>
                <Plus size={13} /> Add Skill
              </button>
            </div>

            {editSkills.map((skill, i) => (
              <div key={i} className="skill-editor">
                <div className="skill-editor-row">
                  <input
                    placeholder="Skill name (e.g., React)"
                    value={skill.name}
                    onChange={(e) => updateEditSkill(i, "name", e.target.value)}
                  />
                  {editSkills.length > 1 && (
                    <button
                      className="skill-remove-btn"
                      onClick={() => removeEditSkill(i)}
                      title="Remove skill"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
                <div className="skill-weight-row">
                  <span>Weight: <strong>{skill.weight}/10</strong></span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={skill.weight}
                    onChange={(e) =>
                      updateEditSkill(i, "weight", Number(e.target.value))
                    }
                  />
                </div>
              </div>
            ))}

            <div className="modal-actions">
              <button className="cancel-role" onClick={() => setEditModal(false)}>
                Cancel
              </button>
              <button
                className="create-role"
                disabled={editLoading}
                onClick={handleSaveEdit}
              >
                {editLoading ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
