import React, { useEffect, useState } from "react";
import "./teamMembers.css";
import "../../team-member/my-skills/mySkills.css";
import { getProjectMembers } from "./teamMembers.service";
import { DonutChart } from "../../team-member/my-skills/MySkills";
import { X, Eye, UserMinus, Award, Zap, TrendingUp } from "lucide-react";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getScoreBadge(score) {
  if (score >= 85) return { label: "Excellent Match", cls: "badge-excellent" };
  if (score >= 70) return { label: "Good Match", cls: "badge-good" };
  return { label: "Needs Improvement", cls: "badge-low" };
}

export default function TeamMembers() {
  const token     = localStorage.getItem("token");
  const projectId = localStorage.getItem("project_id");

  const [members, setMembers]               = useState([]);
  const [matching, setMatching]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState("");

  const [selectedMember, setSelectedMember] = useState(null);
  const [skillsModal, setSkillsModal]       = useState(false);
  const [memberSkillsData, setMemberSkillsData] = useState(null);
  const [skillsLoading, setSkillsLoading]   = useState(false);
  const [showAllSkills, setShowAllSkills]   = useState(false);

  const [confirmModal, setConfirmModal] = useState({
    open: false, userId: null, name: "",
  });

  const fetchMembers = async () => {
    if (!token || !projectId) return;
    try {
      setLoading(true);
      const data = await getProjectMembers(projectId, token);
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  };

  const fetchMatching = async () => {
    if (!token || !projectId) return;
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/projects/${projectId}/matching`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setMatching(Array.isArray(data) ? data : []);
    } catch {
      /* matching is optional enrichment */
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchMatching();
  }, [projectId, token]);

  function getMemberRoleInfo(member) {
    for (const role of matching) {
      if (
        role.recommended_member &&
        role.recommended_member.name === member.full_name
      ) {
        return {
          roleName: role.role_name,
          score: role.recommended_member.match_score,
        };
      }
    }
    return null;
  }

  const handleViewSkills = async (member) => {
    setSelectedMember(member);
    setSkillsModal(true);
    setMemberSkillsData(null);
    setShowAllSkills(false);
    setSkillsLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/projects/${projectId}/members/${member.user_id}/skills`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setMemberSkillsData(data);
      }
    } catch {
      /* show no-data fallback */
    } finally {
      setSkillsLoading(false);
    }
  };

  const handleRemoveMember = (userId, name) => {
    setConfirmModal({ open: true, userId, name });
  };

  const confirmRemove = async () => {
    const { userId } = confirmModal;
    setConfirmModal({ open: false, userId: null, name: "" });
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/projects/${projectId}/members/${userId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail || "Failed to remove member");
      }
      setMembers((prev) => prev.filter((m) => m.user_id !== userId));
      if (skillsModal && selectedMember?.user_id === userId) {
        setSkillsModal(false);
      }
    } catch (err) {
      alert(err.message || "Failed to remove member");
    }
  };

  if (loading)
    return (
      <div className="team-members-page">
        <div className="tm-state-card loading-text">Loading team members…</div>
      </div>
    );

  if (error)
    return (
      <div className="team-members-page">
        <div className="tm-state-card error-text">{error}</div>
      </div>
    );

  /* ── derived data for open modal ── */
  const msd = memberSkillsData;
  const modalSkills        = msd?.skills || [];
  const sortedModalSkills  = [...modalSkills].sort((a, b) => b.score - a.score);
  const displayedModalSkills = showAllSkills ? sortedModalSkills : sortedModalSkills.slice(0, 5);
  const expertCount        = msd?.expert_count ?? 0;
  const proficientCount    = msd?.proficient_count ?? 0;
  const intermediateCount  = modalSkills.filter((s) => s.score >= 50 && s.score < 70).length;
  const beginnerCount      = modalSkills.filter((s) => s.score < 50).length;
  const legendItems = [
    { label: "Expert (85+)",         count: expertCount,       color: "#7C3AED" },
    { label: "Proficient (70–84)",   count: proficientCount,   color: "#2563EB" },
    { label: "Intermediate (50–69)", count: intermediateCount, color: "#F59E0B" },
    { label: "Beginner (0–49)",      count: beginnerCount,     color: "#F97316" },
  ];

  return (
    <div className="team-members-page">
      {/* ── PAGE HEADER ── */}
      <div className="page-header">
        <div>
          <h1>Team Members</h1>
          <p className="page-subtitle">
            {members.length} member{members.length !== 1 ? "s" : ""} in this project
          </p>
        </div>
      </div>

      {/* ── MEMBERS GRID ── */}
      {members.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No team members yet</h3>
          <p>Share your project invite link to add team members.</p>
        </div>
      ) : (
        <div className="members-grid">
          {members.map((member) => {
            const roleInfo = getMemberRoleInfo(member);
            const badge    = roleInfo ? getScoreBadge(roleInfo.score) : null;

            return (
              <div className="member-card" key={member.user_id}>
                <div className="member-card-top">
                  <div className="member-avatar">
                    {getInitials(member.full_name)}
                  </div>
                  {badge && (
                    <span className={`score-badge ${badge.cls}`}>
                      {roleInfo.score}%
                    </span>
                  )}
                </div>

                <div className="member-info">
                  <h3 className="member-name">{member.full_name}</h3>
                  <p className="member-email">{member.email}</p>

                  {roleInfo ? (
                    <div className="member-role-row">
                      <span className="role-label">Assigned Role</span>
                      <span className="role-value">{roleInfo.roleName}</span>
                    </div>
                  ) : (
                    <div className="member-role-row unassigned">
                      <span className="role-label">Role</span>
                      <span className="role-value muted">Not assigned yet</span>
                    </div>
                  )}
                </div>

                <div className="member-card-actions">
                  <button
                    className="btn-view-skills"
                    onClick={() => handleViewSkills(member)}
                  >
                    <Eye size={15} /> View Skills
                  </button>
                  <button
                    className="btn-remove-member"
                    onClick={() => handleRemoveMember(member.user_id, member.full_name)}
                  >
                    <UserMinus size={15} /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ════════════════════════════════════
           MEMBER SKILLS MODAL (large dashboard)
         ════════════════════════════════════ */}
      {skillsModal && selectedMember && (
        <div
          className="skills-modal-overlay"
          onClick={() => setSkillsModal(false)}
        >
          <div
            className="skills-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Modal Header ── */}
            <div className="ms-modal-header">
              <div className="ms-header-left">
                <div className="ms-avatar-wrap">
                  <div className="ms-avatar-initials">
                    {getInitials(selectedMember.full_name)}
                  </div>
                </div>
                <div className="ms-header-info">
                  <h1 className="ms-name">
                    {selectedMember.full_name} — Skills Profile
                  </h1>
                  {msd?.analysis?.suggested_role && (
                    <div className="ms-role-tag">
                      {msd.analysis.suggested_role}
                    </div>
                  )}
                  <div className="ms-meta">
                    <span>{selectedMember.email}</span>
                    {msd?.analysis?.experience_years != null && (
                      <span className="ms-meta-sep">
                        {msd.analysis.experience_years} year
                        {msd.analysis.experience_years !== 1 ? "s" : ""} experience
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                className="close-modal-btn"
                onClick={() => setSkillsModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* ── Modal Body ── */}
            {skillsLoading ? (
              <div className="modal-loading">Loading skills profile…</div>
            ) : msd ? (
              <div className="ms-modal-body">
                {/* Stats Row */}
                <div className="ms-stats-row">
                  <div className="ms-stat-card">
                    <div className="ms-stat-icon expert-col">
                      <Award size={18} style={{ color: "#7C3AED" }} />
                    </div>
                    <div className="ms-stat-num">{expertCount}</div>
                    <div className="ms-stat-label">Expert Skills</div>
                    <div className="ms-stat-sub">score ≥ 85</div>
                  </div>
                  <div className="ms-stat-card">
                    <div className="ms-stat-icon proficient-col">
                      <Zap size={18} style={{ color: "#2563EB" }} />
                    </div>
                    <div className="ms-stat-num">{proficientCount}</div>
                    <div className="ms-stat-label">Proficient Skills</div>
                    <div className="ms-stat-sub">score 70–84</div>
                  </div>
                  <div className="ms-stat-card">
                    <div className="ms-stat-icon avg-col">
                      <TrendingUp size={18} style={{ color: "#059669" }} />
                    </div>
                    <div className="ms-stat-num">{msd.average}</div>
                    <div className="ms-stat-label">Avg Score</div>
                    <div className="ms-stat-sub">out of 100</div>
                  </div>
                  <div className="ms-stat-card">
                    <div className="ms-stat-icon total-col">📋</div>
                    <div className="ms-stat-num">{msd.total}</div>
                    <div className="ms-stat-label">Total Skills</div>
                    <div className="ms-stat-sub">analyzed</div>
                  </div>
                </div>

                {/* Two-column body */}
                <div className="ms-body">
                  {/* Left — Skill Scores */}
                  <div className="ms-skills-card">
                    <div className="ms-card-header">
                      <div>
                        <h2>Skill Scores</h2>
                        <p>AI-analyzed proficiency levels</p>
                      </div>
                    </div>

                    {modalSkills.length === 0 ? (
                      <div className="ms-no-skills">No skills data available</div>
                    ) : (
                      <>
                        <div className="ms-skills-list">
                          {displayedModalSkills.map((skill, i) => (
                            <div className="ms-skill-row" key={i}>
                              <div className="ms-skill-top">
                                <span className="ms-skill-name">{skill.name}</span>
                                <span
                                  className={`ms-skill-score ${
                                    skill.score >= 85
                                      ? "sc-expert"
                                      : skill.score >= 70
                                      ? "sc-proficient"
                                      : skill.score >= 50
                                      ? "sc-intermediate"
                                      : "sc-beginner"
                                  }`}
                                >
                                  {skill.score}
                                </span>
                              </div>
                              <div className="ms-bar-track">
                                <div
                                  className="ms-bar-fill"
                                  style={{ width: `${skill.score}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {modalSkills.length > 5 && (
                          <button
                            className="ms-view-all-btn"
                            onClick={() => setShowAllSkills((p) => !p)}
                          >
                            {showAllSkills
                              ? "Show Less ↑"
                              : `View All Skills (${msd.total}) ›`}
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  {/* Right — Distribution + Experience */}
                  <div className="ms-right-col">
                    {/* Skill Distribution */}
                    <div className="ms-dist-card">
                      <div className="ms-card-header">
                        <div>
                          <h2>Skill Distribution</h2>
                          <p>Overview of proficiency levels</p>
                        </div>
                      </div>
                      <div className="ms-chart-area">
                        <DonutChart skills={modalSkills} />
                        <div className="ms-chart-legend">
                          {legendItems.map(({ label, count, color }) => (
                            <div className="ms-legend-row" key={label}>
                              <span
                                className="ms-legend-dot"
                                style={{ background: color }}
                              />
                              <span className="ms-legend-label">{label}</span>
                              <span className="ms-legend-val">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Experience Summary */}
                    <div className="ms-exp-card">
                      <div className="ms-card-header">
                        <div>
                          <h2>Experience Summary</h2>
                        </div>
                      </div>
                      <div className="ms-exp-list">
                        <div className="ms-exp-row">
                          <span>Relevant Experience</span>
                          <strong>
                            {msd.analysis?.role_experience_years ?? 0} year
                            {msd.analysis?.role_experience_years !== 1 ? "s" : ""}
                          </strong>
                        </div>
                        <div className="ms-exp-row">
                          <span>Total Experience</span>
                          <strong>
                            {msd.analysis?.experience_years ?? 0} year
                            {msd.analysis?.experience_years !== 1 ? "s" : ""}
                          </strong>
                        </div>
                        {msd.analysis?.role_experience_reason && (
                          <div className="ms-exp-row ms-exp-reason">
                            <span>{msd.analysis.role_experience_reason}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="modal-no-data">
                <div className="modal-no-data-icon">📋</div>
                <h3>No CV uploaded yet</h3>
                <p>This member hasn't uploaded their CV for analysis.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CONFIRM REMOVE MODAL ── */}
      {confirmModal.open && (
        <div
          className="confirm-overlay"
          onClick={() => setConfirmModal({ open: false, userId: null, name: "" })}
        >
          <div
            className="confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-icon-wrap">
              <UserMinus size={22} />
            </div>
            <h3 className="confirm-title">Remove Member</h3>
            <p className="confirm-body">
              Are you sure you want to remove{" "}
              <strong>{confirmModal.name}</strong> from this project?
            </p>
            <div className="confirm-actions">
              <button
                className="btn-cancel-confirm"
                onClick={() =>
                  setConfirmModal({ open: false, userId: null, name: "" })
                }
              >
                Cancel
              </button>
              <button className="btn-remove-confirm" onClick={confirmRemove}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
