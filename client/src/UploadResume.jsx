import { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

function UploadResume() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [score, setScore] = useState(null);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume!");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please enter the job description!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/upload",
        formData
      );

      const resumeText = res.data.resumeText.toLowerCase();
      const jdText = jobDescription.toLowerCase();

      const keywords = [
        "java",
        "python",
        "react",
        "sql",
        "html",
        "css",
        "javascript",
        "node",
        "express",
        "mongodb",
        "project",
        "communication",
        "leadership",
      ];

      let atsScore = 0;
      const matched = [];
      const missing = [];

      keywords.forEach((word) => {
        if (resumeText.includes(word) && jdText.includes(word)) {
          atsScore += Math.floor(100 / keywords.length);
          matched.push(word);
        } else if (jdText.includes(word)) {
          missing.push(word);
        }
      });

      if (atsScore > 100) {
        atsScore = 100;
      }

      setScore(atsScore);
      setMatchedSkills(matched);
      setMissingSkills(missing);

      if (missing.length > 0) {
        setSuggestion(
          "Add these skills to improve your ATS score: " +
            missing.join(", ")
        );
      } else {
        setSuggestion(
          "Excellent! Your resume matches the job description."
        );
      }
    } catch (err) {
      console.error(err);
      alert(
        "Upload failed. Please make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("AI ATS Resume Report", 20, 20);

    doc.setFontSize(14);
    doc.text(`ATS Score: ${score}/100`, 20, 40);

    doc.text("Matched Skills:", 20, 60);
    doc.text(
      matchedSkills.length > 0
        ? matchedSkills.join(", ")
        : "None",
      20,
      70
    );

    doc.text("Missing Skills:", 20, 90);
    doc.text(
      missingSkills.length > 0
        ? missingSkills.join(", ")
        : "None",
      20,
      100
    );

    doc.text("Suggestion:", 20, 120);

    const suggestionLines = doc.splitTextToSize(
      suggestion,
      170
    );

    doc.text(suggestionLines, 20, 130);

    doc.save("ATS_Report.pdf");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Please upload a PDF, DOC, or DOCX file.");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
    setScore(null);
    setMatchedSkills([]);
    setMissingSkills([]);
    setSuggestion("");
  };

  return (
    <div className="ats-app">
      <div className="ats-container">

        {/* Header */}
        <div className="ats-header">
          <h1>AI ATS Resume Checker</h1>

          <p>
            Upload your resume and compare it with a job
            description to measure ATS compatibility.
          </p>
        </div>

        {/* Main Card */}
        <div className="ats-card">

          {/* Resume Upload */}
          <div className="ats-section">
            <h2>📄 Upload Your Resume</h2>

            <p>
              Upload your resume in PDF or Word format to
              analyze your skills.
            </p>

            <div className="upload-box">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />

              {file && (
                <p>
                  Selected file:{" "}
                  <strong>{file.name}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div className="ats-section">
            <h2>💼 Job Description</h2>

            <p>
              Paste the job description below to identify
              matching and missing skills.
            </p>

            <textarea
              className="job-description"
              rows="8"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) =>
                setJobDescription(e.target.value)
              }
            />
          </div>

          {/* Check Button */}
          <div className="ats-section">
            <button
              className="ats-button"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading
                ? "⏳ Analyzing Resume..."
                : "🚀 Check ATS Score"}
            </button>
          </div>

          {/* Loading Message */}
          {loading && (
            <div className="loading-message">
              <p>
                🔍 Analyzing your resume and comparing
                skills...
              </p>
            </div>
          )}

          {/* Results */}
          {score !== null && !loading && (
            <div className="ats-result">

              <h2>📊 ATS Analysis Result</h2>

              {/* Score */}
              <h3>
                ATS Score: {score}/100
              </h3>

              <div className="progress mt-3">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${score}%` }}
                >
                  {score}%
                </div>
              </div>

              {/* Matched Skills */}
              <h4 className="mt-4 text-success">
                ✅ Matched Skills
              </h4>

              {matchedSkills.length > 0 ? (
                <ul>
                  {matchedSkills.map((skill, index) => (
                    <li key={index}>
                      {skill}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No matching skills found.</p>
              )}

              {/* Missing Skills */}
              <h4 className="text-danger">
                ❌ Missing Skills
              </h4>

              {missingSkills.length > 0 ? (
                <ul>
                  {missingSkills.map((skill, index) => (
                    <li key={index}>
                      {skill}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No missing skills found.</p>
              )}

              {/* Suggestion */}
              <div className="alert alert-warning">
                💡 {suggestion}
              </div>

              {/* PDF Download */}
              <button
                className="btn btn-success"
                onClick={downloadPDF}
              >
                📥 Download PDF Report
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadResume;