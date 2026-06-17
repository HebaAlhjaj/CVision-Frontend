import { useEffect, useState } from "react";
import "./roleMatch.css";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getScoreBadge(score, category) {
  const cat = category || (
    score >= 85 ? "Excellent" :
    score >= 70 ? "Good" :
    score >= 50 ? "Fair" : "Weak"
  );
  const cls =
    cat === "Excellent" ? "badge-excellent" :
    cat === "Good" ? "badge-good" :
    cat === "Fair" ? "badge-fair" : "badge-weak";
  return { label: cat, cls };
}

export default function RoleMatch() {
  const [matching, setMatching] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const projectId = localStorage.getItem("project_id");

  useEffect(() => {
    const fetchMatching = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/projects/${projectId}/matching`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setMatching(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId && token) fetchMatching();
  }, [projectId, token]);

  if (loading) {
    return (
      <div className="role-match-page">
        <h1>Role Matching &amp; Assignment</h1>
        <p>Analyzing team skills and matching to roles…</p>
        <div className="loading-card">Loading match data…</div>
      </div>
    );
  }

  return (
    <div className="role-match-page">
      <h1>Role Matching &amp; Assignment</h1>
      <p>Best-fit candidates matched to each project role based on skills.</p>

      {matching.length === 0 && (
        <div className="no-data-card">
          <div className="no-data-icon">🔍</div>
          <h3>No matching data yet</h3>
          <p>Add team members and run the analysis to see role matches.</p>
        </div>
      )}

      {matching.map((role, index) => (
        <div className="match-role-card" key={index}>
          {/* Role title + required skills */}
          <div className="role-card-header">
            <h2>{role.role_name}</h2>
            <div className="required-skills">
              {role.required_skills?.map((skill, i) => (
                <span key={i}>{skill.name}</span>
              ))}
            </div>
          </div>

          {/* ── FINAL ASSIGNMENT (with avatar) ── */}
          {role.recommended_member ? (
            <div className="final-assignment-card">
              <div className="final-assignment-inner">
                <div className="final-avatar">
                  {getInitials(role.recommended_member.name)}
                </div>

                <div className="final-info">
                  <div className="final-name-row">
                    <span className="final-name">
                      {role.recommended_member.name}
                    </span>
                    {(() => {
                      const b = getScoreBadge(role.recommended_member.match_score, role.recommended_member.match_category);
                      return (
                        <span className={`score-badge ${b.cls}`}>
                          {role.recommended_member.match_score}% — {b.label}
                        </span>
                      );
                    })()}
                  </div>
                  <span className="recommended-label">✓ Recommended Candidate</span>

                  {role.recommended_member.matched_skills_detail?.length > 0 && (
                    <div className="matched-skills-chips">
                      {role.recommended_member.matched_skills_detail.map((s, i) => (
                        <span
                          key={i}
                          className={`skill-chip ${
                            s.score >= 85 ? "chip-expert" :
                            s.score >= 70 ? "chip-proficient" : "chip-basic"
                          }`}
                        >
                          {s.name} · {s.score}
                        </span>
                      ))}
                    </div>
                  )}

                  {role.recommended_member.missing_skills?.length > 0 && (
                    <div className="missing-skills-chips">
                      <span className="missing-label">Missing:</span>
                      {role.recommended_member.missing_skills.map((s, i) => (
                        <span key={i} className="skill-chip chip-missing">{s}</span>
                      ))}
                    </div>
                  )}

                  {role.recommended_member.explanation && (
                    <p className="final-explanation">
                      {role.recommended_member.explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            role.matches?.length > 0 && (
              <div className="final-assignment-card unfilled">
                <div className="unfilled-inner">
                  <span className="unfilled-icon">⚠</span>
                  <div>
                    <strong>No final assignment yet</strong>
                    <p>
                      The strongest candidates were assigned to roles that suit
                      them better.
                    </p>
                  </div>
                </div>
              </div>
            )
          )}

          {role.best_match_note && (
            <p className="best-match-note">{role.best_match_note}</p>
          )}

          {/* ── OTHER CANDIDATES (text-only, no avatars) ── */}
          {role.matches?.length > 0 ? (
            <div className="other-candidates-section">
              <p className="other-candidates-title">Other Candidates</p>
              <div className="other-candidates-list">
                {role.matches.map((match) => {
                  const badge = getScoreBadge(match.match_score, match.match_category);
                  return (
                    <div className="other-candidate-row" key={match.user_id}>
                      <div className="other-candidate-info">
                        <strong className="other-name">{match.name}</strong>
                        {match.matched_skill_count != null && (
                          <span className="other-matched-count">
                            {match.matched_skill_count}/{match.total_required_skills} skills
                          </span>
                        )}
                      </div>
                      <span className={`score-badge small ${badge.cls}`}>
                        {match.match_score}% · {badge.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="no-match">
              <strong>No suitable candidates found</strong>
              <p>No team members have the required skills for this role.</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
