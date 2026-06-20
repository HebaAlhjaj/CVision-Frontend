import { useEffect, useState } from "react";
import "./skillGaps.css";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Pure client-side computation — does NOT touch AI / role-matching logic
function computeMatchPotential(requiredSkills, memberSkills) {
  if (!requiredSkills.length) return { currentMatch: 0, afterMatch: 0, missingSkills: [] };

  const totalWeight = requiredSkills.reduce((acc, s) => acc + (s.weight || 1), 0);
  let currentScore = 0;
  let afterScore   = 0;
  const missingSkills = [];

  for (const req of requiredSkills) {
    const found = memberSkills.find(
      (s) => s.name.toLowerCase() === req.name.toLowerCase()
    );
    const w = req.weight || 1;
    if (found) {
      const contrib = (found.score / 100) * w;
      currentScore += contrib;
      afterScore   += contrib;
    } else {
      missingSkills.push(req.name);
      afterScore += (70 / 100) * w; // assume 70/100 proficiency after training
    }
  }

  return {
    currentMatch: Math.round((currentScore / totalWeight) * 100),
    afterMatch:   Math.min(Math.round((afterScore / totalWeight) * 100), 95),
    missingSkills,
  };
}

export default function SkillGaps() {
  const [data,            setData]            = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recsLoading,     setRecsLoading]     = useState(true);

  const token     = localStorage.getItem("token");
  const projectId = localStorage.getItem("project_id");

  useEffect(() => {
    if (!projectId || !token) return;

    const run = async () => {
      const headers = { Authorization: `Bearer ${token}` };

      let matching = [];
      let members = [];

      try {
        const res = await fetch(
          `http://127.0.0.1:8000/projects/${projectId}/full-data`,
          { headers }
        );

        if (res.ok) {
          const fullData = await res.json();
          setData(fullData.skill_gap);
          matching = fullData.matching || [];
          members = fullData.members || [];
        }
      } catch (err) {
        console.log(err);
      }

      if (!Array.isArray(matching) || !Array.isArray(members)) {
        setRecsLoading(false);
        return;
      }

      /* ── 2. Identify unfilled roles and unassigned members ── */
      try {
        const unfilledRoles = matching.filter((r) => !r.recommended_member);
        const assignedNames = new Set(
          matching
            .filter((r) => r.recommended_member)
            .map((r) => r.recommended_member.name)
        );
        const unassigned = members.filter((m) => !assignedNames.has(m.full_name));

        if (!unfilledRoles.length || !unassigned.length) {
          setRecsLoading(false);
          return;
        }

        /* ── 3. Fetch skills for each unassigned member ── */
        const skillsMap = {};
        await Promise.all(
          unassigned.map(async (m) => {
            try {
              const res = await fetch(
                `http://127.0.0.1:8000/projects/${projectId}/members/${m.user_id}/skills`,
                { headers }
              );
              skillsMap[m.user_id] = res.ok ? (await res.json()).skills || [] : [];
            } catch {
              skillsMap[m.user_id] = [];
            }
          })
        );

        /* ── 4. Compute best candidate per unfilled role ── */
        const recs = [];
        for (const role of unfilledRoles) {
          const required = role.required_skills || [];
          if (!required.length) continue;

          const scored = unassigned.map((member) => ({
            member,
            ...computeMatchPotential(required, skillsMap[member.user_id] || []),
          }));

          const withPartialMatch = scored
            .filter((c) => c.missingSkills.length < required.length)
            .sort((a, b) => b.currentMatch - a.currentMatch);

          const pool =
            withPartialMatch.length > 0
              ? withPartialMatch
              : scored.sort((a, b) => b.afterMatch - a.afterMatch);

          const best = pool[0];
          if (best && best.missingSkills.length > 0) {
            recs.push({ role, ...best });
          }
        }

        setRecommendations(recs);
      } catch (err) {
        console.log(err);
      } finally {
        setRecsLoading(false);
      }
    };

    run();
  }, [projectId, token]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="skill-gaps-page">
      <h1>Skills Gap Analysis</h1>
      <p>Identify missing skills and get recommendations.</p>

      {/* ── SUMMARY ── */}
      <div className="summary-grid">
        <div className="summary-card">
          <h3>{data.summary?.roles_assigned}</h3>
          <p>of {data.summary?.total_roles} roles assigned</p>
        </div>
        <div className="summary-card">
          <h3>{data.summary?.roles_with_gaps}</h3>
          <p>roles with gaps</p>
        </div>
        <div className="summary-card">
          <h3>{data.summary?.team_members}</h3>
          <p>{data.summary?.members_with_cv} with CV</p>
        </div>
      </div>

      {/* ── GAP CARDS ── */}
      {data.gaps?.map((gap, index) => (
        <div className="gap-card" key={index}>
          <div className="gap-header">
            <h2>{gap.role_name}</h2>
            <span>{gap.priority}</span>
          </div>

          <h4>Missing Skills:</h4>
          <div className="missing-skills">
            {gap.missing_skills?.map((skill, i) => (
              <span key={i}>{skill}</span>
            ))}
          </div>

          <h4>Recommended Actions:</h4>
          {gap.recommended_actions?.map((action, i) => (
            <div className="action-box" key={i}>{action}</div>
          ))}
        </div>
      ))}

      {/* ── TRAINING RECOMMENDATIONS ── */}
      {!recsLoading && recommendations.length > 0 && (
        <section className="recs-section">
          <div className="recs-section-header">
            <div>
              <h2 className="recs-title">Training Recommendations</h2>
              <p className="recs-subtitle">
                Actionable paths to fill unfilled roles using your current team
              </p>
            </div>
            <span className="recs-count-badge">
              {recommendations.length} suggestion{recommendations.length !== 1 ? "s" : ""}
            </span>
          </div>

          {recommendations.map((rec, i) => (
            <div className="rec-card" key={i}>
              {/* ── Card Header: member → role ── */}
              <div className="rec-header">
                <div className="rec-person">
                  <div className="rec-avatar">{getInitials(rec.member.full_name)}</div>
                  <div className="rec-person-text">
                    <div className="rec-person-name">{rec.member.full_name}</div>
                    <div className="rec-person-sub">Currently Unassigned</div>
                  </div>
                </div>

                <div className="rec-connector">
                  <div className="rec-connector-line" />
                  <span className="rec-connector-label">can fill</span>
                </div>

                <div className="rec-role">
                  <div className="rec-role-chip">⚙</div>
                  <div className="rec-role-text">
                    <div className="rec-role-name">{rec.role.role_name}</div>
                    <div className="rec-role-sub">Unfilled Role</div>
                  </div>
                </div>
              </div>

              {/* ── Card Body ── */}
              <div className="rec-body">
                {/* Skills to train */}
                <div className="rec-skills-section">
                  <div className="rec-body-label">Skills to Train</div>
                  <div className="rec-skills-list">
                    {rec.missingSkills.map((s, j) => (
                      <span key={j} className="rec-skill-tag">{s}</span>
                    ))}
                  </div>
                </div>

                {/* Match potential bars */}
                <div className="rec-potential">
                  <div className="rec-potential-col">
                    <div className="rec-pct">{rec.currentMatch}%</div>
                    <div className="rec-pct-label">Current</div>
                  </div>
                  <div className="rec-potential-track">
                    <div className="rec-track-bar">
                      <div
                        className="rec-track-fill current"
                        style={{ width: `${rec.currentMatch}%` }}
                      />
                    </div>
                    <span className="rec-track-arrow">→</span>
                    <div className="rec-track-bar">
                      <div
                        className="rec-track-fill after"
                        style={{ width: `${rec.afterMatch}%` }}
                      />
                    </div>
                  </div>
                  <div className="rec-potential-col">
                    <div className="rec-pct after">{rec.afterMatch}%</div>
                    <div className="rec-pct-label">After Training</div>
                  </div>
                </div>
              </div>

              {/* ── Recommendation note ── */}
              <div className="rec-note">
                Train <strong>{rec.member.full_name}</strong> in the listed skills to strengthen
                their candidacy for the <strong>{rec.role.role_name}</strong> role.
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
