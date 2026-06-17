import { useState } from "react";
import "./uploadCV.css";
import { uploadCV } from "./uploadCV.service";

export default function UploadCV() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    setSelectedFile(file);
    setAnalysisResult(null);
    setError("");

    if (!file) return;

    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");

    if (!token) {
      setError("You are not logged in. Please log in first.");
      return;
    }

    try {
      setLoading(true);

      const data = await uploadCV(file, token);

      console.log("CV ANALYSIS RESPONSE:", data);

      const analysis = data.analysis || data;

      const technicalSkills =
        analysis.technical_skills ||
        analysis.skills ||
        analysis.extracted_skills ||
        [];

      const skillScores =
        analysis.skill_scores ||
        analysis.skills_scores ||
        analysis.scores ||
        {};

      const resultObj = {
        fileName: file.name,

        technical_skills: Array.isArray(technicalSkills)
          ? technicalSkills
          : [],

        skill_scores: skillScores || {},

        suggested_role:
          analysis.suggested_role ||
          analysis.role ||
          analysis.recommended_role ||
          "Unknown",

        experience_years:
          analysis.experience_years ||
          analysis.experience ||
          analysis.years_of_experience ||
          0,

        role_experience_years:
          analysis.role_experience_years ??
          analysis.role_experience ??
          null,

        role_experience_reason:
          analysis.role_experience_reason ||
          analysis.role_reason ||
          "",
      };

      setAnalysisResult(resultObj);

      // Persist analysis summary so MySkills can display it
      localStorage.setItem("cv_analysis", JSON.stringify({
        suggested_role: resultObj.suggested_role,
        experience_years: resultObj.experience_years,
        role_experience_years: resultObj.role_experience_years,
        role_experience_reason: resultObj.role_experience_reason,
        soft_skills: analysis.soft_skills || [],
        tools: analysis.tools || [],
        certifications: analysis.certifications || [],
        languages: analysis.languages || [],
        analyzed_at: new Date().toISOString(),
      }));
    } catch (err) {
      setError(err?.message || "Failed to upload and analyze CV");
    } finally {
      setLoading(false);
    }
  };

  const skillsCount =
    Object.keys(analysisResult?.skill_scores || {}).length ||
    analysisResult?.technical_skills?.length ||
    0;

  return (
    <main className="uploadcv-page">
      <div className="uploadcv-header">
        <h1>Upload CV</h1>
        <p>Upload your CV to have your skills automatically analyzed</p>
      </div>

      <div className="uploadcv-box">
        <div className="uploadcv-icon-circle">
          <span className="uploadcv-icon">⬆</span>
        </div>

        <h3>CV Upload &amp; Analysis</h3>

        <p className="uploadcv-box-text">
          Our AI will extract your skills, experience, and certifications
        </p>

        <div className="uploadcv-file-row">
          <input
            id="cvFile"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            hidden
          />

          <label htmlFor="cvFile" className="uploadcv-file-btn">
            {loading ? "Uploading..." : "Choose File"}
          </label>

          {selectedFile && <p className="file-name">{selectedFile.name}</p>}
        </div>

        {error && <p className="form-error">✖ {error}</p>}
      </div>

      {analysisResult && (
        <div className="analysis-box">
          <h3>Analysis Complete !</h3>

          <p>We found {skillsCount} skills in your CV</p>

          <p className="file-name">{analysisResult.fileName}</p>

          <div className="skills-section">
            <h4>Extracted Skills :</h4>

            {Object.keys(analysisResult.skill_scores || {}).length > 0 ? (
              Object.entries(analysisResult.skill_scores).map(
                ([skill, detail], index) => {
                  // The API returns either a bare number or an object
                  // like { score, years_experience, explanation }.
                  // Always reduce to a safe numeric score before rendering.
                  const rawScore =
                    detail && typeof detail === "object"
                      ? detail.score
                      : detail;

                  const numericScore = Number(rawScore);

                  const score = Number.isFinite(numericScore)
                    ? Math.min(100, Math.max(0, numericScore))
                    : 0;

                  return (
                    <div className="skill-item" key={index}>
                      <div className="skill-top">
                        <span>{skill}</span>
                        <span>{score}/100</span>
                      </div>

                      <div className="skill-bar">
                        <div
                          className="skill-fill"
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                }
              )
            ) : analysisResult.technical_skills.length > 0 ? (
              <div className="skills-list">
                {analysisResult.technical_skills.map((skill, index) => (
                  <span className="skill-chip" key={index}>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="no-skills-text">
                No skills were extracted from this CV.
              </p>
            )}
          </div>

          <p>
            <strong>Suggested Role:</strong> {analysisResult.suggested_role}
          </p>

          <p>
            <strong>Experience:</strong> {analysisResult.experience_years} years
          </p>

          {analysisResult.role_experience_years !== null &&
            analysisResult.role_experience_years !== undefined && (
              <p>
                <strong>Relevant Experience:</strong>{" "}
                {analysisResult.role_experience_years} years
              </p>
            )}

          {analysisResult.role_experience_reason && (
            <p>
              <strong>Reason:</strong> {analysisResult.role_experience_reason}
            </p>
          )}
        </div>
      )}
    </main>
  );
}