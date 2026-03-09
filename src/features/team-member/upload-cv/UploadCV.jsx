import { useState } from "react";
import "./uploadCV.css";

export default function UploadCV() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      setAnalysisResult({
        fileName: file.name,
        skills: [
          { name: "React", score: 95 },
          { name: "JavaScript", score: 84 },
          { name: "TypeScript", score: 60 },
          { name: "Next.js", score: 51 },
          { name: "CSS", score: 94 },
        ],
      });
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
            Choose File
          </label>

          {selectedFile && (
            <p className="file-name">{selectedFile.name}</p>
          )}
        </div>
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