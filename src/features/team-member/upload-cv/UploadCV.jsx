import { useState } from "react";
import "./uploadCV.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

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

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE}/cv/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        throw new Error(data?.detail || data?.message || "CV upload failed");
      }

      setAnalysisResult({
        fileName: data.fileName || file.name,
        skills: Array.isArray(data.skills) ? data.skills : [],
      });
    } catch (err) {
      setError(err?.message || "Failed to upload and analyze CV");
    } finally {
      setLoading(false);
    }
  };

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
          <p>We found {analysisResult.skills.length} skills in your CV</p>
          <p className="file-name">{analysisResult.fileName}</p>

          <div className="skills-section">
            <h4>Extracted Skills :</h4>

            {analysisResult.skills.map((skill, index) => (
              <div className="skill-item" key={index}>
                <div className="skill-top">
                  <span>{skill.name}</span>
                  <span>{skill.score}/100</span>
                </div>

                <div className="skill-bar">
                  <div
                    className="skill-fill"
                    style={{ width: `${skill.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}