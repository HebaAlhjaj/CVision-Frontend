import React, { useEffect, useState } from "react";
import "./projectDetails.css";
import { getRoles, createRole, deleteRole } from "./projectDetails.service";

const defaultRoles = [
  {
    role_id: 1,
    name: "Frontend Developer",
    skills: [
      { name: "React", weight: 10 },
      { name: "TypeScript", weight: 9 },
      { name: "CSS", weight: 8 },
      { name: "Redux", weight: 7 },
    ],
  },
  {
    role_id: 2,
    name: "Backend Developer",
    skills: [
      { name: "Node.js", weight: 10 },
      { name: "REST API", weight: 9 },
      { name: "Express", weight: 7 },
      { name: "MongoDB", weight: 8 },
    ],
  },
  {
    role_id: 3,
    name: "UI/UX Designer",
    skills: [
      { name: "Figma", weight: 10 },
      { name: "User Research", weight: 8 },
      { name: "UI/UX", weight: 9 },
      { name: "Prototyping", weight: 7 },
    ],
  },
];

export default function ProjectDetails() {
  const token = localStorage.getItem("token");
  const projectId = localStorage.getItem("project_id") || 1;

  const [roles, setRoles] = useState(defaultRoles);
  const [openModal, setOpenModal] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [skills, setSkills] = useState([{ name: "", weight: 5 }]);
  const [loading, setLoading] = useState(false);

  const fetchRoles = async () => {
    if (!token) return;

    try {
      const data = await getRoles(projectId, token);
      if (Array.isArray(data) && data.length > 0) {
        setRoles(data);
      }
    } catch (err) {
      console.log("Backend not available, showing default roles");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const addSkill = () => {
    setSkills((prev) => [...prev, { name: "", weight: 5 }]);
  };

  const updateSkill = (index, field, value) => {
    setSkills((prev) =>
      prev.map((skill, i) =>
        i === index ? { ...skill, [field]: value } : skill
      )
    );
  };

  const handleCreateRole = async () => {
    const cleanSkills = skills
      .filter((s) => s.name.trim())
      .map((s) => ({
        name: s.name.trim(),
        weight: Number(s.weight),
      }));

    if (!roleName.trim() || cleanSkills.length === 0) {
      alert("Please enter role name and at least one skill");
      return;
    }

    const data = {
      name: roleName.trim(),
      skills: cleanSkills,
    };

    try {
      setLoading(true);

      if (token) {
        await createRole(projectId, data, token);
        await fetchRoles();
      } else {
        setRoles((prev) => [
          ...prev,
          {
            role_id: Date.now(),
            name: data.name,
            skills: data.skills,
          },
        ]);
      }

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
      if (token) {
        await deleteRole(roleId, token);
      }

      setRoles((prev) => prev.filter((role) => role.role_id !== roleId));
    } catch (err) {
      alert(err.message || "Failed to delete role");
    }
  };

  return (
    <div className="details-page">
      <section className="project-summary-card">
        <div className="summary-top">
          <div>
            <h2>E-Commerce Platform</h2>
            <p>Building a modern e-commerce platform with React and Node.js</p>
          </div>
          <span className="status-pill">active</span>
        </div>

    
      </section>

      <section className="roles-wrapper">
        <div className="roles-title-row">
          <div>
            <h2>Project Roles & Requirements</h2>
            <p>Define the roles and required skills for this project</p>
          </div>

          <button className="add-role-btn" onClick={() => setOpenModal(true)}>
            + Add Role
          </button>
        </div>

        <div className="roles-list">
          {roles.map((role) => (
            <div key={role.role_id} className="role-card">
              <button
                className="trash-btn"
                onClick={() => handleDeleteRole(role.role_id)}
              >
                🗑
              </button>

              <h3>{role.name}</h3>
              <p className="assigned-text">Not assigned yet</p>

              <p className="required-title">Required Skills:</p>

              <div className="skill-tags">
                {role.skills?.map((skill, index) => (
                  <span key={index}>
                    {skill.name} Priority {skill.weight}/10
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {openModal && (
        <div className="role-modal-overlay">
          <div className="role-modal">
            <button className="close-modal" onClick={() => setOpenModal(false)}>
              ×
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
              <button onClick={addSkill}>+ Add Skill</button>
            </div>

            {skills.map((skill, index) => (
              <div key={index} className="skill-editor">
                <label>Skill Name</label>
                <input
                  placeholder="e.g., React"
                  value={skill.name}
                  onChange={(e) =>
                    updateSkill(index, "name", e.target.value)
                  }
                />

                <p>Importance Weight: {skill.weight}/10</p>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={skill.weight}
                  onChange={(e) =>
                    updateSkill(index, "weight", Number(e.target.value))
                  }
                />
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
                {loading ? "Adding..." : "Add Role"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}