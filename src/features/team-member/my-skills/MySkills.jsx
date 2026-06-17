import { useEffect, useState } from "react";
import "./mySkills.css";
import { getMySkills } from "./mySkills.service";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function DonutChart({ skills }) {
  const R = 56, CX = 80, CY = 80;
  const C = 2 * Math.PI * R;

  const expert       = skills.filter((s) => s.score >= 85).length;
  const proficient   = skills.filter((s) => s.score >= 70 && s.score < 85).length;
  const intermediate = skills.filter((s) => s.score >= 50 && s.score < 70).length;
  const beginner     = skills.filter((s) => s.score < 50).length;
  const total        = skills.length;

  if (!total) {
    return (
      <div className="ms-no-chart">Upload your CV to see skill distribution</div>
    );
  }

  const segments = [
    { count: expert,       color: "#7C3AED" },
    { count: proficient,   color: "#2563EB" },
    { count: intermediate, color: "#F59E0B" },
    { count: beginner,     color: "#F97316" },
  ].filter((s) => s.count > 0);

  let accumulated = 0;

  return (
    <svg viewBox="0 0 160 160" width="140" height="140" style={{ flexShrink: 0 }}>
      {segments.map((seg, i) => {
        const pct    = seg.count / total;
        const dash   = pct * C;
        const offset = C * (0.25 - accumulated);
        accumulated += pct;
        return (
          <circle
            key={i}
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={seg.color}
            strokeWidth="22"
            strokeDasharray={`${dash} ${C - dash}`}
            strokeDashoffset={offset}
          />
        );
      })}
      <text
        x={CX}
        y={CY - 8}
        textAnchor="middle"
        fontSize="22"
        fontWeight="800"
        fill="#0F2D52"
        fontFamily="Inter, system-ui, sans-serif"
      >
        {total}
      </text>
      <text
        x={CX}
        y={CY + 12}
        textAnchor="middle"
        fontSize="10"
        fill="#7A92A8"
        fontFamily="Inter, system-ui, sans-serif"
      >
        Total Skills
      </text>
    </svg>
  );
}

export default function MySkills() {
  const [skills, setSkills]               = useState([]);
  const [total, setTotal]                 = useState(0);
  const [average, setAverage]             = useState(0);
  const [expertCount, setExpertCount]     = useState(0);
  const [proficientCount, setProficientCount] = useState(0);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [showAll, setShowAll]             = useState(false);
  const [projectCount, setProjectCount]   = useState(null);
  const [cvAnalysis, setCvAnalysis]       = useState(null);

  const userName   = localStorage.getItem("full_name") || localStorage.getItem("name") || "Team Member";
  const userEmail  = localStorage.getItem("email") || "";
  const profilePic = localStorage.getItem("profile_picture") || "";

  useEffect(() => {
    const saved = localStorage.getItem("cv_analysis");
    if (saved) {
      try { setCvAnalysis(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    async function loadSkills() {
      try {
        setLoading(true);
        const data = await getMySkills();
        setSkills(data.skills || []);
        setTotal(data.total || 0);
        setAverage(data.average || 0);
        setExpertCount(data.expert_count || 0);
        setProficientCount(data.proficient_count || 0);
      } catch (err) {
        setError(err?.message || "Failed to load skills");
      } finally {
        setLoading(false);
      }
    }
    loadSkills();
  }, []);

  useEffect(() => {
    async function loadProjects() {
      const token = localStorage.getItem("access_token") || localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://127.0.0.1:8000/projects/team-member/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProjectCount(Array.isArray(data) ? data.length : 0);
        }
      } catch { /* optional enrichment */ }
    }
    loadProjects();
  }, []);

  const sortedSkills     = [...skills].sort((a, b) => b.score - a.score);
  const displayedSkills  = showAll ? sortedSkills : sortedSkills.slice(0, 5);
  const intermediateCount = skills.filter((s) => s.score >= 50 && s.score < 70).length;
  const beginnerCount    = skills.filter((s) => s.score < 50).length;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
      });
    } catch { return "—"; }
  };

  if (loading) {
    return (
      <div className="ms-page">
        <div className="ms-loading">Loading your skills profile…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ms-page">
        <div className="ms-error">{error}</div>
      </div>
    );
  }

  const legendItems = [
    { label: "Expert (85+)",          count: expertCount,       color: "#7C3AED" },
    { label: "Proficient (70–84)",   count: proficientCount,   color: "#2563EB" },
    { label: "Intermediate (50–69)", count: intermediateCount, color: "#F59E0B" },
    { label: "Basic (0–49)",         count: beginnerCount,     color: "#F97316" },
  ];

  return (
    <div className="ms-page">
      {/* ── STATS ROW ── */}
      <div className="ms-stats-row">
        <div className="ms-stat-card">
          <div className="ms-stat-icon expert-col">🏆</div>
          <div className="ms-stat-num">{expertCount}</div>
          <div className="ms-stat-label">Expert Skills</div>
          <div className="ms-stat-sub">score ≥ 85</div>
        </div>
        <div className="ms-stat-card">
          <div className="ms-stat-icon proficient-col">⚡</div>
          <div className="ms-stat-num">{proficientCount}</div>
          <div className="ms-stat-label">Proficient Skills</div>
          <div className="ms-stat-sub">score 70–84</div>
        </div>
        <div className="ms-stat-card">
          <div className="ms-stat-icon avg-col">📈</div>
          <div className="ms-stat-num">{average}</div>
          <div className="ms-stat-label">Avg Score</div>
          <div className="ms-stat-sub">out of 100</div>
        </div>
        <div className="ms-stat-card">
          <div className="ms-stat-icon total-col">📋</div>
          <div className="ms-stat-num">{total}</div>
          <div className="ms-stat-label">Total Skills</div>
          <div className="ms-stat-sub">analyzed</div>
        </div>
      </div>

      {/* ── TWO-COLUMN BODY ── */}
      <div className="ms-body">
        {/* LEFT — Skill Scores */}
        <div className="ms-skills-card">
          <div className="ms-card-header">
            <div>
              <h2>Skill Scores</h2>
              <p>AI-analyzed proficiency levels</p>
            </div>
          </div>

          {skills.length === 0 ? (
            <div className="ms-no-skills">
              Upload your CV to see your skill scores
            </div>
          ) : (
            <>
              <div className="ms-skills-list">
                {displayedSkills.map((skill, i) => (
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

              {skills.length > 5 && (
                <button
                  className="ms-view-all-btn"
                  onClick={() => setShowAll((p) => !p)}
                >
                  {showAll ? "Show Less ↑" : `View All Skills (${total}) ›`}
                </button>
              )}
            </>
          )}
        </div>

        {/* RIGHT — Distribution + Experience */}
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
              <DonutChart skills={skills} />
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
                  {cvAnalysis?.role_experience_years ?? 0} year
                  {cvAnalysis?.role_experience_years !== 1 ? "s" : ""}
                </strong>
              </div>
              {projectCount !== null && (
                <div className="ms-exp-row">
                  <span>Projects Worked On</span>
                  <strong>{projectCount}</strong>
                </div>
              )}
              <div className="ms-exp-row">
                <span>Last CV Analyzed</span>
                <strong>{formatDate(cvAnalysis?.analyzed_at)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
