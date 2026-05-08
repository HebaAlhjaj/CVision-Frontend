import { useEffect, useState } from "react";
import "./skillGaps.css";

export default function SkillGaps() {
  const [data, setData] = useState(null);

  const token = localStorage.getItem("token");
  const projectId = localStorage.getItem("project_id");

  useEffect(() => {
    const fetchSkillGap = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/projects/${projectId}/skill-gap`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.log(err);
      }
    };

    if (projectId && token) fetchSkillGap();
  }, [projectId, token]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="skill-gaps-page">
      <h1>Skills Gap Analysis</h1>
      <p>Identify missing skills and get recommendations.</p>

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
            <div className="action-box" key={i}>
              {action}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}