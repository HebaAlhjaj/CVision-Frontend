import { useEffect, useState } from "react";
import "./mySkills.css";
import { getMySkills } from "./mySkills.service";

export default function MySkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSkills() {
      try {
        setLoading(true);
        setError("");

        const data = await getMySkills();
        setSkills(data.skills || data || []);
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

      {loading && <p>Loading skills...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <div className="skills-grid">
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <div className="skill-card" key={index}>
                {typeof skill === "string" ? skill : skill.name || "Skill"}
              </div>
            ))
          ) : (
            <p>No skills found.</p>
          )}
        </div>
      )}
    </div>
  );
}