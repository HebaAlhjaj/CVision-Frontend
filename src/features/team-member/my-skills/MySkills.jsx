import { useEffect, useState } from "react";
import "./mySkills.css";
import { getMySkills } from "./mySkills.service";

export default function MySkills() {
  const [skills, setSkills] = useState([]);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);

  const [expertSkills, setExpertSkills] = useState([]);
  const [proficientSkills, setProficientSkills] = useState([]);

  const [expertCount, setExpertCount] = useState(0);
  const [proficientCount, setProficientCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSkills() {
      try {
        setLoading(true);
        setError("");

        const data = await getMySkills();

        setSkills(data.skills || []);
        setTotal(data.total || 0);
        setAverage(data.average || 0);

        setExpertSkills(data.expert_skills || []);
        setProficientSkills(data.proficient_skills || []);

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

  return (
    <div className="my-skills-page">
      <h1>My Skills</h1>
      <p className="page-subtitle">
        View your analyzed skills and proficiency levels
      </p>

      {loading && <p>Loading skills...</p>}
      {!loading && error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <>
          <div className="skills-summary">
            <div className="summary-card">
              <div className="summary-title">Total Skills</div>
              <div className="summary-bottom">
                <div className="summary-icon">&lt;&gt;</div>
                <div>
                  <div className="summary-value-small">{total}</div>
                  <div className="summary-text">identified</div>
                </div>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-title">Average Score</div>
              <div className="summary-bottom">
                <div className="summary-icon">📈</div>
                <div>
                  <div className="summary-value-small">{average}</div>
                  <div className="summary-text">out of 100</div>
                </div>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-title">Expert Skills</div>
              <div className="summary-bottom">
                <div className="summary-icon">✹</div>
                <div>
                  <div className="summary-value-small">{expertCount}</div>
                  <div className="summary-text">+85 score</div>
                </div>
              </div>
            </div>
          </div>

          <div className="skills-section">
            <div className="section-header">
              <div>
                <h2>Expert Skills</h2>
                <p>Skills with proficiency score of 85 or higher</p>
              </div>
              <span className="count-badge">{expertCount}</span>
            </div>

            {expertSkills.length > 0 ? (
              <div className="skills-list">
                {expertSkills.map((skill, index) => (
                  <div className="skill-row-card" key={`${skill.name}-${index}`}>
                    <div className="skill-row-top">
                      <span className="skill-name">{skill.name}</span>

                      <span className="skill-years">
                        {skill.years} {skill.years === 1 ? "Year" : "Years"}
                      </span>

                      <span className="skill-score">{skill.score}</span>
                    </div>

                    <div className="skill-bar">
                      <div
                        className="skill-bar-fill"
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No expert skills found.</p>
            )}
          </div>

          <div className="skills-section">
            <div className="section-header">
              <div>
                <h2>Proficient Skills</h2>
                <p>Skills with proficiency score between 70-84</p>
              </div>
              <span className="count-badge">{proficientCount}</span>
            </div>

            {proficientSkills.length > 0 ? (
              <div className="skills-list">
                {proficientSkills.map((skill, index) => (
                  <div className="skill-row-card" key={`${skill.name}-${index}`}>
                    <div className="skill-row-top">
                      <span className="skill-name">{skill.name}</span>

                      <span className="skill-years">
                        {skill.years} {skill.years === 1 ? "Year" : "Years"}
                      </span>

                      <span className="skill-score">{skill.score}</span>
                    </div>

                    <div className="skill-bar">
                      <div
                        className="skill-bar-fill"
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No proficient skills found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}