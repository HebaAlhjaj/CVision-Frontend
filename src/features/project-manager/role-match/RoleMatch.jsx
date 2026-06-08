import { useEffect, useState } from "react";
import "./roleMatch.css";

export default function RoleMatch() {
  const [matching, setMatching] = useState([]);

  const token = localStorage.getItem("token");
  const projectId = localStorage.getItem("project_id");

  useEffect(() => {
    const fetchMatching = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/projects/${projectId}/matching`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setMatching(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err);
      }
    };

    if (projectId && token) fetchMatching();
  }, [projectId, token]);

  return (
    <div className="role-match-page">
      <h1>Role Matching & Assignment</h1>
      <p>Match team members to roles based on their skills.</p>

      {matching.map((role, index) => (
        <div className="match-role-card" key={index}>
          <h2>{role.role_name}</h2>

          <div className="required-skills">
            {role.required_skills?.map((skill, i) => (
              <span key={i}>{skill.name}</span>
            ))}
          </div>

          {role.recommended_member ? (
            <div className="final-assignment-card">
              <strong>
                Final Assignment: {role.recommended_member.name} (
                {role.recommended_member.match_score}%)
              </strong>
              <p>{role.recommended_member.explanation}</p>
            </div>
          ) : (
            role.matches?.length > 0 && (
              <div className="final-assignment-card unfilled">
                <strong>No final assignment yet for this role</strong>
                <p>
                  The strongest candidates below were already assigned to a
                  role that suits them better.
                </p>
              </div>
            )
          )}

          {role.best_match_note && (
            <p className="best-match-note">{role.best_match_note}</p>
          )}

          {role.matches?.length > 0 ? (
            role.matches.map((match) => (
              <div className="candidate-card" key={match.user_id}>
                <h3>{match.name}</h3>
                <p>{match.email}</p>
                <p className="match-explanation">{match.explanation}</p>
                <p>Match Score: {match.match_score}%</p>
              </div>
            ))
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